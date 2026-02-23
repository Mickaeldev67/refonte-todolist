# Mise en production — Application ToDo List

Ce document décrit la procédure de déploiement en production de l’application.

L’application est composée de :
- Un backend Node.js / Express
- Un frontend TypeScript
- Une base de données MySQL
- Une authentification par session (express-session)

---

## 1. Architecture cible en production

Architecture recommandée :

Client → Reverse Proxy (Nginx) → Backend → MySQL

Le reverse proxy permet :
- Terminaison HTTPS
- Redirection HTTP vers HTTPS
- Gestion du domaine
- Possibilité future de load balancing

---

## 2. Prérequis serveur

- Serveur Linux (Ubuntu recommandé)
- Docker
- Docker Compose
- Nom de domaine configuré
- Certificat SSL (Let's Encrypt recommandé)

Installation Docker (Ubuntu) :


sudo apt update
sudo apt install docker.io docker-compose-plugin -y
sudo systemctl enable docker


---

## 3. Configuration des variables d’environnement

En production, aucun secret ne doit être hardcodé.

Créer un fichier `.env` à la racine du projet :


MYSQL_HOST=mysql
MYSQL_USER=appuser
MYSQL_PASSWORD=motdepassefort
MYSQL_DB=tododb
SESSION_SECRET=clefsecreteforte
NODE_ENV=production


⚠️ Ne jamais committer ce fichier dans le repository.

---

## 4. Sécurisation des cookies (important)

En production :

- cookie.secure = true
- sameSite = 'lax' ou 'strict'
- app.set('trust proxy', 1) si derrière Nginx
- SESSION_SECRET doit être robuste et aléatoire

HTTPS est obligatoire.

---

## 5. Lancement en production

Depuis le serveur, à la racine du projet :


docker compose up -d --build


Options utilisées :
- -d : exécution en arrière-plan
- --build : reconstruction des images

Vérification :


docker compose ps
docker compose logs -f


---

## 6. Persistance des données

La base MySQL utilise le volume Docker :


mysql-data


Les données survivent :
- Au redémarrage des conteneurs
- À la reconstruction du backend

---

## 7. Sauvegardes

Sauvegarde manuelle :


docker exec todolist-mysql
mysqldump -u root -p tododb > backup.sql


Recommandations :
- Automatiser via cron
- Stocker les sauvegardes hors serveur (cloud ou stockage distant)

---

## 8. Redémarrage et maintenance

Redémarrage :


docker compose restart


Mise à jour :


git pull
docker compose up -d --build


⚠️ Les sessions seront perdues au redémarrage (MemoryStore).

---

## 9. Montée en charge

Configuration actuelle :
- Une seule instance backend
- Sessions stockées en mémoire

Limites :
- Perte des sessions au redémarrage
- Non adapté au scaling horizontal

Pour supporter plusieurs instances :
- Ajouter Redis comme store de session
- Mettre en place un load balancer

---

## 10. Sécurité minimale recommandée

- HTTPS obligatoire
- Mots de passe forts
- CORS restreint au domaine officiel

---

## 11. Améliorations futures possibles

- Migration vers MySQL managé (cloud)
- Ajout d’un store Redis pour les sessions
- Mise en place d’un pipeline CI/CD
- Monitoring (CPU, mémoire, base de données)
- Centralisation des logs