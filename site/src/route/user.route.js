const express = require('express');
const router = express.Router();
const homeCtrl = require('../controllers/home.ctrl');
const userCtrl = require('../controllers/user.ctrl');
const missionCtrl = require('../controllers/mission.ctrl');
const sessionMdw = require('../middleware/session.middleware');

// --- HOME ---
router.get('/', homeCtrl.homePage);
router.get('/becomeVolunteer', homeCtrl.becomeVolunteer);

// --- SIGN ---
router.get('/signIn', userCtrl.signIn);
router.post('/auth', userCtrl.auth);
router.get('/signUp', userCtrl.signUp);
router.post('/saveUser', userCtrl.saveUser);
router.get('/logout', sessionMdw.logout);


module.exports = router;