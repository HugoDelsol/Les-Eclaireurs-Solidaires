const express = require('express');
const router = express.Router();
const homeCtrl = require('../controllers/home.ctrl');
const userCtrl = require('../controllers/user.ctrl');
const missionCtrlGet = require('../controllers/mission.ctrl.get');
const missionCtrlPost = require('../controllers/mission.ctrl.post');
const sessionMdw = require('../middleware/session.middleware');
const globalVarsMdw = require('../middleware/globalVars.middleware');

// --- DAHBOARD ---
router.get('/addMissionShow', missionCtrlGet.addMissionShow);
router.get('/dashboardAdmin', userCtrl.dashboardAdmin);

// --- MISSION ---
router.post('/addMission', missionCtrlPost.addMission);
router.get('/searchCity', missionCtrlGet.searchCity);

module.exports = router;

