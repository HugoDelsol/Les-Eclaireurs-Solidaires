// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const { matchedData } = require('express-validator');

// Models
const homeMdl = require('../models/HomeModel');
const missionMdl = require('../models/MissionModel');
const userMdl = require('../models/UserModel.js');

// Utils - Services
const utils = require('../utils/utils.js');
const service = require('../services/services.js');

// ==============================
// ==============================

exports.becomeVolunteer = async (req, res) => {
    res.render('home/becomeVolunteer');
}

exports.privacyPolicyDisplay = async (req, res) => {
    res.render('legals/privacyPolicy');
}

exports.termsAndConditions = async (req, res) => {
    res.render('legals/termsAndConditions');
}

exports.legalNotice = async (req, res) => {
    res.render('legals/legalNotice');
}

exports.siteMap = async (req, res) => {
    res.render('legals/siteMap');
}

exports.homePage = async (req, res) => {

    try {

        const getDisplayHomeMissions = await missionMdl.getAllMission("3");
        const getUserOpinion = await userMdl.getUserOpinion();

        const remainingSpace = await service.remainingSpace(getDisplayHomeMissions);

        const clearData = utils.clearData(getDisplayHomeMissions, remainingSpace);

        res.render('home/homePage', {
            displayMission: clearData,
            userOpinion: getUserOpinion
        });

    } catch (error) {

        console.log("Erreur homePage : ", error);
        res.locals.errorAlertMsg = "Impossible d'afficher la liste des missions disponibles dans la section « Nos besoins actuels ».";
        res.render('home/homePage');
    }
}

exports.homeStats = async (req, res) => {

    try {
        
        const getStatsMission = await missionMdl.fetchStatsMissionForHomePage();
        const getStatsUser = await userMdl.fetchStatsUserForHomePage();

        const nbrMissions = getStatsMission[0][0].nbrMissions;
        const nbrCitys = getStatsMission[1][0].nbrCitys;
        const nbrUsers = getStatsUser.nbrUsers
        
        return res.json({
            dataMissions: nbrMissions,
            dataCitys: nbrCitys,
            dataUsers: nbrUsers
        });

    } catch (error) {
        
        console.log(error);
    }
}

exports.submitForm = async (req, res) => {

    try {
        
        const safeData = matchedData(req);

        const { nameForm, emailForm, txtArea } = safeData;
        await homeMdl.addMessageForm(nameForm, emailForm, txtArea);

        return res.json({ messageSuccesss: "Votre message a bien été envoyé. Nous revenons vers vous très bientôt.", messageSuccessIsTrue: true });

    } catch (error) {

        console.log(error);
        return res.json({ messageError: "Le formulaire n'a pas pu être soumis", messageErrorIsTrue: true });
    }
}
