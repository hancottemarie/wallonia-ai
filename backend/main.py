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
        if dest.get("budget_index", 1) > prefs.budget_max:
            continue

        base_score = 5

        dest_cat = str(dest.get("category", "")).strip().lower()
        pref_vibe = str(prefs.vibe).strip().lower()

        if dest_cat == pref_vibe:
            base_score += 60
        else:
            base_score += 10
        if scoring_lib:
            try:
                raw_score = scoring_lib.calculate_match_score(int(base_score), 1.1, 1)
            except:
                raw_score = base_score * 1.1
        else:
            raw_score = base_score * 1.1


        final_percentage = min(raw_score, 99.0)

        new_dest = dest.copy()
        new_dest["match_score"] = round(final_percentage, 1)
        scored_destinations.append(new_dest)

    top_results = sorted(scored_destinations, key=lambda x: x["match_score"], reverse=True)[:3]

    for res in top_results:
        res["ai_description"] = get_ai_recommendation(res["name"], res.get("category", "Culture"))

    return top_results
