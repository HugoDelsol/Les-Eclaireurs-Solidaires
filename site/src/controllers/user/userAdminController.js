// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const { matchedData } = require('express-validator');

// Models
const userModel = require('../../models/UserModel');
const missionMdl = require('../../models/MissionModel');

//Services
const service = require('../../services/services');

// Get Functions
const { getStatsMissions } = require('../../controllers/mission/missionAdminController');

const logger = require('../../utils/logger');

// ==============================
// DISPLAY VIEWS
// ==============================

exports.signUpAdminForm = async (req, res) => {
    res.render('connection/signUpAdmin');
}

exports.dashboardAdmin = async (req, res) => {
    getStatsMissions(req, res);
}

exports.tokenView = async (req, res) => {

    const admins = await userModel.getAllAdmins();

    res.locals.admins = admins.resultAdmins;
    res.locals.superAdmins = admins.resultSuperAdmins;

    res.render('account/admin/generateToken');
}

// ==============================
// LIST OF VOLUNTEERS
// ==============================

exports.listOfVolunteers = async (req, res) => {

    try {

        req.session.regions = await missionMdl.getAllRegions();
        req.session.categoriesMission = await missionMdl.getAllCategories();
        res.locals.regions = req.session.regions;
        res.locals.categoriesMission = req.session.categoriesMission;

        const allVolunteers = await userModel.listOfVolunteers();

        res.locals.listUsers = allVolunteers.resultAllVolunteers;

        res.status(200).render('account/admin/listOfVolunteers');

    } catch (error) {

        logger.error(error);
        res.locals.listUsers = [];
        res.locals.errorAlertMsg = "Une erreur est survenue. Merci de réessayer dans un instant.";
        res.status(500).render('account/admin/listOfVolunteers');
    }
}

// ==============================
// LIST OF ACTIVE VOLUNTEERS
// ==============================

exports.activeVolunteer = async (req, res) => {

    try {

        const listOfVolunteers = await userModel.listOfVolunteers();

        res.locals.listUsers = listOfVolunteers.resultActiveVolunteerCurrentDate

        res.status(200).render('account/admin/listOfVolunteers');

    } catch (error) {

        logger.error(error);
        res.locals.listUsers = [];
        res.locals.errorAlertMsg = "Une erreur est survenue. Merci de réessayer dans un instant.";
        res.status(500).render('account/admin/listOfVolunteers');
    }
}

exports.findVolunteer = async (req, res) => {

    try {

        const inputValue = req.body.findVolunteer;

        res.locals.findVolunteerList = await userModel.findVolunteer(inputValue);

        res.locals.findVolunteerList.length === 0
            ? res.locals.errorAlertMsg = "Aucun résultat pour cette recherche."
            : res.locals.errorAlertMsg = ""
            ;

        res.status(200).render('account/admin/listOfVolunteers');

    } catch (error) {

        logger.error(error);

        res.locals.listUsers = [];
        res.locals.errorAlertMsg = "Une erreur est survenue. Merci de réessayer dans un instant.";
        res.status(500).render('account/admin/listOfVolunteers');
    }
}

// ==============================
// GENERATE TOKEN ADMIN
// ==============================

exports.generateToken = async (req, res) => {

    let tokenValue = null;
    let status = 200;

    try {

        const admins = await userModel.getAllAdmins();

        res.locals.admins = admins.resultAdmins;
        res.locals.superAdmins = admins.resultSuperAdmins;

        if (res.locals.status === 422) {
            return res.status(422).render('account/admin/generateToken', {
                errorAlertMsg: "L'adresse email renseignée n'est pas valide"
            });
        }

        const safeData = matchedData(req)
        const { emailTokenSuper, emailTokenAdmin } = safeData

        if (emailTokenSuper) {
            tokenValue = service.generateToken(emailTokenSuper, "superAdmin");
        } else if (emailTokenAdmin) {
            tokenValue = service.generateToken(emailTokenAdmin, "admin");
        }

        res.status(status).render('account/admin/generateToken', {
            tokenValue: tokenValue
        })

    } catch (error) {

        logger.error(error);
        status = 500;

        res.locals.errorAlertMsg = "Une erreur est survenue. Merci de réessayer dans un instant.";
        res.status(status).render('account/admin/generateToken', {
            tokenAdmin: [],
            tokenSuper: [],
        })
    }
}

// ==============================
// SAVE NEW ADMIN
// ==============================

exports.saveAdmin = async (req, res) => {

    try {

        const safeData = matchedData(req)
        const { firstName, lastName, email, password, token } = safeData;

        let userExist = await userModel.getOneUserByEmail(email);
        if (userExist) throw new Error("Un utilisateur utilise deja cette email");

        const tokenRole = service.verifyToken(token, email);
        if (!tokenRole) throw new Error("Le token ou email est invalide")

        const rolesMap = { "superAdmin": 1, "admin": 2 };
        const idAdminRole = rolesMap[tokenRole];

        const saveAdmin = await userModel.addAdmin(
            firstName,
            lastName,
            email,
            password,
            idAdminRole,
        )

        if (saveAdmin) {
            res.locals.successAlertMsg = "Veuillez vous connecter pour accéder à votre compte.";
            res.status(200).render('connection/signIn');
        }

    } catch (error) {

        logger.error(error);

        res.locals.errorAlertMsg = "Une erreur est survenue. Merci de réessayer dans un instant.";
        res.status(500).render('connection/signUpAdmin', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: "",
            passwordConfirm: "",
        });
    }
}
