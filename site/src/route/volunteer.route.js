const express = require('express');
const router = express.Router();
const userVolunteerCtrl = require('../controllers/user/userVolunteerController');
const missionCtrlGet = require('../controllers/mission.ctrl.get');
const missionCtrlPost = require('../controllers/mission.ctrl.post');
const sessionMdw = require('../middleware/session.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');

// --- SIGN ---
router.post('/saveUser', inputProtection.signUpFormProtection, userVolunteerCtrl.saveUser);

// --- DASHBOARD ---
router.get('/dashboardUser', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, userVolunteerCtrl.dashboardUser);
router.get('/fetchMissionByRegionDashboardUser', sessionMdw.requireAuth, missionCtrlGet.fetchMissionByRegionDashboardUser);
router.get('/fetchMissionByRegistrationDashboardUser', sessionMdw.requireAuth, missionCtrlGet.fetchMissionByRegistrationDashboardUser);
router.get('/fetchMissionAccomplishedDashboardUser', sessionMdw.requireAuth, missionCtrlGet.fetchMissionAccomplishedDashboardUser)

// --- MISSION ---
router.get('/missionUserShow', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.missionUserShow);
router.post('/searchByCategories', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlPost.searchByCategories);
router.get('/dataMission/:idMission', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.getDataMission);
router.get('/modalRegisterMission', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.modalRegisterMission);
router.post('/addRegisterMissionUser', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionCtrlGet.addRegisterMissionUser);

// --- PROFILE ---
router.get('/userProfilSettingsShow', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, userVolunteerCtrl.userProfilSettingsShow);
router.post('/editUserProfile', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, inputProtection.updateUserProfile, userVolunteerCtrl.editUserProfile);
router.get('/searchCity', sessionMdw.requireAuth, missionCtrlGet.searchCity);


module.exports = router;