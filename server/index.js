const express = require('express');
const sqlite3 = require('sqlite3');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('users.db');

const routes = require('./routes');

app.use(bodyParser.json());

// Configuração do CORS
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Definição das rotas aqui
app.use('/', routes);




app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)');
