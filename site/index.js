// ------------------------------------
// 📦 IMPORTS DES MODULES
// ------------------------------------

require('dotenv').config();
const { testDb } = require('../site/src/models/UserModel')
const globalVars = require('../site/src/middleware/globalVars.middleware');
const pathName = require('../site/src/middleware/selectTab');
const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// ------------------------------------
// ⚙️ INITIALISATION DE L'APPLICATION
// ------------------------------------
const app = express();
const port = process.env.PORT || 3000;

// ------------------------------------
// 🧩 CONFIGURATION DE LA SESSION
// ------------------------------------
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PSWRD,
  database: process.env.DB_NAME,
  port: 3300
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // à mettre sur true si HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24h
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// ------------------------------------
// 🧠 MIDDLEWARES GLOBAUX
// ------------------------------------
// Permet d'utiliser req.body en JSON
app.use(express.json());

// Permet d'utiliser req.body avec des formulaires HTML
app.use(express.urlencoded({ extended: true }));

// Définit EJS comme moteur de templates
app.set('view engine', 'ejs');

// Définit le dossier des vues EJS
app.set('views', path.join(__dirname, '/src/views/'));

// Fichiers statiques (CSS, JS, images...)
app.use(express.static(path.join(__dirname, '/src/public')));

// ------------------------------------
// 🚦 ROUTES DE L’APPLICATION
// ------------------------------------
const generalRoute = require('./src/routes/general.route');
const volunteerRoute = require('./src/routes/volunteer.route');
const adminRoute = require('./src/routes/admin.route');

app.use(pathName.tabSelected)

// Injecte des variables globales accessibles dans toutes les vues
app.use(globalVars.centralizedVar);
// Récupère et attache les informations de l'utilisateur 
app.use(globalVars.userData);

// Routes générales (pages communes)
app.use('/', generalRoute);

// Routes publiques (site utilisateur)
app.use('/', volunteerRoute);

// Routes administrateur (interface d'administration)
app.use('/admin', adminRoute);

// Page 404 pour les routes non trouvées
app.use((req, res) => {
  res.status(404).render('home/404');
});

// ------------------------------------
// 🚀 LANCEMENT DU SERVEUR
// ------------------------------------

async function startApp() {

  try {

    await testDb();

    app.listen(port, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${port}`);
    });

  } catch (error) {

    console.error('Échec du démarrage :', error);
  }
}

startApp()


