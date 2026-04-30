# wallonia-ai
 ---------------
auto-save : ./commit.sh
 ----------
interactif with progress completion
-----
usage of :
- webscraper.io
- make.com
-----
Limit : Tape 1 pour ton premier test réel. Une fois que la première ligne est validée dans ton Google Sheet, tu reviendras ici pour mettre 180.
-----
Etapes:
1. via le site webscraper.io scrap des attractions vers fichier csv
2. transformer celui-ci e google sheet
3. via make.com faire un scenario partant de mon google sheet->gemini pour transformer les infos en json ->google sheet pour noter resultat dans nouvelle colonne
4. resultat mis dans /data/destinations.json
prepa de l'environnement python
5. dans backend python -m venv venv et activer pour bosser proprement
6. pip install fastapi uvicorn # On sauvegarde les dépendances pour le futur recruteur
pip freeze > requirements.txt
7. creation du serveur dans main.py qui va charger automatiquement destinations.json
8. pre-vue dispo deja sur : http://127.0.0.1:8000/destinations ou http://127.0.0.1:8000/docs
9. Rajout d'une "conscience" dans le but de : "Algorithme calcule un score de pertinence pour chaque destination en fonction des poids accordés aux préférences utilisateur."
10. utilisation de pydantic et modif du main.py pour les recommandation pour le user en fonction de ses preferences. avec ordre de criteres vibe en priorite puis budget puis province mais optionnel -- ajoutre aue si score min est atteint (optionnel) et Enfin un tri par ordere decroissant. et renvoi du top 5.
11. test via backend->act venv->"uvicorn main:app --reload" ensuite aller sur url 127.0.0.1
12. dans core-engine.scoring.c creations d'une fonction qui calcule un score final pondere. Fonction qui sera appelee par python elle prend des multiplicateurs et renvoie un score final.
13. afin que le code soit utilisable je transfoirme le .c en bibliotheque partagee .so
14. modif de main.py pour appeler la bibliotheque ctypes pour appeler la fonction c :  Chargement de la librairie C, Adapte l'extension .so ou .dll selon ton OS, Définition des types d'entrée et de sortie pour la fonction C. APPEL AU MOTEUR EN C, Imaginons un multiplicateur de 1.2 et une pénalité de 1
15. Changement dans le main.py AVANT : os.path.join("..", ) Maintenant on utilise l'objet path qui gere mieux les /, \ peut importe l'env os.
16. ajout egalement d'une securite si scoring_lib existe avant de l'utiliser pour pas crasher tt le serveux si oublie de compilation de la lib C.
17. ajout API-Key de groq pour modele llama3. utilisation seulement sur top 3 pour limiter usage API et activation que a la fin de main.py
18. dans main.py chargement de la lib C avec protection si impossible de charger fallback sur python
19. A present API repond avec du JSON contenant scores calcules en C + descriptions generees par une IA. Utilisation de Vite.js(pour la rpidite). Tailwind CSS(design) Lucide-react(Icones)
20. avec vite.jsquoi ça sert : Vite.js est un "build tool" (un outil de construction). Son rôle est de préparer ton code pour qu'il soit compréhensible par le navigateur.
Serveur lance : sur http://localhost:5173/
Maintenant Backend(python/C )
21. install tailwind C'est un framework CSS "utility-first".

    À quoi ça sert : Au lieu d'écrire de longs fichiers .css séparés, tu écris des classes directement dans ton HTML (ex: class="text-blue-500 font-bold").

    Pourquoi on l'utilise :

        C'est ultra rapide pour créer des interfaces professionnelles.

        Ça évite d'avoir des fichiers CSS géants et illisibles.

        C'est le framework le plus demandé en entreprise aujourd'hui.
22. Dans le dossier frontend/src, on va créer un dossier nommé components.
❓ C'est quoi un Composant en React ?

Imagine que ton site est un jeu de LEGO.

    Un composant est une brique (ex: un bouton, une barre de recherche, une carte de ville).

    À quoi ça sert : On découpe l'interface en petits morceaux indépendants.

    Avantage : Si tu veux changer le design de toutes tes cartes de villes, tu ne modifies qu'un seul fichier (le composant Card), et tout le site se met à jour.
23. ❓ C'est quoi Axios ?

C'est un "client HTTP".

    À quoi ça sert : C'est le messager qui va aller voir ton Backend Python (FastAPI) pour lui dire : "Hé, l'utilisateur veut un voyage 'Adventure' avec 100€ de budget, tu me donnes les résultats ?".

    Pourquoi pas fetch (l'outil par défaut) ? Axios est plus robuste, gère mieux les erreurs et possède une syntaxe plus simple pour envoyer des données complexes.
