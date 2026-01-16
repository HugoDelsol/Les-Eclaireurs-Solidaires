// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Models
const homeMdl = require('../models/HomeModel');
const missionMdl = require('../models/MissionModel');

// Utils - Services
const utils = require('../utils/utils.js');

// ==============================
// DISPLAY VIEWS
// ==============================

exports.homePage = async (req, res) => {

    try {

        const getDisplayHomeMissions = await missionMdl.getAllMission("3");

        const clearData = utils.clearData(getDisplayHomeMissions);

        res.render('home/homePage', {
            displayMission : clearData,
        });        

    } catch (error) {

        console.log("Erreur homePage : ", error);
        res.status(500).send("Erreur Serveur");
    }    
}

exports.becomeVolunteer = async (req, res) => {
    res.render('home/becomeVolunteer');
}

// ==============================
// SUBMIT THE FORM ON THE HOME PAGE
// ==============================

exports.submitForm = async (req, res) => {

    try {

        const {nameForm, emailForm, txtArea} = req.body;
        await homeMdl.addMessageForm(nameForm, emailForm, txtArea);

    } catch (error) {

        console.log(error);

        res.render('home/homePage', {
           alertMsg: "Le formulaire n'a pas pu être soumis",
        })
    }
}
