const express = require('express');
const router = express.Router();
const userVolunteerCtrl = require('../controllers/user/userVolunteerController');
const sessionMdw = require('../middleware/session.middleware');
const inputProtection = require('../middleware/inputProtection.middleware');


const missionGeneralCtrl = require('../controllers/mission/missionGeneralController');
const missionVolunteerCtrl = require('../controllers/mission/missionVolunteerController');

// --- SIGN ---
router.post('/saveUser', inputProtection.signUpFormProtection, userVolunteerCtrl.saveUser);

// --- DASHBOARD ---
router.get('/dashboardUser', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, userVolunteerCtrl.dashboardUser);
router.get('/fetchMissionByRegionDashboardUser', sessionMdw.requireAuth, missionVolunteerCtrl.fetchMissionByRegionDashboardUser);
router.get('/fetchMissionByRegistrationDashboardUser', sessionMdw.requireAuth, missionVolunteerCtrl.fetchMissionByRegistrationDashboardUser);
router.get('/fetchMissionAccomplishedDashboardUser', sessionMdw.requireAuth, missionVolunteerCtrl.fetchMissionAccomplishedDashboardUser)

// --- MISSION ---
router.get('/missionUserShow', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionVolunteerCtrl.missionUserShow);
router.post('/searchByCategories', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionGeneralCtrl.searchByCategories);
router.get('/dataMission/:idMission', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionGeneralCtrl.getDataMission);
router.get('/modalRegisterMission', sessionMdw.volunteerAuthorization, missionVolunteerCtrl.modalRegisterMission);
router.post('/addRegisterMissionUser', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, missionVolunteerCtrl.addRegisterMissionUser);

// --- PROFILE ---
router.get('/userProfilSettingsShow', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, userVolunteerCtrl.userProfilSettingsShow);
router.post('/editUserProfile', sessionMdw.requireAuth, sessionMdw.volunteerAuthorization, inputProtection.updateUserProfile, userVolunteerCtrl.editUserProfile);
router.get('/searchCity', sessionMdw.requireAuth, missionGeneralCtrl.searchCity);


module.exports = router;