# 🏰 Wallonia.ai : Ingénierie Logicielle & IA Hybride

**Wallonia.ai** est une plateforme intelligente de planification de roadtrip conçue pour explorer les trésors de la Wallonie. Ce projet ne se limite pas à une interface élégante ; il s'agit d'un écosystème full-stack intégrant de la performance bas niveau (**C**), une orchestration **Python/FastAPI** robuste et une interface **React 19** immersive assistée par **IA Générative**.

---

## 🏗️ Architecture & Choix Technologiques

### 1. Data Pipeline : Du Brut au Sémantique
Le cycle de vie de la donnée a été conçu pour automatiser l'enrichissement sémantique :
*   **Ingestion (WebScraper.io)** : Extraction de données brutes depuis les portails touristiques.
*   **Enrichissement IA (Make.com + Gemini)** : Orchestration d'un workflow automatisant le passage du CSV vers un **Graphe de Connaissances JSON**. L'IA structure les coordonnées GPS, les catégories de budget et les "vibes" pour permettre un filtrage algorithmique précis.
*   **Validation Interactive** : Monitoring de la progression (validation par palier de 1 à 180 entrées) pour garantir l'intégrité de la base de données `/data/destinations.json`.

### 2. Performance Engine : L'approche Hybride C/Python
L'un des piliers du projet est le déport de la logique de calcul de pertinence vers le bas niveau :
*   **Moteur C (`scoring.c`)** : Implémentation d'un algorithme de pondération pondérant les préférences utilisateur (vibe, budget, province).
*   **Interopérabilité via Shared Library (`.so`)** : Compilation en bibliothèque partagée et chargement dynamique via `ctypes`.
*   **Choix d'Ingénierie** : Mise en place d'une sécurité **Fallback**. Si la librairie C est absente ou incompatible, le backend bascule automatiquement sur un moteur Python pur, garantissant la résilience du service.

### 3. Backend : FastAPI & Intelligence Narrative
Le serveur FastAPI agit comme un chef d'orchestre :
*   **Validation Pydantic** : Typage fort et validation des schémas d'entrée pour sécuriser les communications API.
*   **IA Multi-Modèles (Groq)** :
    *   **Llama 3.1 (8b)** : Descriptions ultra-rapides et personnalisées pour chaque destination.
    *   **Llama 3.3 (70b)** : Génération de récits de voyage complexes pour l'export PDF.
*   **Contextualisation Temps Réel** : Intégration de l'API **OpenWeatherMap** pour fournir des conseils basés sur la météo actuelle (ex: suggestions d'activités "indoor" en cas de pluie).

### 4. Frontend : React 19 & UX de Slide
L'interface a été pensée comme une **Single Page Application (SPA)** fluide :
*   **Vite.js** : Choix motivé par la rapidité de build et l'efficacité du HMR (Hot Module Replacement).
*   **Double Drawer System** :
    *   **Tiroir Gauche (Blog)** : Affichage dynamique des détails de la ville avec photos Unsplash/LoremFlickr et conseils IA.
    *   **Tiroir Droit (Sac à dos)** : Gestion d'itinéraire par **Drag & Drop** via `@dnd-kit`.
*   **Layout Réactif** : La zone principale utilise des calculs de marges dynamiques (`ml-[450px]`, `mr-[30%]`) et des transitions CSS `transform` pour une fluidité sans rechargement de page.

---

## 🛠️ Spécifications de la Stack

| Couche | Technologie | Rôle |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Interface réactive & Build tool performant |
| **Styling** | Tailwind CSS v4 | Design "Utility-first" & Dark Mode natif |
| **Backend** | FastAPI (Python 3) | API Gateway & Orchestration IA |
| **Performance** | Langage C | Moteur de scoring pondéré via lib partagée |
| **Intelligence** | Groq (Llama 3.x) | Génération narrative & Secrets locaux |
| **Data** | Make.com / Gemini | Pipeline ETL et structuration JSON |

---

## 📈 Concepts d'Ingénierie Implémentés

*   **Séparation des préoccupations (SoC)** : Découpage clair entre le calcul (C), la logique métier (Python) et l'UI (React).
*   **Single Page Application (SPA)** : Utilisation de `e.preventDefault()` et Axios pour une navigation fluide sans rechargement de page.
*   **Gestion de l'état asynchrone** : Mise en place de **Skeleton Loaders** pour masquer la latence des appels LLM.
*   **Prompt Engineering** : Forçage de format JSON strict pour automatiser l'affichage des recommandations IA sans parsing manuel complexe.

---

## 🚀 Installation & Lancement

### 1. Compiler le moteur C
```bash
cd core_engine
gcc -shared -o scoring.so -fPIC scoring.c

### 2. Lancer le Backend (Python)
cd backend
python -m venv venv
source venv/bin/activate # ou .\venv\Scripts\activate sur Windows
pip install -r requirements.txt
uvicorn main:app --reload
### 3. Lancer le Frontend (React)
