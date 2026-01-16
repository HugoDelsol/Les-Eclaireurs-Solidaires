// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const { matchedData } = require('express-validator');

// Models
const userModel = require('../../models/UserModel');

//Services
const service = require('../../services/services');

// Get Functions
const { getStatsMissions } = require('../mission.ctrl.get');

// ==============================
// DISPLAY VIEWS
// ==============================

exports.signUpAdminForm = async (req, res) => {
    res.render('connection/signUpAdmin');
}

exports.dashboardAdmin = async (req, res) => {
    getStatsMissions(req, res);
}

exports.listOfVolunteers = async (req, res) => {
    res.render('account/listOfVolunteers');
}

exports.tokenView = async (req, res) => {

    const admins = await userModel.getAllAdmins();

    req.session.userExist.admins = admins.resultAdmins;
    req.session.userExist.superAdmins = admins.resultSuperAdmins;

    res.render('account/generateToken', {
        admins: admins.resultAdmins,
        superAdmins: admins.resultSuperAdmins,
    });
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
            admins: req.session.userExist.admins,
            superAdmins: req.session.userExist.superAdmins,
        })

    } catch (error) {

        console.log(error)
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
            res.render('connection/signIn', {
                alertMsg: "Veuillez vous connecter pour accéder à votre compte."
            });
        }

    } catch (error) {

        res.render('connection/signUpAdmin', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: "",
            passwordConfirm: "",
            alertMsg: error.message
        });
    }
}
