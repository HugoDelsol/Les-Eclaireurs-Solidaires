const express = require('express');
const router = express.Router();
const inputProtection = require('../middleware/inputProtection.middleware');
const userGeneralCtrl = require("../controllers/user/userGeneralController");
const homeCtrl = require("../controllers/home.ctrl");
const sessionMdw = require('../middleware/session.middleware');
const messagingCtrl = require('../controllers/messaging.ctrl');
const messagingProtection = require('../middleware/messagingProtection.middleware');
const urlProtection = require('../middleware/url.middleware');

router.get('/', homeCtrl.homePage);
router.get('/becomeVolunteer', homeCtrl.becomeVolunteer);
router.post('/homeForm', inputProtection.homeFormProtection, homeCtrl.submitForm);

router.get('/signUp', userGeneralCtrl.signUp);
router.get('/signIn', userGeneralCtrl.signIn);
router.post('/auth', inputProtection.signInFormProtection, userGeneralCtrl.auth); 

router.get('/chatMessage/:idChannel', sessionMdw.requireAuth, urlProtection.urlMustBeANumber, messagingCtrl.messageRediger);
router.post('/replyToAMessage', sessionMdw.requireAuth, messagingProtection.chatMessagingProtection, messagingCtrl.replyToAMessage);
router.get('/newMessage', sessionMdw.requireAuth, messagingCtrl.newMessageRediger);

router.get('/logout', sessionMdw.logout);

module.exports = router;