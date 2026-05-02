# 🏰 Wallonia.ai : Intelligence Artificielle & Planification de Roadtrip

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![C Language](https://img.shields.io/badge/Engine-C_Language-A8B9CC?style=for-the-badge&logo=c&logoColor=white)](https://en.cppreference.com/w/c)
[![Tailwind CSS](https://img.shields.io/badge/Design-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Wallonia.ai** est une plateforme intelligente de recommandation de voyage conçue pour explorer les pépites de la Wallonie. Ce projet démontre une architecture full-stack hybride mêlant la performance du **C**, la flexibilité de **FastAPI** et une interface **React 19** immersive enrichie par l'IA générative.

---

## 🚀 Architecture & Workflow Technique

### 1. Pipeline de Données (ETL & IA)
Le projet utilise un flux de données automatisé pour garantir des informations riches et structurées :
*   **Extraction** : Scraping ciblé via `webscraper.io`.
*   **Transformation IA** : Orchestration via `Make.com` (Scenario : Google Sheets ↔ Gemini) pour transformer les données brutes en JSON sémantique.
*   **Validation** : Monitoring de la progression via Google Sheets (limite de test à 1, puis déploiement à 180 entrées).

### 2. Core Engine : Performance & Scoring (C / Python)
Pour maximiser la réactivité, les calculs mathématiques sont déportés :
*   **Moteur C** : Une librairie partagée (`scoring.c` -> `.so`) calcule un score pondéré (Vibe, Budget, Province) avec une précision de bas niveau.
*   **Interopérabilité** : Utilisation de `ctypes` en Python pour appeler la fonction C avec une sécurité de fallback (calcul Python si la lib C est absente).
*   **Logique de Tri** : Tri décroissant des scores et renvoi du **Top 5** via Pydantic pour une validation de données stricte.

### 3. Backend : FastAPI & Intelligence Narrative
*   **IA Conversationnelle** : Utilisation de **Groq (Llama 3.1 & 3.3)** pour générer des descriptions uniques ("Hidden Gems") et rédiger le récit de voyage final.
*   **Temps Réel** : Intégration de l'API OpenWeather pour enrichir chaque destination avec la météo actuelle.
*   **Sécurité** : Gestion dynamique des chemins (objets `pathlib`) pour une compatibilité cross-platform (OS) totale.

### 4. Frontend : Interface Moderne & Immersive
*   **Composants React** : Architecture "LEGO" avec des composants indépendants (TravelForm, CityDetailDrawer, SortableItem).
*   **Cartographie** : Intégration de `React Leaflet` pour une visualisation interactive des destinations suggérées.
*   **Planification Interactive** : Système de **Drag & Drop** (@dnd-kit) pour réorganiser son itinéraire en temps réel.
*   **City Details (Style Blog)** : Un panneau latéral gauche inspiré des blogs de voyage (VisitWallonia) avec photos dynamiques, météo complète et recommandations IA (restaurants, secrets locaux).
*   **Export PDF** : Génération d'un carnet de route luxueux via `jsPDF`, incluant le récit narratif généré par l'IA.

---

## 🛠️ Installation & Démarrage

### Backend (Python & C)
1. **Compiler la librairie C** :
   ```bash
   cd core_engine
   gcc -shared -o scoring.so -fPIC scoring.c
