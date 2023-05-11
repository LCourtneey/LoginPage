const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('users.db');

const router = express.Router();


router.get('/users', async (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro interno' });
    } else {
      const users = rows.map((row) => ({ id: row.id, username: row.username }));
      res.status(200).json(users);
    }
  });
});
// Rota de registro de usuário
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds); // hash da senha usando bcrypt

  // Inserção do usuário no banco de dados
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      res.status(400).json({ error: 'Usuário já existe' }); // erro caso o usuário já exista
    } else {
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' }); // sucesso na criação do usuário
    }
  });
});

// Rota de login de usuário
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Busca do usuário no banco de dados
  db.get('SELECT password FROM users WHERE username = ?', [username], async (err, row) => {
    if (!row) {
      console.log('Invalid username or password');
      res.status(401).json({ error: 'Nome de usuário ou senha invalidos.' }); // erro caso o usuário não exista
    } else {
      const hashedPassword = row.password;
      const result = await bcrypt.compare(password, hashedPassword); // comparação das senhas

      if (result) {
        console.log('Login successful');
        res.status(200).json({ message: 'Login feito com sucesso' }); // sucesso no login
      } else {
        console.log('Invalid username or password');
        res.status(401).json({ error: 'Nome de usuário ou senha invalidos' }); // erro caso a senha esteja incorreta
      }
    }
  });
});

// Rota para mostrar todos os usuários


router.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  // Exclusão do usuário no banco de dados
  db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(400).json({ error: 'A exclusão do usuário falhou' }); // erro na exclusão do usuário
    } else {
      res.status(200).json({ message: 'Usuário deletado com sucesso!' }); // sucesso na exclusão do usuário
    }
  });
});


router.get('/users/:id', async (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Erro interno' });
    } else if (!row) {
      res.status(404).json({ error: 'Usuário não encontrado' });
    } else {
      const user = { id: row.id, username: row.username };
      res.status(200).json(user);
    }
  });
});

module.exports = router;
