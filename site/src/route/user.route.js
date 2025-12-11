const express = require('express');
const router = express.Router();
const homeCtrl = require('../controllers/home.ctrl');
const userCtrl = require('../controllers/user.ctrl');
const missionCtrlGet = require('../controllers/mission.ctrl.get');
const missionCtrlPost = require('../controllers/mission.ctrl.post');
const sessionMdw = require('../middleware/session.middleware');
const globalVarsMdw = require('../middleware/globalVars.middleware');

// --- HOME ---
router.get('/', homeCtrl.homePage);
router.get('/becomeVolunteer', homeCtrl.becomeVolunteer);
router.post('/homeForm', homeCtrl.submitForm);

// --- SIGN ---
router.get('/signIn', userCtrl.signIn);
router.post('/auth', userCtrl.auth); 
/* router.get('/auth', sessionMdw.requireAuth, userCtrl.dashboardUser);*/
router.get('/signUp', userCtrl.signUp);
router.post('/saveUser', userCtrl.saveUser);
router.get('/logout', sessionMdw.logout);

// --- DASHBOARD ---
router.get('/dashboardUser', sessionMdw.requireAuth, userCtrl.dashboardUser);

// --- MISSION ---
router.get('/missionUserShow', sessionMdw.requireAuth, missionCtrlGet.missionUserShow);
router.post('/searchByCategories', sessionMdw.requireAuth, missionCtrlPost.searchByCategories);
router.get('/dataMission/:idMission', missionCtrlGet.getDataMission);
router.get('/modalRegisterMission', missionCtrlGet.modalRegisterMission);
router.post('/addRegisterMissionUser', missionCtrlGet.addRegisterMissionUser);


module.exports = router;

