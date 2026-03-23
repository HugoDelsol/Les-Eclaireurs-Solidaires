const express = require('express');
const router = express.Router();

const sessionMdw = require('../middleware/session.middleware');
const messagingProtection = require('../middleware/messagingProtection.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');
const urlProtection = require('../middleware/url.middleware');

const userGeneralCtrl = require("../controllers/user/userGeneralController");
const messagingCtrl = require('../controllers/messaging.ctrl');
const HomeController = require("../controllers/home.ctrl");

const homeController = new HomeController(missionMdl, service, utils);

// ==============================================
// === PUBLIC / HOME PAGES & FORMS ============
// =============================================

router.get('/', 
    homeController.homePage,
);

router.get('/becomeVolunteer', 
    homeCtrl.becomeVolunteer
);

router.post('/homeForm', 
    inputProtection.homeFormProtection, 
    homeCtrl.submitForm
);

// ==============================================
// === USER AUTHENTICATION & SIGNUP / SIGNIN ====
// ==============================================

router.get('/signUp', 
    userGeneralCtrl.signUp
);

router.get('/signIn', 
    userGeneralCtrl.signIn
);

router.post('/auth', 
    inputProtection.signInFormProtection, 
    userGeneralCtrl.auth
); 

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
);

module.exports = router;