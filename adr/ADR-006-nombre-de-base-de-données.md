# ADR N°5 — Choix du nombre de base de données
## Titre : Choix du nombre de base de données
## Status : Accepted 
## Contexte : 
Dans le cadre de notre projet de refonte todolist vers une application de gestion de projet Kanban style Trello nous
devons choisir l'implémentation de la persistence des données à l'aide d'une ou plusieurs base de données. 
## Options : 
Une base de donnée unique : déjà expérimenter par l'équipe, facilité du mise en place. Cependant, cela introduit un fort couplage entre les services et limite l’indépendance des bounded contexts.
Plusieurs base de données : peu expérimenter par l'équipe, nécessite un temps d'adaptation. Permet d’isoler les données par service et de respecter les principes d’architecture microservices.
## Décision : 
Une base de données pour chaque bounded context qui permettra de garantir l'indépendance de chaque bounded context. 

## Conséquences : 
Positives : Meilleure isolation des bounded contexts, réduction du couplage entre les services. Possibilité de faire évoluer ou scaler chaque service indépendamment. 
Négatives : Complexité plus élevée dans la gestion de plusieurs bases de données. Nécessité de gérer la synchronisation via des événements plutôt que des jointures SQL. 
Impacts futures : Facilite l'évolution vers une architecture distribuée plus complète. Encourage l'utilisation d'une communication par événements entre services. 