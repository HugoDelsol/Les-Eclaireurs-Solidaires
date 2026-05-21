// ==============================
// IMPORTS & DEPENDENCIES
// ==============================
const logger = require('../../utils/logger')
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
    await dashboardAllStats(req, res, idUser);
}

exports.userProfilSettingsShow = async (req, res) => {

    try {

        const getAllCategories = await missionModel.getAllCategories();

        return res.status(200).render('account/volunteer/userProfileSettings', {
            categoriesMission: getAllCategories,
        });

    } catch (error) {

        logger.error(error);
        return res.status(500).render('account/volunteer/userProfileSettings', {
            categoriesMission: [],
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
    }

}

// ==============================
// SAVE NEW VOLUNTEER
// ==============================

exports.saveUser = async (req, res) => {

    let status = 500;

    try {

        const safeData = matchedData(req);
        const { firstName, lastName, email, password, passwordConfirm } = safeData;

        let userExist = await userModel.getOneUserByEmail(email);
        if (userExist) {
            status = 422;
            throw new Error("Un utilisateur utilise deja cette email");
        } 

        const saveUser = await userModel.addUser(
            firstName,
            lastName,
            email,
            password,
        )

        if (saveUser.affectedRows === 1) {
            status = 200;
            return res.status(status).render('connection/signIn', {
                successAlertMsg: "Veuillez vous connecter pour accéder à votre compte."
            });
        }

    } catch (error) {

        logger.error(error);
        return res.status(status).render('connection/signUp', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            errorAlertMsg: error.message || "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
    }
}

// ==============================
// EDIT VOLUNTEER PROFILE
// ==============================

exports.editUserProfile = async (req, res) => {

    const renderData = {
        pseudoUser: req.session.userExist.firstName,
        categoriesMission: null,
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
            return res.status(422).render('account/volunteer/userProfileSettings', renderData);
        }

        if (firstname && firstname.trim().length > 0) {
            req.session.userExist.firstName = firstname;
            renderData.pseudoUser = firstname;
        }

        const getAllCategories = await missionModel.getAllCategories();
        renderData.categoriesMission = getAllCategories;

        res.locals.successAlertMsg = "Profil mis à jour avec succès !";
        return res.status(200).render('account/volunteer/userProfileSettings', renderData);

    } catch (error) {

        logger.error(error);
        res.locals.errorAlertMsg = "Impossible de modifier les informations de profil";
        return res.status(500).render('account/volunteer/userProfileSettings', renderData);
    }
}

exports.userOpinion = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;
        safeData = matchedData(req);

        await userModel.addUserOpinion(safeData, idUser);
        return res.status(200).json({ messageSuccesss: "Avis envoyé, merci pour votre retour !", messageSuccessIsTrue: true });

    } catch (error) {

        logger.error(error);
        return res.status(500).json({ messageError: "Une erreur est survenue. Merci de réessayer dans un instant.", messageErrorIsTrue: true });
    }
}