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
const logger = require('../utils/logger.js')

// ==============================
// ==============================

exports.becomeVolunteer = async (req, res) => {
    res.status(200).render('home/becomeVolunteer');
}

exports.privacyPolicyDisplay = async (req, res) => {
    res.status(200).render('legals/privacyPolicy');
}

exports.termsAndConditions = async (req, res) => {
    res.status(200).render('legals/termsAndConditions');
}

exports.legalNotice = async (req, res) => {
    res.status(200).render('legals/legalNotice');
}

exports.siteMap = async (req, res) => {
    res.status(200).render('legals/siteMap');
}

exports.homePage = async (req, res) => {

    try {

        const getDisplayHomeMissions = await missionMdl.getAllMission("3");
        const getUserOpinion = await userMdl.getUserOpinion();

        const clearData = utils.clearData(getDisplayHomeMissions);

        return res.status(200).render('home/homePage', {
            displayMission: clearData,
            userOpinion: getUserOpinion
        });

    } catch (error) {

        logger.error(error);
        let message = "Certains éléments n'ont pas pu être chargés. Le contenu de la page peut être incomplet.";

        res.locals.errorAlertMsg = message;

        return res.status(500).render('home/homePage', {
            displayMission: [],
            userOpinion: []
        });
    }
}

exports.homeStats = async (req, res) => {

    try {

        const getStatsMission = await missionMdl.fetchStatsMissionForHomePage();
        const getStatsUser = await userMdl.fetchStatsUserForHomePage();

        const nbrMissions = getStatsMission[0][0].nbrMissions;
        const nbrCitys = getStatsMission[1][0].nbrCitys;
        const nbrUsers = getStatsUser.nbrUsers

        return res.status(200).json({
            dataMissions: nbrMissions,
            dataCitys: nbrCitys,
            dataUsers: nbrUsers
        });

    } catch (error) {

        logger.error(error);
        let message = "Certains éléments n'ont pas pu être chargés. Le contenu de la page peut être incomplet.";
        return res.status(500).json({ messageError: message, messageErrorIsTrue: true });
    }
}

exports.submitForm = async (req, res) => {

    try {
        const safeData = matchedData(req);

        const { nameForm, emailForm, txtArea } = safeData;
        await homeMdl.addMessageForm(nameForm, emailForm, txtArea);

        return res.status(200).json({ messageSuccess: "Votre message a bien été envoyé. Nous revenons vers vous très bientôt.", messageSuccessIsTrue: true });

    } catch (error) {

        logger.error(error);
        return res.status(500).json({ messageError: "Une erreur interne est survenue. Veuillez réessayer plus tard.", messageErrorIsTrue: true });
    }
}
