// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

const logger = require('../../utils/logger');

// Libraries
const bcrypt = require('bcrypt');
const { matchedData } = require('express-validator');

// Models
const userGeneralMdl = require('../../models/UserModel');
const service = require('../../services/services.js');

// Get Functions
const { dashboardUser } = require('../user/userVolunteerController');
const { getStatsMissions } = require('../mission/missionAdminController')

// ==============================
// DISPLAY VIEWS
// ==============================

exports.signIn = async (req, res) => {
    return res.status(200).render('connection/signIn');
}

exports.signUp = async (req, res) => {
    return res.status(200).render('connection/signUp');
}

// ==============================
// AUTHENTICATION
// ==============================

exports.auth = async (req, res) => {

    try {

        const safeData = matchedData(req);

        const { email, password } = safeData;

        const userExist = await exports.verifyAccountExist(email, password);

        if (!userExist) throw new Error("Email ou mot de passe incorrect.");

        const rolesMaps = {

            admin_1: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isSuperAdmin: true
                }),
                action: await getStatsMissions
            },

            admin_2: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isAdmin: true
                }),
                action: await getStatsMissions
            },

            user: {
                session: (u) => ({
                    id: u.id_user,
                    firstName: u.user_first_name,
                    isVolunteer: true
                }),

                action: await dashboardUser
            }
        };

        let roleKey = null;

        if (userExist.role === "user") {
            roleKey = "user";
        } else if (userExist.role === "admin") {
            roleKey = `admin_${userExist._id_admin_role}`;
        }

        const session = rolesMaps[roleKey].session(userExist);
        req.session.userExist = session;

        res.locals.pseudoUser = req.session.userExist.firstName;
        res.locals.isSuperAdmin = req.session.userExist.isSuperAdmin;
        res.locals.isAdmin = req.session.userExist.isAdmin;

        rolesMaps[roleKey].action(req, res);

        const tokenSession = service.generateTokenSession(req.session.userExist.id);
        res.cookie('tokenSession', tokenSession, {
            secure: false, // à mettre sur true si HTTPS
            httpOnly: true,
            sameSite: 'strict'
        });

    } catch (error) {

        logger.error(error);

        return res.status(500).render('connection/signIn', {
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
    }
}

// ==============================
// VERIFICATION
// ==============================

exports.verifyAccountExist = async (email, password) => {

    try {

        const userMail = await userGeneralMdl.getOneUserByEmail(email);

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
}