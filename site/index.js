// ------------------------------------
// 📦 IMPORTS DES MODULES
// ------------------------------------
const middleware = require('../site/src/middleware/globalVars.middleware')
const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

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
const userRoute = require('./src/route/user.route');
const adminRoute = require('./src/route/admin.route');

app.use(middleware.centralizedVar);
app.use(middleware.userData);

// Routes publiques (site utilisateur)
app.use('/', userRoute);

// Routes administrateur (interface d'administration)
app.use('/admin', adminRoute);

// Page 404 pour les routes non trouvées
app.use((req, res) => {

  //console.log('--req', req)

    res.status(404).render('home/404');
});

// ------------------------------------
// 🚀 LANCEMENT DU SERVEUR
// ------------------------------------
app.listen(port, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${port}`);
});
