// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const { matchedData } = require('express-validator');
/*

// Models
const homeMdl = require('../models/HomeModel');
const missionMdl = require('../models/MissionModel');

// Utils - Services
const utils = require('../utils/utils.js');
const service = require('../services/services.js'); */


class HomeController {

    constructor(service, homeService) {
        this.service = service;
        this.homeService = homeService
    }

    // ==============================
    // DISPLAY VIEWS
    // ==============================

    becomeVolunteer = async (req, res) => {
        res.render('home/becomeVolunteer');
    }

    homePage = async (req, res) => {

        try {

            const remainingSpace = await this.service.remainingSpace();

            res.render('home/homePage', {
                displayMission: remainingSpace,
            });

        } catch (error) {

            console.log("Erreur homePage : ", error);
            res.locals.errorAlertMsg = "Impossible d'afficher la liste des missions disponibles dans la section « Nos besoins actuels ».";
            res.render('home/homePage');
        }
    }

    // ==============================
    // SUBMIT THE FORM ON THE HOME PAGE
    // ==============================

    submitForm = async (req, res) => {
        
        const safeData = matchedData(req);
        
        try {

            const result = await this.homeService.processContactForm(safeData);

            if (!result) {
                throw new Error;
            }
            
            return res.json({ 
                messageSuccess: "Message envoyé ! Nous vous répondrons dans les meilleurs délais.", 
                messageSuccessIsTrue: true 
            });

        } catch (error) {

            console.log(error);
            return res.json({
                messageError: "Le formulaire n'a pas pu être soumis", 
                messageErrorIsTrue: true,
                data: safeData
            });
        }
    }
}
module.exports = HomeController;