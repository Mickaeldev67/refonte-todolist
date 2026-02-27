# ADR N°5 — Choix du message broker 
## Titre : Choix du message broker 
## Status : Accepted 
## Contexte : 
Dans le cadre d’un projet de refonte d'une application de todolist vers un outils de gestion de projet kanban nous devons choisir le système de message broker
## Options : 
Redis : Déjà utilisé par l'intérmédiaire de Magento par l'un de notre équipe.
RabbitMQ : pas de compétences dans l'équipe, juste entendu parlé pour système de notification.
## Décision : 
Nous choisissons RabbitMQ qui est plus spécialisé en ce qui concerne le message broker et correspond mieux aux types d'architecture microservices basées sur des évènements.

## Conséquences : 
Positives : Conçu spécialement comme message broker, très adaptés aux architectures microservices, garantie de livraison (persistence)
Négatives : Ne permet pas la mise en cache comme le ferais Redis 
Impacts futures : Cela permettra de garantir la livraison des notfications par la persitence, la mise en cache étant optionnel en raison de la faible scalabilité de notre application.
