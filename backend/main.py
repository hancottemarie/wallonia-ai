import ctypes
import os
import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv

# --- CONFIGURATION ---
app = FastAPI(title="Wallonia AI API")

# Configuration du CORS (Indispensable pour React)
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
        prompt = f"Expert Belgian travel guide. 2 short sentences for {city_name}, Wallonia. Category: {category}. Explain why it's better than crowded Bruges. Catchy English."
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error AI: {e}")
        return "A wonderful hidden gem in Wallonia waiting to be explored."

# --- MODELES ---
class UserPreferences(BaseModel):
    vibe: str
    budget_max: int
    province: Optional[str] = None

# --- ROUTES ---
@app.get("/")
def home():
    return {"status": "Wallonia.ai Engine Online", "c_engine": scoring_lib is not None}

@app.post("/recommend")
def recommend_destinations(prefs: UserPreferences):
    data = load_data()
    scored_destinations = []

    for dest in data:
        base_score = 0

        # CORRECTION : On utilise .get() pour éviter les KeyError
        # On compare 'category' du JSON avec 'vibe' envoyé par le front
        dest_category = dest.get("category", "").lower()
        if dest_category == prefs.vibe.lower():
            base_score += 10

        # CORRECTION : On utilise 'budget_index' (vu dans ton JSON)
        if dest.get("budget_index", 99) <= prefs.budget_max:
            base_score += 5

        # Calcul du score final (C ou Python fallback)
        if scoring_lib:
            final_score = scoring_lib.calculate_match_score(base_score, 1.2, 1)
        else:
            final_score = base_score * 1.2

        new_dest = dest.copy()
        new_dest["match_score"] = round(final_score, 2)
        scored_destinations.append(new_dest)

    # Tri par score et sélection du Top 3
    top_results = sorted(scored_destinations, key=lambda x: x["match_score"], reverse=True)[:3]

    # Ajout de l'IA pour les gagnants
    for res in top_results:
        res["ai_description"] = get_ai_recommendation(res["name"], res.get("category", "Culture"))

    return top_results
