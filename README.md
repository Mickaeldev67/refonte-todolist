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
# Pour les développeurs 

Lancer les tests backend, dans le dossier **backend** ouvrir un terminal et tapez : 
npm run test 

Lancer les tests frontend, dans le dossier **frontend** ouvrir un terminal et tapez : 

npx playwright test
1. Création d’un projet
2. Création d’une tâche sur le projet
3. Marquer la tâche comme terminée
4. Vérifier la présence de la notification dans les logs

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