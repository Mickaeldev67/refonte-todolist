# ADR N°2 — Choix du mécanisme de hachage des mots de passe

**Statut :** Appliqué  

---

## Contexte

L’application initiale ne comportait pas d’authentification. Le mot de passe ne doit jamais être stocké en clair. Un mécanisme de hachage sécurisé est nécessaire afin de protéger les utilisateurs en cas de fuite de base, ralentir les attaques par force brute et respecter les bonnes pratiques de sécurité.

---

## Options

Différentes options de hachage sont disponibles.

### Option 1 : bcrypt

bcrypt est une bibliothèque spécialisée dans le hachage de mots de passe avec salage intégré et facteur de coût configurable.

Cette option a été considérée car elle est très répandue dans l’écosystème Node.js. Son intégration est simple grâce aux méthodes `hash` et `compare`, le salage est automatique, le paramétrage s’effectue via un facteur de coût et sa mise en œuvre reste simple et maintenable.

En inconvénients, il s’agit d’un algorithme plus ancien qu’Argon2 et son paramétrage est moins fin.

### Option 2 : argon2

Argon2 est un algorithme moderne recommandé par des standards récents.

Cette option a été considérée car il est plus récent et offre une meilleure résistance théorique aux attaques GPU.

Au niveau des inconvénients, on peut citer un paramétrage plus complexe ainsi qu’un bénéfice marginal pour une application de taille réduite.

Argon2 offre un contrôle plus fin (mémoire, temps, parallélisme), mais cette granularité ajoute une complexité de configuration non nécessaire pour l’échelle actuelle du projet.

### Option 3 : crypto (SHA-256 / SHA-512 natif Node.js)

Cette option a été considérée car elle ne nécessite pas de dépendance externe.

Cependant, elle présente des inconvénients majeurs : vulnérabilité aux attaques par force brute et conception non adaptée au stockage sécurisé de mots de passe.

---

## Décision

Le choix s’est porté sur bcrypt.  

bcrypt offre un niveau de sécurité adapté au projet tout en conservant une implémentation simple. Le facteur de coût (10) permet un équilibre entre sécurité et performance. Argon2 aurait pu être retenu pour des exigences de sécurité plus élevées, mais la complexité de configuration supplémentaire n’est pas justifiée ici.

---

## Conséquences

Le choix d’utiliser bcrypt apporte des bénéfices tels qu’un hachage sécurisé avec salage intégré, une implémentation simple et une intégration directe avec MySQL.

Les inconvénients sont l’introduction d’une dépendance externe et un coût CPU plus élevé lors des opérations de login et d’enregistrement.

Au niveau des impacts futurs, il sera possible d’augmenter le facteur de coût ou de migrer vers Argon2 si les exigences de sécurité évoluent. Aucun impact côté frontend n’est à prévoir.