const express = require('express');
const router = express.Router();
const inputProtection = require('../middleware/inputProtection.middleware');
const userGeneralCtrl = require("../controllers/user/userGeneralController");
const homeCtrl = require("../controllers/home.ctrl");
const sessionMdw = require('../middleware/session.middleware');
const messagingCtrl = require('../controllers/messaging.ctrl');
const messagingProtection = require('../middleware/messagingProtection.middleware');
const urlProtection = require('../middleware/url.middleware');
const missionGeneralCtrl = require('../controllers/mission/missionGeneralController');

// ==============================================
// === PUBLIC / HOME PAGES & FORMS ============
// =============================================

router.get('/', 
    homeCtrl.homePage,
);

router.get('/getStatsHomePage', 
    homeCtrl.homeStats,
)

router.get('/becomeVolunteer', 
    homeCtrl.becomeVolunteer
);

router.post('/homeForm', 
    inputProtection.homeFormProtection, 
    homeCtrl.submitForm
);

router.get('/detailMission/:idMission',  
    missionGeneralCtrl.getDataMissionHome
);

router.get('/privacyPolicy', 
    homeCtrl.privacyPolicyDisplay
);

router.get('/termsAndConditions', 
    homeCtrl.termsAndConditions
);

router.get('/legalNotice',
    homeCtrl.legalNotice
);

router.get('/siteMap',
    homeCtrl.siteMap
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