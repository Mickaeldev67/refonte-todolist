# ADR N°4 — Choix de l’outil de tests end-to-end des parcours utilisateur

**Statut :** Appliqué  

---

## Contexte

Le front-end nécessite des tests automatisés couvrant les parcours utilisateur clés. L’objectif est de tester l’application dans un navigateur réel, en incluant les interactions DOM, afin de valider le comportement global de l’application dans des conditions proches de l’usage réel.

---

## Options

Plusieurs solutions de tests end-to-end ont été envisagées : Playwright, Cypress, Selenium/WebDriver.

### Option 1 : Playwright

Playwright est un framework moderne de tests E2E supportant nativement Chromium, Firefox et WebKit, avec une API JavaScript/TypeScript basée sur async/await. Il s’intègre naturellement dans une stack TypeScript et propose des outils intégrés de diagnostic tels que les traces, captures d’écran et vidéos. Il permet un contrôle fin du navigateur et une exécution adaptée aux environnements d’intégration continue. La mise en place de tests E2E nécessite cependant une certaine rigueur dans la gestion des données et de la stabilité des scénarios.

### Option 2 : Cypress

Cypress est un outil populaire disposant d’un runner interactif facilitant le développement et le debug des tests. Il bénéficie d’une large communauté et d’une expérience développeur appréciée. Toutefois, Cypress repose sur un modèle d’exécution spécifique (command queue) qui diffère du modèle standard async/await, ce qui peut introduire une courbe d’apprentissage et certaines contraintes. Il peut également être moins flexible pour certains scénarios avancés, notamment le multi-onglets ou un contrôle bas niveau du navigateur. Son support multi-navigateurs, bien qu’amélioré, n’a pas été historiquement aussi central que dans Playwright.

### Option 3 : Selenium / WebDriver

Selenium repose sur le standard WebDriver et constitue une solution historique largement utilisée en entreprise. Néanmoins, sa mise en place et sa maintenance sont plus lourdes pour un projet de taille modérée, ce qui en fait une solution potentiellement surdimensionnée dans le contexte actuel.

---

## Décision

Le choix s’est porté sur Playwright. Ce framework offre une intégration cohérente avec TypeScript, un support multi-navigateurs robuste et une API moderne basée sur async/await. Il permet de tester efficacement les parcours utilisateur critiques tout en restant adapté à une exécution en environnement CI.

---

## Conséquences

Les bénéfices attendus sont une validation réaliste des scénarios critiques d’authentification et de gestion des tâches, une bonne intégration avec la stack existante et des outils de diagnostic facilitant la maintenance. Les inconvénients résident principalement dans un temps d’exécution supérieur aux tests unitaires et dans la nécessité de gérer correctement les données de test afin d’assurer la stabilité des scénarios. À terme, la couverture multi-navigateurs pourra être étendue si nécessaire, et les tests E2E pourront être complétés par des tests unitaires et d’intégration afin d’équilibrer performance et fiabilité.