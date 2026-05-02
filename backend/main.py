import ctypes
import os
import json
import random
import requests
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv

# --- CONFIGURATION ---
app = FastAPI(title="Wallonia AI API")

# Configuration du CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "data" / "destinations.json"
LIB_PATH = BASE_DIR.parent / "core_engine" / "scoring.so"

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# --- CHARGEMENT LIBRAIRIE C ---
scoring_lib = None
if not LIB_PATH.exists():
    print(f"❌ Erreur : Librairie introuvable à {LIB_PATH}")
else:
    try:
        scoring_lib = ctypes.CDLL(str(LIB_PATH))
        scoring_lib.calculate_match_score.argtypes = [ctypes.c_int, ctypes.c_float, ctypes.c_int]
        scoring_lib.calculate_match_score.restype = ctypes.c_float
        print("✅ Librairie C chargée avec succès")
    except Exception as e:
        print(f"❌ Erreur technique : {e}")

# --- HELPERS ---
def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_ai_recommendation(city_name: str, category: str):
    """Génère une description via Llama 3"""
    try:
        prompt = f"""
Act as a luxury travel agent in Wallonia.
The user wants a {category} trip.
Give 2 sentences for {city_name}.
Sentence 1: Why it's a hidden gem.
Sentence 2: A specific local tip (a dish to eat or a street to see).
Be witty and professional.
"""
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error AI: {e}")
        return "A wonderful hidden gem in Wallonia waiting to be explored."

# On change le paramètre pour prendre lat et lng au lieu de city_name
def get_weather_by_coords(lat: float, lng: float):
    api_key = os.environ.get("OPENWEATHER_API_KEY")
    # L'URL utilise lat={lat} et lon={lng} pour une précision maximale
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={api_key}&units=metric&lang=fr"
    try:
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            data = response.json()
            return {
                "temp": round(data["main"]["temp"]),
                "icon": data["weather"][0]["icon"],
                "desc": data["weather"][0]["description"]
            }
    except:
        pass
    return None

# --- MODELES ---
class UserPreferences(BaseModel):
    vibe: str
    budget_max: int
    province: Optional[str] = None
    search_query: Optional[str] = ""

# --- ROUTES ---

@app.get("/")
def home():
    return {"status": "Wallonia.ai Engine Online", "c_engine": scoring_lib is not None}

@app.post("/recommend")
def recommend_destinations(prefs: UserPreferences):
    data = load_data()
    scored_destinations = []

    search_term = prefs.search_query.lower().strip() if prefs.search_query else ""
    selected_province = prefs.province.lower().strip() if prefs.province else ""

    for dest in data:
        # Filtre Province
        if selected_province and selected_province != "toutes":
            dest_prov = str(dest.get("province", "")).lower().strip()
            if selected_province not in dest_prov:
                continue

        # Filtre Recherche
        if search_term and search_term not in dest.get("name", "").lower():
            continue

        # Filtre Budget
        if dest.get("budget_index", 1) > prefs.budget_max:
            continue

        base_score = 5
        dest_cat = str(dest.get("category", "")).lower()
        pref_vibe = str(prefs.vibe).lower()

        culture_keywords = ["musée", "culture", "histoire", "château", "patrimoine"]
        adventure_keywords = ["aventure", "sport", "nature", "randonnée", "escalade"]

        if pref_vibe == "culture" and any(k in dest_cat for k in culture_keywords):
            base_score += 50
        elif pref_vibe == "adventure" and any(k in dest_cat for k in adventure_keywords):
            base_score += 50
        elif dest_cat == pref_vibe:
            base_score += 50

        for tag in dest.get("tags", []):
            if tag.lower() == pref_vibe:
                base_score += 10

        if scoring_lib:
            try:
                raw_score = scoring_lib.calculate_match_score(int(base_score), 1.1, 1)
            except:
                raw_score = base_score * 1.1
        else:
            raw_score = base_score * 1.1

        variation = random.uniform(0, 5)
        final_percentage = min(raw_score + variation, 99.9)

        new_dest = dest.copy()
        new_dest["match_score"] = round(final_percentage, 1)
        scored_destinations.append(new_dest)

    top_results = sorted(scored_destinations, key=lambda x: x["match_score"], reverse=True)[:3]

    # ... (après le tri des top_results)
    for res in top_results:
        res["ai_description"] = get_ai_recommendation(res["name"], res.get("category", "Culture"))

        # --- AJOUT : ON RÉCUPÈRE LES COORDONNÉES DE LA DESTINATION ---
        coords = res.get("coordinates", {})
        lat, lng = coords.get("lat"), coords.get("lng")

        # On ne cherche par coordonnées que si elles existent
        if lat and lng:
            res["weather"] = get_weather_by_coords(lat, lng)

    return top_results

# --- NOUVELLE ROUTE : GENERATEUR D'HISTOIRE PDF ---
@app.post("/generate-itinerary-story")
def generate_story(cities: List[dict]):
    """Génère un récit de voyage cohérent reliant les étapes de l'itinéraire"""
    city_names = [c.get('name', 'Inconnu') for c in cities]

    prompt = f"""
Rédige un itinéraire de voyage de luxe en Wallonie reliant ces étapes dans l'ordre précis : {', '.join(city_names)}.
Pour chaque ville :
1. Partage une anecdote historique captivante ou un secret local.
2. Décris l'ambiance de la route vers l'étape suivante.
Utilise un ton professionnel, inspirant et élégant (style Guide Voyage de Luxe).
Reste concis mais riche en détails.
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile", # <--- CORRIGÉ ICI (llama-3.3)
        )
        return {"story": chat_completion.choices[0].message.content}
    except Exception as e:
        # Affiche l'erreur réelle dans ton terminal pour débugger
        print(f"❌ Erreur Story AI : {e}")
        return {"story": "Un voyage extraordinaire vous attend à travers les paysages pittoresques de la Wallonie."}

@app.get("/city-details/{city_name}")
async def get_city_details(city_name: str, weather: str):
    prompt = f"""
    Agis comme un rédacteur de blog voyage luxe pour Visit Wallonia.
    Rédige une fiche pour la ville de {city_name}. La météo actuelle est : {weather}.

    Réponds UNIQUEMENT au format JSON strict avec ces clés :
    - intro_blog: un texte de 3 phrases invitant et poétique.
    - meteo_conseil: un conseil d'activité spécifique à cette ville s'il fait {weather}.
    - top_restos: une liste de 3 objets (nom, specialite, ambiance).
    - secret_spot: un lieu méconnu à visiter.
    """

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    return json.loads(completion.choices[0].message.content)
