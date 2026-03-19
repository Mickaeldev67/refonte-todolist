# Comment lancer le projet 
1. Cloner le repo suivant : https://github.com/Mickaeldev67/refonte-todolist.git
2. Faites "cd refonte-todolist" pour entrer dans le projet. 
3. Faite npm install dans : 
   3.a Le dossier racine
   3.b services/auth
   3.c services/notifications
   3.d services/projects
   3.e services/projects 
4. Ensuite pour lancer le projet lancer l'application docker puis tapez les commandes suivantes à la racine du projet : docker-compose up --build
5. Vous pouvez ensuite lancer les différents tests : 
   5.a. backend workflow : allez dans à la racine du projet et tapez : npm run test. 
   5.b. Tasks : allez dans le dossier **services/tasks** et tapez : npm run test
   5.b. Frontend : dans le dossier **frontend** ouvrir un terminal et tapez : 
   npx playwright test

Les différents tests : 
1. Création d’un projet
2. Création d’une tâche sur le projet
3. Marquer la tâche comme terminée
4. Vérifier la présence de la notification dans les logs

# Refonte – Getting Started Application

Ce projet est une refonte de l'application  :
https://github.com/docker/getting-started

La refonte apporte :

- Séparation du back-end et du front-end
- Migration du backend vers Node.js (upgrade de la version utilisée) + TypeScript
- Migration de SQLite vers MySQL
- Mise en place d’une authentification utilisateur (session + bcrypt)
- Architecture multi-conteneurs via Docker Compose
- Tests end-to-end avec Playwright

---

# 🧱 Architecture

L’application est composée de trois services Docker :

- **backend** : API Node.js / Express (port 3000)
- **frontend** : Application TypeScript (port 5173)
- **mysql** : Base de données MySQL 8

Les données MySQL sont persistées via le volume Docker :
mysql-data


---

# ⚙️ Prérequis

- Docker
- Docker Compose

Node.js est requis uniquement si exécution hors Docker.

---

# 🔄 Version Node (hors Docker uniquement)

Si vous lancez le projet localement sans Docker :


nvm install --lts

nvm use 24.13.1

---

# 🚀 Lancer le projet en développement

Lancer, à la raçine du projet : 
docker-compose up --build

Accès aux services :

   Frontend : http://localhost:5173

   Backend API : http://localhost:3000

   MySQL : localhost:3306

---

# 📦 Gestion des dépendances

Les dépendances sont séparées entre :

dependencies : nécessaires à l’exécution

devDependencies : outils de développement, build et tests

Tout était fait automatiquement 


# 📚 Architecture Decision Records (ADR)

Les décisions d’architecture sont documentées dans le dossier `/adr`.

- ADR-001 : Choix du SGBD
- ADR-002 : Choix du mécanisme de hachage
- ADR-003 : Choix du mécanisme d’authentification
- ADR-004 : Choix de l’outil de tests E2E
- ADR-005 : Choix de du message broker
- ADR-006 : Choix du nombre de base de données
- ADR-007 : Choix du langage backend