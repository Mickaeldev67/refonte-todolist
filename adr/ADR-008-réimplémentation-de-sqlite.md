# ADR N°8 — Réimplémentation de Sqlite 
## Titre : Réimplémentation de Sqlite 
## Status : Accepted 
## Contexte : Dans le cadre de la refonte d'une application Todolist vers une application de gestion de projet type kaban nous avions enlever la base de test pour la première migration et nous réimplémentons Sqlite pour coller aux fonctionnalités de base de l'appliacation. 
## Décision : 
Sqlite a été réimplémenter dans l'environnement pour les tests. 

## Conséquences : 
Positive : Permet de tester l'application sur une base de données autre que celle qui serait en production.
Négative : Ajoute de la complexité dans l'environnement. 