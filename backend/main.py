from fastapi import FastAPI
import json
import os

app = FastAPI(title="Wallonia AI API")

# Chemin vers tes données
DATA_PATH = os.path.join("..", "data", "destinations.json")

def load_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/")
def home():
    return {"message": "Welcome to Wallonia.ai API", "status": "running"}

@app.get("/destinations")
def get_all_destinations():
    data = load_data()
    return data

@app.get("/destinations/{dest_id}")
def get_one_destination(dest_id: int):
    data = load_data()
    destination = next((item for item in data if item["id"] == dest_id), None)
    return destination or {"error": "Destination not found"}
