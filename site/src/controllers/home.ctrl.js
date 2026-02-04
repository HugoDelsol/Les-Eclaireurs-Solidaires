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
        res.locals.errorAlertMsg = "Impossible d’afficher la liste des missions disponibles dans la section « Nos besoins actuels ».";
        res.render('home/homePage')
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

        return res.json({ messageSuccesss: "Message envoyé !", messageSuccessIsTrue: true });

    } catch (error) {

        console.log(error);
        return res.json({ messageError: "Le formulaire n'a pas pu être soumis", messageErrorIsTrue: true });
    }
}
