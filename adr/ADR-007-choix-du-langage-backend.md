# ADR N°5 — Choix du langage backend 
## Titre : Choix du langage backend
## Status : Accepted 
## Contexte : Dans le cadre de la refonte d'une application Todolist vers une application de gestion de projet type kaban nous devons faire un choix de langage pour les différents services backend. 
## Options : 
Node JS + express Compétences de l’équipe + déjà un service codé avec cette technologie
PHP : compétences de l'équipe, nécessite de refactoriser un service ou couplé Node + PHP. 
## Décision : 
Node JS + Express : Ce choix permet de conserver une cohérence technologique entre les différents microservices et de réutiliser le code existant.

## Conséquences : 
Positives : Réutilisation du code déjà existant, cohérence technologique entre les services. Développement plus rapide grâce aux compétences déjà présentes dans l'équipe. 
Négatives : Performances parfois inférieures à certains langages compilés pour des traitement très lourds. Nécessite une bonne organisation du code pour maintenir une architecture claire. 
Impacts futures : Facilite la maintenance et l'évolution du projet. 
