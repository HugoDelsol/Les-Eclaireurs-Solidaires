const express = require('express');
const router = express.Router();
const homeCtrl = require('../controllers/home.ctrl');
const userCtrl = require('../controllers/user.ctrl');
const missionCtrlGet = require('../controllers/mission.ctrl.get');
const missionCtrlPost = require('../controllers/mission.ctrl.post');
const sessionMdw = require('../middleware/session.middleware');
const globalVarsMdw = require('../middleware/globalVars.middleware');

// --- SIGN ---
router.get('/signUpAdminForm', userCtrl.signUpAdminForm);
router.post('/saveAdmin', userCtrl.saveAdmin);

// --- DAHBOARD ---
router.get('/dashboardAdmin', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, userCtrl.dashboardAdmin);

// --- MISSION ---
router.get('/missionAdminShow', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionCtrlGet.missionAdminShow);
router.get('/addMissionShow', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionCtrlGet.addMissionShow);
router.post('/addMission', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, missionCtrlPost.addMission);
router.get('/searchCity', sessionMdw.requireAuth, missionCtrlGet.searchCity);
router.post('/searchByCategories', sessionMdw.requireAuth, missionCtrlPost.searchByCategories);

// --- USER MANAGEMENT ---
router.get('/superAdmin/tokenView', sessionMdw.requireAuth, sessionMdw.superAdminAuthorization, userCtrl.tokenView);
router.post('/superAdmin/generateToken', sessionMdw.requireAuth, sessionMdw.superAdminAuthorization, userCtrl.generateToken);
router.get('/listOfVolunteers', sessionMdw.requireAuth, sessionMdw.allAdministratorAuthorization, userCtrl.listOfVolunteers)

module.exports = router;