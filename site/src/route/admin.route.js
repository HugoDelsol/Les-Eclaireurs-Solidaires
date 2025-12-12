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
router.get('/dashboardAdmin', sessionMdw.requireAuth, userCtrl.dashboardAdmin);

// --- MISSION ---
router.get('/missionAdminShow', sessionMdw.requireAuth, missionCtrlGet.missionAdminShow);
router.get('/addMissionShow', sessionMdw.requireAuth, missionCtrlGet.addMissionShow);
router.post('/addMission', sessionMdw.requireAuth, missionCtrlPost.addMission);
router.get('/searchCity', sessionMdw.requireAuth, missionCtrlGet.searchCity);
router.post('/searchByCategories', missionCtrlPost.searchByCategories);

// --- USER ---
router.get('/superAdmin/tokenView', userCtrl.tokenView);
router.post('/superAdmin/generateToken', userCtrl.generateToken);
router.get('/listOfVolunteers', userCtrl.listOfVolunteers)


module.exports = router;

