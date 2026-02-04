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

    res.render('account/generateToken');
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

        res.render('account/listOfVolunteers');

    } catch (error) {

        console.log(error);
        res.locals.listUsers = [];
        res.locals.errorAlertMsg = "Impossible d'afficher la liste des bénévoles";
        res.render('account/listOfVolunteers');
    }
}

// ==============================
// LIST OF ACTIVE VOLUNTEERS
// ==============================

exports.activeVolunteer = async (req, res) => {

    try {

        const listOfVolunteers = await userModel.listOfVolunteers();

        res.locals.listUsers = listOfVolunteers.resultActiveVolunteerCurrentDate

        res.render('account/listOfVolunteers');
        
    } catch (error) {

        console.log(error);
        res.locals.listUsers = [];
        res.locals.errorAlertMsg = "Impossible d'afficher la liste des bénévoles actifs";
        res.render('account/listOfVolunteers');
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
        
        res.render('account/listOfVolunteers');
        
    } catch (error) {
        
        console.log(error);
        res.locals.listUsers = [];
        res.locals.errorAlertMsg = "Impossible d'afficher la liste des bénévoles recherchés";
        res.render('account/listOfVolunteers');
    }
}

// ==============================
// GENERATE TOKEN ADMIN
// ==============================

exports.generateToken = async (req, res) => {

    let generateTokenSuper;
    let generateTokenAdmin;

    try {

        const emailTokenSuper = req.body.emailTokenSuper;
        const emailTokenAdmin = req.body.emailTokenAdmin;

        if (req.body.emailTokenSuper) {

            generateTokenSuper = service.generateToken(emailTokenSuper, "superAdmin");

        } else if (req.body.emailTokenAdmin) {

            generateTokenAdmin = service.generateToken(emailTokenAdmin, "admin");
        }

        res.render('account/generateToken', {
            tokenAdmin: generateTokenAdmin,
            tokenSuper: generateTokenSuper,
        })

    } catch (error) {

        console.log(error);
        res.locals.errorAlertMsg = "Problème lors de la génération du token.";
        res.render('account/generateToken', {
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

        if (!req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.password ||
            !req.body.passwordConfirm ||
            !req.body.token) {

            throw new Error('Merci de compléter tous les champs');
        }

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
            res.render('connection/signIn');
        }

    } catch (error) {

        res.render('connection/signUpAdmin', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: "",
            passwordConfirm: "",
            errorAlertMsg: error.message
        });
    }
}
