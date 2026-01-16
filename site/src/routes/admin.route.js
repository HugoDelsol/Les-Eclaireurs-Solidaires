const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.ctrl');
const missionCtrlGet = require('../controllers/mission.ctrl.get');
const missionCtrlPost = require('../controllers/mission.ctrl.post');
const sessionMdw = require('../middleware/session.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');
const userAdminCtrl = require('../controllers/user/userAdminController');


// --- SIGN ---
router.get('/signUpAdminForm', userAdminCtrl.signUpAdminForm);
router.post('/saveAdmin', inputProtection.adminSignFormProtection, userAdminCtrl.saveAdmin);

// --- DAHBOARD ---
router.get('/dashboardAdmin', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, userAdminCtrl.dashboardAdmin);

// --- MISSION ---
router.get('/missionAdminShow', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionCtrlGet.missionAdminShow);
router.get('/addMissionShow', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionCtrlGet.addMissionShow);
router.post('/addMission', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionCtrlPost.addMission);
router.get('/searchCity', sessionMdw.requireAuth, missionCtrlGet.searchCity);
router.post('/searchByCategories', sessionMdw.requireAuth, missionCtrlPost.searchByCategories);

// --- USER MANAGEMENT ---
router.get('/superAdmin/tokenView', sessionMdw.requireAuth, sessionMdw.superAdminAuthorization, userAdminCtrl.tokenView);
router.post('/superAdmin/generateToken', sessionMdw.requireAuth, sessionMdw.superAdminAuthorization, userAdminCtrl.generateToken);
router.get('/listOfVolunteers', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, userAdminCtrl.listOfVolunteers)

module.exports = router;