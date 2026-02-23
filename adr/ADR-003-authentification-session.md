# ADR N°3 — Choix du mécanisme d’authentification utilisateur

**Statut :** Appliqué  

---

## Contexte

L’application initiale ne comportait pas d’authentification.

Dans la refonte, une authentification a été ajoutée afin de protéger les routes CRUD (`/items`) et d’associer les données à un utilisateur identifié.

Le backend est développé en Node.js / Express et déployé via Docker Compose avec une seule instance du service `backend`.

L’authentification doit permettre l’inscription (`/register`), la connexion (`/login`) et la déconnexion (`/logout`).

L’implémentation actuelle repose sur `express-session`, avec stockage de l’identifiant utilisateur dans `req.session.userId`.

---

## Options

Différentes options d’authentification sont disponibles.

### Option 1 : Authentification par session

Le serveur crée une session après authentification et stocke l’utilisateur côté serveur. Le client reçoit un cookie HTTP-only (`sessionId`) automatiquement envoyé à chaque requête.

Les avantages incluent une implémentation simple avec Express, une gestion naturelle du logout via `session.destroy()`, l’utilisation d’un cookie HTTP-only réduisant l’exposition aux attaques XSS et l’absence de gestion complexe de tokens côté frontend.

Les inconvénients sont qu’il s’agit d’une authentification stateful (dépendante d’un stockage serveur), que les sessions sont perdues en cas de redémarrage du backend (MemoryStore par défaut) et qu’un store partagé est nécessaire en cas de multi-instance.

### Option 2 : Authentification par token (JWT)

Le serveur génère un token signé renvoyé au client, qui doit l’envoyer à chaque requête.

Les avantages incluent une approche stateless et une meilleure adaptation au scaling horizontal.

Les inconvénients sont une gestion plus complexe (expiration, refresh tokens, révocation), un risque accru si le stockage côté navigateur est mal maîtrisé et un logout moins immédiat sans mécanisme supplémentaire.

---

## Décision

Le choix s’est porté sur l’authentification par session.

Ce choix est cohérent avec l’architecture actuelle (une seule instance backend dans Docker Compose) et permet une implémentation simple, lisible et adaptée à l’échelle du projet.

L’authentification par token a été considérée, mais elle introduit une complexité supplémentaire non nécessaire pour le périmètre actuel de l’application.

---

## Conséquences

Les bénéfices portés par ce choix sont une implémentation simple et maintenable, l’absence de gestion de token côté frontend ainsi qu’une bonne intégration avec Express.

Les inconvénients sont la perte des sessions en cas de redémarrage du backend et la dépendance à un store serveur.

Concernant les impacts futurs, en cas de montée en charge avec plusieurs instances backend, un store de session partagé (par exemple Redis) devra être ajouté. Une migration vers JWT resterait possible si l’API devait être exposée à plusieurs clients ou nécessiter un scaling important.