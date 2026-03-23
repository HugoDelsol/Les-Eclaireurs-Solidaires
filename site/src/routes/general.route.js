
/* const sessionMdw = require('../middleware/session.middleware');
const messagingProtection = require('../middleware/messagingProtection.middleware');

const urlProtection = require('../middleware/url.middleware');

const userGeneralCtrl = require("../controllers/user/userGeneralController");
const messagingCtrl = require('../controllers/messaging.ctrl'); */

// ---------------------------------------------------------
// 🏗️  INFRASTRUCTURE & CONFIGURATION (Express, DB, Middleware)
// ---------------------------------------------------------
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ---------------------------------------------------------
// 🛡️ MIDDLEWARES
// ---------------------------------------------------------
const inputProtection = require('../middleware/inputProtection.middleware');

// ---------------------------------------------------------
// 📦 MODELS (Accès direct à la base de données)
// ---------------------------------------------------------
const MissionModel = require("../models/MissionModel"); 
const HomeModel = require("../models/HomeModel");
const UserModel = require("../models/UserModel");

const missionModel = new MissionModel(db);
const homeModel = new HomeModel(db);
const userModel = new UserModel(db);

// ---------------------------------------------------------
// ⚙️ SERVICES & UTILS (Logique métier et outils)
// ---------------------------------------------------------
const Utils = require("../utils/utils"); 
const Services = require("../services/services"); 
const HomeService = require("../services/HomeService");
const UserService = require("../services/UserService");

const utils = new Utils();
const service = new Services(missionModel, utils);
const homeService = new HomeService(homeModel);
const userService = new UserService(userModel, missionModel);

// ---------------------------------------------------------
// 🕹️ CONTROLLERS (Gestion des requêtes HTTP)
// ---------------------------------------------------------
const HomeController = require("../controllers/home.ctrl");
const UserGeneralController = require("../controllers/user/userGeneralController");
const UserVolunteerController = require("../controllers/user/userVolunteerController");
const MissionVolunteerController = require("../controllers/mission/missionVolunteerController");

const homeController = new HomeController(service, homeService);
const userGeneralController = new UserGeneralController(userService);
const userVolunteerController = new UserVolunteerController(userService);
const missionVolunteerController = new MissionVolunteerController(userService);

// ---------------------------------------------------------
// 🚥 ROUTES
// ---------------------------------------------------------

router.get('/', 
    homeController.homePage,
);

router.get('/becomeVolunteer', 
    homeController.becomeVolunteer
);
 
router.post('/homeForm', 
    inputProtection.homeFormProtection, 
    homeController.submitForm
);

router.get('/signUp', 
    userGeneralController.signUp
);

router.get('/signIn', 
    userGeneralController.signIn
);

router.post('/auth', 
    inputProtection.signInFormProtection, 
    userGeneralController.auth
);






// PUBLIC - HOME PAGES & FORMS -----------------------------
// ---------------------------------------------------------


// USER AUTHENTICATION & SIGNUP - SIGNIN -------------------
/*



// --------------------------------------------------------- 

// ==============================================
// === CHAT & MESSAGING ========================
// ==============================================

router.get('/chatMessage/:idChannel', 
    sessionMdw.requireAuth, 
    urlProtection.urlMustBeANumberForMessageChannel, 
    messagingCtrl.messageRediger
);

router.post('/replyToAMessage', 
    sessionMdw.requireAuth, 
    messagingProtection.chatMessagingProtection, 
    messagingCtrl.replyToAMessage
);

router.get('/newMessage', 
    sessionMdw.requireAuth, 
    messagingCtrl.newMessageRediger
);

// ==============================================
// === LOGOUT / SESSION MANAGEMENT =============
// ==============================================

router.get('/logout', 
    sessionMdw.logout
); */

module.exports = router;