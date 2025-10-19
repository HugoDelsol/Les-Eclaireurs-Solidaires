const express = require('express');
const router = express.Router();
const homeCtrl = require('../controllers/home.ctrl');
const userCtrl = require('../controllers/user.ctrl');
const missionCtrl = require('../controllers/mission.ctrl');
const sessionMdw = require('../middleware/session.middleware');



// --- DAHBOARD ---
router.get('/addMissionShow', missionCtrl.addMissionShow);

// --- MISSION ---
router.post('/addMission', missionCtrl.addMission);
router.get('/searchCity', missionCtrl.searchCity);

module.exports = router;
