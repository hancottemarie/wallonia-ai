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
npm run dev
uvicorn main:app --reload
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
20. avec vite.js quoi ça sert : Vite.js est un "build tool" (un outil de construction). Son rôle est de préparer ton code pour qu'il soit compréhensible par le navigateur.
Serveur lance : sur http://localhost:5173/
Maintenant Backend(python/C) et frontend(React)pret a l'emploi
21. install tailwind C'est un framework CSS "utility-first".
    À quoi ça sert : Au lieu d'écrire de longs fichiers .css séparés, tu écris des classes directement dans ton HTML (ex: class="text-blue-500 font-bold").

22. Dans le dossier frontend/src, on va créer un dossier nommé components.
❓ C'est quoi un Composant en React ?

Imagine que ton site est un jeu de LEGO.

    Un composant est une brique (ex: un bouton, une barre de recherche, une carte de ville).

    À quoi ça sert : On découpe l'interface en petits morceaux indépendants.

    Avantage : Si tu veux changer le design de toutes tes cartes de villes, tu ne modifies qu'un seul fichier (le composant Card), et tout le site se met à jour.
23. JSX: jsvascript xml : extension de syntaxe pour javascript melange de java +html. POURQUOI? : ecrit la structure de mon interface (html). en gros on passe de React.createElement('h1', {className: 'title'}, 'Hello') ------a------<h1 className="title">Hello</h1>
Vite a un role : chrome et safari ne savent pas voir jsx donc vite le transforme en javascript pur pour la comprehension du navigateur.
24. export de TravelForm.jsx permet a React de comprendre que on veut utiliser la brique qu'on a creer donc export dans travelform et import dans App.jsx
POURAUOI IMPORTANT: en React, l'application est un Arbre de composants App.jsx est la racine tandis que par ex TravelForm est plutot comme une branche.
25. e.preventDefault() Par défaut : En HTML, quand tu valides un formulaire, le navigateur essaie d'envoyer les données et de recharger la page.

En React : On ne veut jamais que la page se recharge (on appelle ça une Single Page Application). e.preventDefault() dit au navigateur : "Stop, ne recharge pas, je vais gérer l'envoi moi-même avec JavaScript".

26. ❓ C'est quoi Axios ?

C'est un "client HTTP": À quoi ça sert : C'est le messager qui va aller voir ton Backend Python (FastAPI) pour lui dire : "Hé, l'utilisateur veut un voyage 'Adventure' avec 100€ de budget, tu me donnes les résultats ?".

Pourquoi pas fetch (l'outil par défaut) ? Axios est plus robuste, gère mieux les erreurs et possède une syntaxe plus simple pour envoyer des données complexes.
27. amelioration dans /frontend/src/app.jsx pour avoir meilleure interaction avec utilisateur.
28. Deboggage de l'app car parfois meme resultat pour filtres differents qui peut venir de differentes choses:
 - front
 - back
 - Donnees
29. etape 1: console log : /frontend/src/app.jsx fonction handleSearch. Print debug : "	console.log("Données envoyées au serveur :", formData);"
quand dans navigateur f12 ->console-> on voit changement budget donc c'est du cote python le probleme.
30. main.py: peut etre 2 causes ou alors dans le main.py le base_score des villes est de 5 donc pour contre balancer avec culture c'est compliquer.
ou alors le filtrage n'est pas strict je calcule un score mais trop peu de villes differentes dans mon json.
31. changements operes : dans et le main.py et dans destinations.json pour : avoir plus de differences au niveau du budget entre les attractions et dans main.py filtres plus strict egalement dans la boucle for.
32. Rajout de features:
- IA conversationelle (UX de Chat) qui si;ule une ia qui reflechit et nous repond (petit texte au dessus des cartes)
- une carte interactive : On va utiliser React Leaflet (une bibliothèque gratuite et ultra-légère). Elle permet d'afficher une carte OpenStreetMap avec des marqueurs personnalisés.

Le concept : Quand l'IA trouve une ville, un marqueur avec l'icône de la catégorie (ex: un monument pour "Culture") apparaît sur la carte de la Wallonie.
33. Features complementaires :
- Mode Sombre (Dark Mode) : Un classique, mais indispensable pour le confort.

- Filtrage par Province : Ajouter un sélecteur pour limiter la recherche à Namur, Liège, etc.

- Export PDF du Roadtrip : Un bouton pour générer un petit itinéraire avec les résultats.

- Real-time Weather : Utiliser une API météo pour afficher le temps actuel dans les villes suggérées.
34. Ajout d'images supplementaires(TODO :images specifiques pour chaque destinations dans destinations.json) et icone sur la carte(TODO :a ammeliorer+ TODO: sur carte coffre-fort sur carte) plus random dans le main.py pour des % differents.
35. ajout de barre de recherche en temps reel via app.jcx et le main.py STILL TO FIX
36. dans tailwind.config.js pour le mode sombre debug complet du darkmode Tailwind v.4 suit le systeme par defaut, Il y a un ordre de priorite : Un style injecte en JS (le bouton)doit etre explicitement declare dans le CSS pour que Tailwind l'ecoute. Le selecteur :not(.dark) est un excellent moyen de garantir qu'un style ne s'applique que dans un etat precis.
37. TODO: supplementaire fix le bouton darkmode qui disparait derriere la carte. C'est pas tres subtil.
38. TODO: FIX barre de recherche+son icone
39. Debut de feature supllementaire : filtrage par province;
40. Pour rajouter cette feature il faut agir et au niveau du backend et du frontend. Pour le Backend : changement dans main.py Ajout de : - Recuperation de la province au debut de la fonction : selected_province = prefs.province.lower().strip() if prefs.province else ""
Ajout d'un Bloc de filtrage qui verifie si la province de la destination correspond a celle demandee. Si pas de match continue pour ignorer le lieu immediatement



