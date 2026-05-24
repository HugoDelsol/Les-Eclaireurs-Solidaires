// ------------------------------------
// 📦 IMPORTS DES MODULES
// ------------------------------------
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { startCron } = require('../site/src/cron/cron.js');
const helmetConfig = require('../site/src/middleware/helmet');
const globalVars = require('../site/src/middleware/globalVars.middleware');
const sideNav = require('../site/src/middleware/sideNav.middleware');
const seo = require('../site/src/middleware/seo.middleware');

// ------------------------------------
// ⚙️ INITIALISATION DE L'APPLICATION
// ------------------------------------
const app = express();
//app.use(helmetConfig);
const port = process.env.PORT || 3000;

// ------------------------------------
// 🧩 CONFIGURATION DE LA SESSION
// ------------------------------------
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
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
    sameSite: 'strict'
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

// Génération et injection des métadonnées SEO dans le contexte des vues
app.use(seo.seoReferences);

// Gestion de l'état actif des onglets de la navigation latérale
app.use(sideNav.tabSelected);

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
app.listen(port, () => {
  startCron();
  console.log(`✅ Serveur démarré sur http://localhost:${port}/home`);
});
