// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const { matchedData } = require('express-validator');

// Models
const userModel = require('../../models/UserModel');
const missionModel = require('../../models/MissionModel');

//Services
const { dashboardAllStats } = require('../mission/missionVolunteerController');

// ==============================
// DISPLAY VIEWS
// ==============================

exports.dashboardUser = async (req, res) => {
    const idUser = req.session.userExist.id;
    dashboardAllStats(req, res, idUser);
}

exports.userProfilSettingsShow = async (req, res) => {
    const getAllCategories = await missionModel.getAllCategories();
    req.session.categoriesMission = getAllCategories
    res.render('account/volunteer/userProfileSettings', {
        categoriesMission: req.session.categoriesMission
    });
}

// ==============================
// SAVE NEW VOLUNTEER
// ==============================

exports.saveUser = async (req, res) => {

    try {

        const safeData = matchedData(req);
        const { firstName, lastName, email, password, passwordConfirm } = safeData;

        if (!req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.password ||
            !req.body.passwordConfirm) {

            throw new Error('Merci de compléter tous les champs');
        }

        let userExist = await userModel.getOneUserByEmail(email);
        if (userExist) throw new Error("Un utilisateur utilise deja cette email");

        const saveUser = await userModel.addUser(
            firstName,
            lastName,
            email,
            password,
        )

        if (saveUser) {
            res.render('connection/signIn', {
                successAlertMsg: "Veuillez vous connecter pour accéder à votre compte."
            });
        }

    } catch (error) {

        res.render('connection/signUp', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            errorAlertMsg: error.message
        });
    }
}

// ==============================
// EDIT VOLUNTEER PROFILE
// ==============================

exports.editUserProfile = async (req, res) => {

    const renderData = {
        pseudoUser: req.session.userExist.firstName,
        categoriesMission: req.session.categoriesMission,
    }

    try {

        const idUser = req.session.userExist.id;

        const safeData = matchedData(req)
        const { lastname, firstname, phone, address, cityId, category, } = safeData;

        const request = await missionModel.updateUserProfile(
            idUser,
            lastname,
            firstname,
            phone,
            address,
            cityId,
            category
        );

        if (!request) {
            res.locals.errorAlertMsg = "Aucune donnée à mettre à jour";
            return res.render('account/volunteer/userProfileSettings', renderData);
        }

        if (firstname && firstname.trim().length > 0) {
            req.session.userExist.firstname = firstname;
            renderData.pseudoUser = req.session.userExist.firstname;
        }

        res.locals.successAlertMsg = "Profil mis à jour avec succès !";

        return res.render('account/volunteer/userProfileSettings', renderData);

    } catch (error) {

        console.error("editUserProfile() --> ", error);

        res.locals.errorAlertMsg = "Impossible de modifier les informations de profil";
        return res.render('account/volunteer/userProfileSettings', renderData);
    }
}

exports.userOpinion = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;
        safeData = matchedData(req);

        await userModel.addUserOpinion(safeData, idUser);
        return res.json({ messageSuccesss: "Avis envoyé, merci pour votre retour !", messageSuccessIsTrue: true });

    } catch (error) {

        console.log(error);
        return res.json({ messageError: "L'envoi de votre avis a échoué. Veuillez réessayer dans quelques instants.", messageErrorIsTrue: true });
    }
}