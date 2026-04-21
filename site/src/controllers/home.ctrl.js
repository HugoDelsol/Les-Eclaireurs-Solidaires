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

        let status = 400;
        let message = "Certains éléments n'ont pas pu être chargés. Le contenu de la page peut être incomplet.";

        if (error.message.includes("DB_ERROR")) {
            status = 500;
            message = "Une erreur interne est survenue. Veuillez réessayer plus tard.";
        }

        res.locals.errorAlertMsg = message;

        return res.status(status).render('home/homePage', {
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

        let status = 400;
        let message = "Certains éléments n'ont pas pu être chargés. Le contenu de la page peut être incomplet.";

        if (error.message.includes("DB_ERROR")) {
            status = 500;
        }

        return res.status(status).json({ messageError: message, messageErrorIsTrue: true });
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

        if (error.message.includes("DB_ERROR")) {
            return res.status(500).json({ messageError: "Une erreur interne est survenue. Veuillez réessayer plus tard.", messageErrorIsTrue: true });
        } else {
            return res.status(400).json({ messageError: "L'action demandée n'a pas pu être traitée. Veuillez réessayer.", messageErrorIsTrue: true });
        }
    }
}
