
export {};

import cors from 'cors';
const express = require('express');
const app = express();
import { createRepository } from './persistence';
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const path = require('path');

app.use(cors({
  origin: 'http://localhost:5173' // ou '*' pour autoriser tout
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));
let db: any;

async function startServer() {
  try {
    // Création et initialisation du repository selon l'environnement
    db = await createRepository();

    // Routes avec injection du repository
    app.get('/items', getItems(db));
    app.post('/items', addItem(db));
    app.put('/items/:id', updateItem(db));
    app.delete('/items/:id', deleteItem(db));

    // Démarrage du serveur
    app.listen(3000, () => console.log('Listening on port 3000'));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();

const gracefulShutdown = async () => {
  try {
    if (db && 'teardown' in db) {
      await db.teardown();
    }
  } catch (_) {}
  process.exit();
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
