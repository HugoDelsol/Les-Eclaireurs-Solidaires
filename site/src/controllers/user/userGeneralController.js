// Libraries
const bcrypt = require('bcrypt');

// Models
const userGeneralMdl = require('../../models/UserModel');

// Controllers
const userCtrl = require('../user.ctrl');

// Get Functions

// ==============================
// USER - GENERAL.CTRL - VIEWS
// ==============================

exports.signIn = async (req, res) => {
    res.render('connection/signIn');
}

exports.signUp = async (req, res) => {
    res.render('connection/signUp');
}

// ==============================
// USER - GENERAL.CTRL - AUTHENTICATION
// ==============================

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

        /* const rolesMaps = {

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
        }; */

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
            userCtrl.dashboardUser(req, res, idUser)
        }

    } catch (error) {

        console.error(error)

        res.render('connection/signIn', {
            alertMsg: error.message
        });
    }
}

// ==============================
// USER - GENERAL.CTRL - VERIFICATION
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