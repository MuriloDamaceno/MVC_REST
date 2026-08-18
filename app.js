const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const logger = require('./middlewares/logger');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const eventoRoutes = require('./routes/eventoRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger);

app.use(session({
  secret: process.env.SESSION_SECRET || 'chave-troque-em-producao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: false
  }
}));

app.get('/', (req, res) => res.redirect('/eventos'));

app.use('/', authRoutes);
app.use('/eventos', authMiddleware, eventoRoutes);

app.use((req, res) => res.status(404).send('Página não encontrada.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 EventHub rodando em http://localhost:${PORT}`);
});