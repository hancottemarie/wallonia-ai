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
12. 
