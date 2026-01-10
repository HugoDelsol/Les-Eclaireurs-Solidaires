const userModel = require('../models/UserModel');
const missionModel = require('../models/MissionModel');
const bcrypt = require('bcrypt');
const service = require('../service/generateToken');
const { getStatsMissions } = require('./mission.ctrl.get');
const { dashboardAllStats } = require('./mission.ctrl.get');
const { matchedData } = require('express-validator');

// --- VIEWS ---
/* exports.signIn = async (req, res) => {
    res.render('connection/signIn');
}

exports.signUp = async (req, res) => {
    res.render('connection/signUp');
} */

/* exports.signUpAdminForm = async (req, res) => {
    res.render('connection/signUpAdmin');
}

exports.dashboardAdmin = async (req, res) => {
    getStatsMissions(req, res);
} */

/* exports.dashboardUser = async (req, res) => {
    const idUser = req.session.userExist.id;
    dashboardAllStats(req, res, idUser);
}

exports.userProfilSettingsShow = async (req, res) => {
    const getAllCategories = await missionModel.getAllCategories();
    req.session.categoriesMission = getAllCategories
    res.render('account/userProfileSettings', {
        categoriesMission: req.session.categoriesMission
    });
} */

/* exports.tokenView = async (req, res) => {

    const admins = await userModel.getAllAdmins();

    req.session.userExist.admins = admins.resultAdmins;
    req.session.userExist.superAdmins = admins.resultSuperAdmins;

    res.render('account/generateToken', {
        admins: admins.resultAdmins,
        superAdmins: admins.resultSuperAdmins,
    });
}

exports.listOfVolunteers = async (req, res) => {
    res.render('account/listOfVolunteers');
} */

// --- --- ---
/* 
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
} */
/* 
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
} */
/* 
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
                alertMsg: "Veuillez vous connecter pour accéder à votre compte."
            });
        }

    } catch (error) {

        res.render('connection/signUp', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            alertMsg: error.message
        });
    }
} */
/* 
exports.auth = async (req, res) => {

    try {

        let email = req.body.email;
        let password = req.body.password;

        if (!req.body.email || !req.body.password) {

            throw new Error('Merci de compléter tous les champs');
        }

        const userExist = await exports.verifyAccountExist(email, password);

        if (!userExist) {
            throw new Error("Email ou mot de passe incorrect.");
        }

         const rolesMaps = {

            admin_1: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isSuperAdmin: true
                }),
                action: getStatsMissions(req, res)
            },

            admin_2: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isAdmin: true
                }),
                action: getStatsMissions(req, res)
            },
        };

        if (userExist.role === 'admin') {

            if (userExist._id_admin_role === 1) {

                req.session.userExist = {
                    id: userExist.id_admin,
                    firstName: userExist.admin_first_name,
                    isSuperAdmin: true
                }

                getStatsMissions(req, res);

            } else if (userExist._id_admin_role === 2) {

                req.session.userExist = {
                    id: userExist.id_admin,
                    firstName: userExist.admin_first_name,
                    isAdmin: true
                }

                getStatsMissions(req, res);
            }

        } else if (userExist.role === 'user') {

            req.session.userExist = {
                id: userExist.id_user,
                firstName: userExist.user_first_name,
                isVolunteer: true
            }

            const idUser = req.session.userExist.id;

            this.dashboardUser(req, res, idUser);

        }

    } catch (error) {

        console.error(error)

        res.render('connection/signIn', {
            alertMsg: error.message
        });
    }
}

exports.verifyAccountExist = async (email, password) => {

    try {

        const userMail = await userModel.getOneUserByEmail(email);

        if (userMail && await bcrypt.compare(password, userMail.identifier_password)) {

            if (userMail.id_user) {

                userMail['role'] = 'user';

            } else if (userMail.id_admin) {

                userMail['role'] = 'admin';
            }

            return userMail;

        } else {

            return false;
        }

    } catch (e) {

        console.error(e);

    }
} */
