import ctypes
from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import json
import os


lib_path = Path("../core-engine/scoring.so").absolute()
scoring_lib = ctypes.CDLL(str(lib_path))

scoring_lib.calculate_match_score.argtypes = [ctypes.c_int, ctypes.c_float, ctypes.c_int]
scoring_lib.calculate_match_score.restype = ctypes.c_float

app = FastAPI(title="Wallonia AI API")

DATA_PATH = os.path.join("..", "data", "destinations.json")

class UserPreferences(BaseModel):
    vibe: str
    budget_max: int
    province: Optional[str] = None

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/")
def home():
    return {"status": "Wallonia.ai Engine Online"}

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
