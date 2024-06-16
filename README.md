# Cleancode - Projet Final

Application web complète (front + back) qui implémente le système de Leitner qui permet d'aider tout personne à apprendre des choses plus efficacement.

## Technos

- Front: React.js
- Back: Express.js
- DB: Postgres

## Installation & Démarrage

### Préréquis

- Node
- Une base de données SQL

### Installation

- Cloner ce repo: `git clone https://github.com/dan1M/cleancode-exam`
- Installer les deps back: `cd cleancode-exam/server && npm i`
- Installer les deps front: `cd ../client && npm i`
- Récupérer vos identifiants de DB
- Dossier `server`: Créer le fichier `.env` à partir du `.env.example` existant `cp .env.example .env`
- Mettre à jour les variables d'environnement locales dans le fichier `.env`
- Lancer les migrations SQL: dossier `server` puis: `npm run migrate`

### Démarrage

- Serveur API: dossier `server` puis `npm run dev` > disponible à l'adresse `http://localhost:8080` (par défaut sans avoir touché à la variable d'env PORT)
- Client front: dossier `client` puis `npm run dev` > disponible à l'adresse `http://localhost:5173`

## Architecture (schémas)

- [DDD](/schemas/DDD.png)
- [Architecture Hexagonale](/schemas/ArchitectureHexagonale.png)

## Groupe

- Daniel MANEA - @dan1M
- Makan KAMISSOKO - @mkamissoko
- Kevin HSU WANG - @Xaless2
