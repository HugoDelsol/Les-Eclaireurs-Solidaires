// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const bcrypt = require('bcrypt');
const { matchedData } = require('express-validator');

// Models
const userGeneralMdl = require('../../models/UserModel');

// Controllers
const userVolunteerCtrl = require('../user/userVolunteerController');

// Get Functions
const { getStatsMissions } = require('../mission.ctrl.get')

// ==============================
// DISPLAY VIEWS
// ==============================

exports.signIn = async (req, res) => {
    res.render('connection/signIn');
}

exports.signUp = async (req, res) => {
    res.render('connection/signUp');
}

// ==============================
// AUTHENTICATION
// ==============================

exports.auth = async (req, res) => {

    try {

        const safeData = matchedData(req)

        const {email, password} = safeData;

        const userExist = await exports.verifyAccountExist(email, password);

        if (!userExist) throw new Error("Email ou mot de passe incorrect.");

        const rolesMaps = {

            admin_1: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isSuperAdmin: true
                }),
                action: getStatsMissions
            },

            admin_2: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isAdmin: true
                }),
                action: getStatsMissions
            },

            user: {
                session: (u) => ({
                    id: u.id_user,
                    firstName: u.user_first_name,
                    isVolunteer: true
                }),

                action: userVolunteerCtrl.dashboardUser
            }
        };
        
        let roleKey = null;
        
        if (userExist.role === "user"){
            roleKey = "user";
        } else if (userExist.role === "admin") {
            roleKey = `admin_${userExist._id_admin_role}`;
        }
        
        const session = rolesMaps[roleKey].session(userExist);

        // REDEFINIR USER EXIST EN USER !!!!!!!
        req.session.userExist = session;
        
        rolesMaps[roleKey].action(req, res);

    } catch (error) {

        console.error(error);

        res.render('connection/signIn', {
            alertMsg: error.message
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