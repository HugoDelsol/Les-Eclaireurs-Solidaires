const express = require('express');
const router = express.Router();
const userVolunteerCtrl = require('../controllers/user/userVolunteerController');
const sessionMdw = require('../middleware/session.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');
const messageCtrl = require('../controllers/messaging.ctrl');
const messagingProtection = require('../middleware/messagingProtection.middleware');
const urlProtection = require('../middleware/url.middleware');
const missionGeneralCtrl = require('../controllers/mission/missionGeneralController');
const missionVolunteerCtrl = require('../controllers/mission/missionVolunteerController');

// ==============================================
// === VOLUNTEER REGISTRATION & SIGNUP =========
// ==============================================

router.post('/saveUser',
    inputProtection.signUpFormProtection,
    userVolunteerCtrl.saveUser
);

// ==============================================
// === VOLUNTEER REGISTRATION & SIGNUP =========
// ==============================================

router.get('/dashboardUser',
    sessionMdw.requireAuth,
    sessionMdw.volunteerAuthorization,
    userVolunteerCtrl.dashboardUser
);

router.get('/fetchMissionByRegionDashboardUser',
    sessionMdw.requireAuth,
    missionVolunteerCtrl.fetchMissionByRegionDashboardUser
);

router.get('/fetchMissionByRegistrationDashboardUser',
    sessionMdw.requireAuth,
    missionVolunteerCtrl.fetchMissionByRegistrationDashboardUser
);

router.get('/fetchMissionAccomplishedDashboardUser',
    sessionMdw.requireAuth,
    missionVolunteerCtrl.fetchMissionAccomplishedDashboardUser
);

// ======================================================
// === MISSION EXPLORATION, REGISTRATION & MANAGEMENT ===
// ======================================================

router.get('/missionUserShow',
    sessionMdw.requireAuth,
    sessionMdw.volunteerAuthorization,
    missionVolunteerCtrl.missionUserShow
);

router.post('/searchByCategories',
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    missionGeneralCtrl.searchByCategories
);

router.get('/missionDetails/:idMission', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    urlProtection.urlMustBeANumberForMissionDetail, 
    missionGeneralCtrl.getDataMission
);

router.get('/modalRegisterMission', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    missionVolunteerCtrl.modalRegisterMission
);

router.post('/addRegisterMissionUser', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    missionVolunteerCtrl.addRegisterMissionUser
);

router.get('/modalUnsubscribeMission', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    missionVolunteerCtrl.modalUnsubscribeMission
);

router.delete('/unregisterAVolunteer', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    missionVolunteerCtrl.unregisterAVolunteer
);

router.get('/detailsOfNextMission/:idMission', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    missionVolunteerCtrl.detailsOfNextMission
)


// ==============================================
// === VOLUNTEER PROFILE & SETTINGS ============
// =============================================-

router.get('/userProfilSettingsShow', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    userVolunteerCtrl.userProfilSettingsShow
);

router.post('/editUserProfile', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    inputProtection.updateUserProfile, 
    userVolunteerCtrl.editUserProfile
);

router.get('/searchCity', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization,
    missionGeneralCtrl.searchCity
);

// ==============================================
// === MESSAGING, NOTIFICATIONS & COMMUNICATION ===
// ==============================================

router.get('/messaging', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    messageCtrl.volunteerMessagingShow
);

router.get('/newMessageByVolunteer', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    messageCtrl.newMessageByVolunteer
);

router.post('/sendNewMessageFromVolunteer', 
    sessionMdw.requireAuth, 
    sessionMdw.volunteerAuthorization, 
    messagingProtection.messagingAddNewMessageFromVolunteer, 
    messageCtrl.sendNewMessageFromVolunteer
);

router.post('/userOpinion',
    sessionMdw.requireAuth,
    sessionMdw.volunteerAuthorization,
    inputProtection.userOpinionInputProtection,
    userVolunteerCtrl.userOpinion
)

module.exports = router;