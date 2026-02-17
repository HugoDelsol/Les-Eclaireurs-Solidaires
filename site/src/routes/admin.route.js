const express = require('express');
const router = express.Router();
const sessionMdw = require('../middleware/session.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');
const userAdminCtrl = require('../controllers/user/userAdminController');
const messagingCtrl = require('../controllers/messaging.ctrl');


const missionGeneralCtrl = require('../controllers/mission/missionGeneralController');
const missionAdminCtrl = require('../controllers/mission/missionAdminController');


// --- SIGN ---
router.get('/signUpAdminForm', userAdminCtrl.signUpAdminForm);
router.post('/saveAdmin', inputProtection.adminSignFormProtection, userAdminCtrl.saveAdmin);

// --- DAHBOARD ---
router.get('/dashboardAdmin', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, userAdminCtrl.dashboardAdmin);

// --- MISSION ---
router.get('/missionAdminShow', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionAdminCtrl.missionAdminShow);
router.get('/addMissionShow', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionAdminCtrl.addMissionShow);
router.post('/addMission', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionAdminCtrl.addMission);
router.get('/searchCity', sessionMdw.requireAuth, missionGeneralCtrl.searchCity);
router.post('/searchByCategories', sessionMdw.requireAuth, missionGeneralCtrl.searchByCategories);

// --- USER MANAGEMENT ---
router.get('/superAdmin/tokenView', sessionMdw.requireAuth, sessionMdw.superAdminAuthorization, userAdminCtrl.tokenView);
router.post('/superAdmin/generateToken', sessionMdw.requireAuth, sessionMdw.superAdminAuthorization, inputProtection.generateTokenInputProtection, userAdminCtrl.generateToken);
router.get('/listOfVolunteers', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, userAdminCtrl.listOfVolunteers);
router.get('/activeVolunteer', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, userAdminCtrl.activeVolunteer);
router.post('/findVolunteer', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization , userAdminCtrl.findVolunteer);

router.get('/reminder', messagingCtrl.reminderShow);
router.post('/recallManagement', messagingCtrl.recallManagement);

router.get('/messaging', messagingCtrl.adminMessagingShow);

module.exports = router;