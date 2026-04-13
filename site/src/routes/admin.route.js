const express = require('express');
const router = express.Router();
const sessionMdw = require('../middleware/session.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');
const urlProtection = require('../middleware/url.middleware');
const userAdminCtrl = require('../controllers/user/userAdminController');
const messagingCtrl = require('../controllers/messaging.ctrl');
const missionGeneralCtrl = require('../controllers/mission/missionGeneralController');
const missionAdminCtrl = require('../controllers/mission/missionAdminController');
const messagingProtection = require('../middleware/messagingProtection.middleware');

// ==============================================
// === ADMIN REGISTRATION & ACCOUNT CREATION ===
// ==============================================

router.get('/signUpAdminForm', 
    userAdminCtrl.signUpAdminForm
);

router.post('/saveAdmin', 
    inputProtection.adminSignFormProtection, 
    userAdminCtrl.saveAdmin    
);

// ==============================================
// === ADMIN DASHBOARD & OVERVIEW ==============
// ==============================================

router.get('/dashboardAdmin', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    userAdminCtrl.dashboardAdmin
);

// ==============================================
// === MISSION MANAGEMENT & OPERATIONS =========
// ==============================================

router.get('/missionAdminShow', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    missionAdminCtrl.missionAdminShow
);

router.get('/addMissionShow', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    missionAdminCtrl.addMissionShow
);

router.post('/addMission', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    inputProtection.manageMissionInputProtection,
    missionAdminCtrl.addMission
);

router.get('/missionDetails/:idMission', 
    sessionMdw.requireAuth,
    sessionMdw.allAdministratorAuthorization, 
    urlProtection.urlMustBeANumberForMissionDetail, 
    missionGeneralCtrl.getDataMission
);

router.get('/missionUpdateView/:idMission',
  sessionMdw.requireAuth,
  sessionMdw.allAdministratorAuthorization,
  urlProtection.urlMustBeANumberForMissionDetail, 
  missionAdminCtrl.updateMissionView
);

router.post('/updateMission/:idMission', 
    sessionMdw.requireAuth,
    sessionMdw.allAdministratorAuthorization,
    inputProtection.manageMissionInputProtection,
    missionAdminCtrl.updateMission
)

router.get('/searchCity',     
    sessionMdw.requireAuth, 
    missionGeneralCtrl.searchCity,
);

router.post('/searchByCategories', 
    sessionMdw.requireAuth, 
    missionGeneralCtrl.searchByCategories,
);

// ==============================================
// === USER & VOLUNTEER MANAGEMENT ============
// ==============================================

router.get('/superAdmin/tokenView', 
    sessionMdw.requireAuth, 
    sessionMdw.superAdminAuthorization, 
    userAdminCtrl.tokenView
);

router.post('/superAdmin/generateToken', 
    sessionMdw.requireAuth, 
    sessionMdw.superAdminAuthorization, 
    inputProtection.generateTokenInputProtection, 
    userAdminCtrl.generateToken
);

router.get('/listOfVolunteers', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    userAdminCtrl.listOfVolunteers
);

router.get('/activeVolunteer', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    userAdminCtrl.activeVolunteer    
);

router.post('/findVolunteer', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization , 
    userAdminCtrl.findVolunteer
);

// ==============================================
// === MESSAGING, NOTIFICATIONS & COMMUNICATION ==
// ==============================================

router.get('/reminder', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    messagingCtrl.reminderShow
);

router.post('/recallManagement', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    messagingCtrl.recallManagement
);

router.get('/messaging', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    messagingCtrl.adminMessagingShow
);

router.post('/message', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    messagingProtection.messagingAddNewMessage, 
    messagingCtrl.sendNewMessageFromAdmin
);

router.get('/sendMessageTo/:idUser', 
    sessionMdw.requireAuth, 
    sessionMdw.allAdministratorAuthorization, 
    urlProtection.urlMustBeANumberForSendMessageToUser,
    messagingCtrl.sendMessageTo
);

module.exports = router;