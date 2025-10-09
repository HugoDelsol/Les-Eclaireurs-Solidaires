// Importe le module Express (framework pour créer des applications web en Node.js)
const express = require('express');

// Importe le module 'path' de Node.js, utile pour manipuler les chemins de fichiers
const path = require('path');

const session = require('express-session');

const mySqlStore = require("express-mysql-session")(session);

// (Optionnel) Importe 'cors' pour gérer la sécurité des requêtes cross-origin (décommenter si besoin)
// const cors = require('cors')

// Charge les variables d'environnement à partir du fichier .env (par ex : PORT, API_KEY, etc.)
require('dotenv').config();

// Initialise l'application Express
const app = express();

// Définit le port sur lequel le serveur va écouter
// Il prend d'abord la variable d'environnement PORT, sinon utilise 3000 par défaut
const port = process.env.PORT;

// ------ SESSION ------
const sessionStore = new mySqlStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWRD,
    database: process.env.DB_NAME,
    port: 3300
})

app.use(session({
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: false,
        saveUninitialized : true,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, //24h
            httpOnly: true,
            sameSite: 'lax'
        }
    }))

// ---------------------

// Middleware pour analyser les données JSON envoyées par les clients (req.body en JSON)
app.use(express.json());

// Middleware pour analyser les données envoyées en formulaire (req.body en URL-encoded)
// `extended: true` permet de gérer des objets complexes dans le formulaire
app.use(express.urlencoded({ extended: true }));

// Définit EJS comme moteur de template (pour générer du HTML dynamique)
app.set('view engine', 'ejs');

// Indique à Express où se trouvent les fichiers de vues (les fichiers .ejs)
app.set('views', path.join(__dirname, '/src/views/'));

// Autorise l'accès public aux fichiers statiques (CSS, JS, images...) situés dans /src/public
app.use(express.static(path.join(__dirname, '/src/public')));

// ------------------------------------
// DÉFINITION DES ROUTES DE L'APPLICATION
// ------------------------------------

// Importe les routes pour les utilisateurs (site public)
const userRoute = require('./src/route/user.route');

// Importe les routes pour les administrateurs (interface admin)
const adminRoute = require('./src/route/admin.route');
const MySQLStore = require('express-mysql-session');

// Monte les routes admin sous le chemin /admin (ex : /admin/dashboard)
app.use('/admin', adminRoute);

// Monte les routes utilisateur à la racine (ex : /, /contact, /films)
app.use('/', userRoute);

// ------------------------------------
// LANCE LE SERVEUR
// ------------------------------------

// Démarre le serveur Express sur le port défini, et affiche un message dans la console
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
