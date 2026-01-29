const express = require('express');
const router = express.Router();
const inputProtection = require('../middleware/inputProtection.middleware');
const userGeneralCtrl = require("../controllers/user/userGeneralController");
const homeCtrl = require("../controllers/home.ctrl");
const sessionMdw = require('../middleware/session.middleware');

router.get('/', homeCtrl.homePage);
router.get('/becomeVolunteer', homeCtrl.becomeVolunteer);
router.post('/homeForm', inputProtection.homeFormProtection, homeCtrl.submitForm);

router.get('/signUp', userGeneralCtrl.signUp);
router.get('/signIn', userGeneralCtrl.signIn);
router.post('/auth', inputProtection.signInFormProtection, userGeneralCtrl.auth); 

router.get('/logout', sessionMdw.logout);

module.exports = router;