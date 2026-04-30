from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import json
import os

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
        score = 0

        if dest["vibe"].lower() == prefs.vibe.lower():
            score += 10

        if dest["budget_level"] <= prefs.budget_max:
            score += 5
            if dest["budget_level"] == prefs.budget_max:
                score += 2

        if prefs.province and dest["province"].lower() == prefs.province.lower():
            score += 8

        dest_with_score = dest.copy()
        dest_with_score["match_score"] = score
        scored_destinations.append(dest_with_score)

    recommendations = sorted(scored_destinations, key=lambda x: x["match_score"], reverse=True)

    return recommendations[:5]
