// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const { matchedData } = require('express-validator');

// Models
const homeMdl = require('../models/HomeModel');
const missionMdl = require('../models/MissionModel');

// Utils - Services
const utils = require('../utils/utils.js');
const service = require('../services/services.js');

// ==============================
// DISPLAY VIEWS
// ==============================

exports.becomeVolunteer = async (req, res) => {
    res.render('home/becomeVolunteer');
}

exports.homePage = async (req, res) => {

    try {

        const getDisplayHomeMissions = await missionMdl.getAllMission("3");

        const remainingSpace = await service.remainingSpace(getDisplayHomeMissions);

        const clearData = utils.clearData(getDisplayHomeMissions, remainingSpace);

        res.render('home/homePage', {
            displayMission: clearData,
        });

    } catch (error) {

        console.log("Erreur homePage : ", error);
        res.status(500).send("Erreur Serveur");
    }
}

// ==============================
// SUBMIT THE FORM ON THE HOME PAGE
// ==============================

exports.submitForm = async (req, res) => {

    try {
        
        const safeData = matchedData(req);

        const { nameForm, emailForm, txtArea } = safeData;
        await homeMdl.addMessageForm(nameForm, emailForm, txtArea);

        return res.status(200).json({ message: "Message envoyé ! ✅" });

    } catch (error) {

        console.log(error);
        return res.status(200).json({ message: "Le formulaire n'a pas pu être soumis" });
    }
}
