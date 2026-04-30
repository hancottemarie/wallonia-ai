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

if not LIB_PATH.exists():
    print(f"❌ Erreur : Librairie introuvable à {LIB_PATH}")
    scoring_lib = None
else:
    scoring_lib = ctypes.CDLL(str(LIB_PATH))
    scoring_lib.calculate_match_score.argtypes = [ctypes.c_int, ctypes.c_float, ctypes.c_int]
    scoring_lib.calculate_match_score.restype = ctypes.c_float
    print("✅ Librairie C chargée avec succès")

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/")
def home():
    return {"status": "Wallonia.ai Engine Online"}

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


        final_score = scoring_lib.calculate_match_score(base_score, 1.2, 1)

        dest_with_score = dest.copy()
        dest_with_score["match_score"] = final_score
        scored_destinations.append(dest_with_score)

	top_results = sorted(scored_destinations, key=lambda x: x["match_score"], reverse=True)[:3]
	for res in top_results:
		res["ai_description"] = generate_ai_description(res["name"], res["vibe"])

	return top_results

def generate_ai_description(city_name: str, vibe: str):
    prompt = f"""
    En tant qu'expert en tourisme belge, écris une description courte et captivante (max 3 phrases)
    pour la ville de {city_name} en Wallonie.
    Le ton doit être adapté à une ambiance '{vibe}'.
    Explique pourquoi c'est une meilleure alternative aux villes bondées comme Bruges.
    """

    completion = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
    )
    return completion.choices[0].message.content
