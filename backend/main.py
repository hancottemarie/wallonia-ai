import ctypes
import os
import json
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Wallonia AI API")

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = BASE_DIR.parent / "data" / "destinations.json"

LIB_PATH = BASE_DIR.parent / "core-engine" / "scoring.so" # ou .dll sur Windows

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

    return sorted(scored_destinations, key=lambda x: x["match_score"], reverse=True)[:5]
