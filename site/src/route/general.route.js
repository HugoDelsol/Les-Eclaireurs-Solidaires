const express = require('express');
const router = express.Router();
const inputProtection = require('../middleware/inputProtection.middleware');
const userGeneralCtrl = require("../controllers/user/userGeneralController"); 

router.get('/signUp', userGeneralCtrl.signUp);
router.get('/signIn', userGeneralCtrl.signIn);

router.post('/auth', inputProtection.signInFormProtection, userGeneralCtrl.auth); 

module.exports = router;