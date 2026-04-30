import ctypes
import os
import json
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv

app = FastAPI(title="Wallonia AI API")
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR.parent / "data" / "destinations.json"
LIB_PATH = BASE_DIR.parent / "core_engine" / "scoring.so"

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

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
        print(f"❌ Erreur technique lors du chargement du C : {e}")

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def get_ai_recommendation(city_name: str, vibe: str):
    """Génère une description unique via Llama 3 (Open Source)"""
    try:
        prompt = f"Expert Belgian travel guide. 2 short sentences for {city_name}, Wallonia. Vibe: {vibe}. Explain why it's better than crowded Bruges. Catchy English."
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error with AI: {e}")
        return "A hidden gem in Wallonia offering an authentic and peaceful Belgian experience."

class UserPreferences(BaseModel):
    vibe: str
    budget_max: int
    province: Optional[str] = None

@app.post("/recommend")
def recommend_destinations(prefs: UserPreferences):
    data = load_data()
    scored_destinations = []

    for dest in data:
        base_score = 0
        if dest["vibe"].lower() == prefs.vibe.lower(): base_score += 10
        if dest["budget_level"] <= prefs.budget_max: base_score += 5

        if scoring_lib:
            final_score = scoring_lib.calculate_match_score(base_score, 1.2, 1)
        else:
            final_score = (base_score * 1.2) - 1

        dest_with_score = dest.copy()
        dest_with_score["match_score"] = final_score
        scored_destinations.append(dest_with_score)

    top_results = sorted(scored_destinations, key=lambda x: x["match_score"], reverse=True)[:3]
    for res in top_results:
        res["ai_description"] = get_ai_recommendation(res["name"], res["vibe"])

    return top_results

@app.get("/")
def home():
    return {"status": "Wallonia.ai Engine Online", "c_engine": scoring_lib is not None}
