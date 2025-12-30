const express = require('express');
const router = express.Router();
const homeCtrl = require('../controllers/home.ctrl');
const userCtrl = require('../controllers/user.ctrl');
const missionCtrlGet = require('../controllers/mission.ctrl.get');
const missionCtrlPost = require('../controllers/mission.ctrl.post');
const sessionMdw = require('../middleware/session.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');

// --- GENERAL ROUTE ---
router.post('/auth', inputProtection.signInFormProtection, userCtrl.auth); 
router.get('/logout', sessionMdw.logout);

// --- HOME --- 
router.get('/', homeCtrl.homePage);
router.get('/becomeVolunteer', homeCtrl.becomeVolunteer);
router.post('/homeForm', homeCtrl.submitForm);

// --- SIGN ---
router.get('/signIn', userCtrl.signIn);
router.get('/signUp', userCtrl.signUp);
router.post('/saveUser', inputProtection.signUpFormProtection, userCtrl.saveUser);

// --- DASHBOARD ---
router.get('/dashboardUser', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, userCtrl.dashboardUser);
router.get('/fetchMissionByRegionDashboardUser', sessionMdw.requireAuth, missionCtrlGet.fetchMissionByRegionDashboardUser);
router.get('/fetchMissionByRegistrationDashboardUser', sessionMdw.requireAuth, missionCtrlGet.fetchMissionByRegistrationDashboardUser);
router.get('/fetchMissionAccomplishedDashboardUser', sessionMdw.requireAuth, missionCtrlGet.fetchMissionAccomplishedDashboardUser)

// --- MISSION ---
router.get('/missionUserShow', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.missionUserShow);
router.post('/searchByCategories', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlPost.searchByCategories);
router.get('/dataMission/:idMission', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.getDataMission);
router.get('/modalRegisterMission', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.modalRegisterMission);
router.post('/addRegisterMissionUser', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.addRegisterMissionUser);

module.exports = router;