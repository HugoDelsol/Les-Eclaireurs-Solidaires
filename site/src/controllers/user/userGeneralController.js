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
const { getStatsMissions } = require('../mission/missionAdminController')

class UserGeneralController {

    constructor(userService){
        this.userService = userService;
    }

    // ==============================
    // DISPLAY VIEWS
    // ==============================

    signIn = async (req, res) => {
        res.render('connection/signIn');
    }

    signUp = async (req, res) => {
        res.render('connection/signUp');
    }

    // ==============================
    // AUTHENTICATION
    // ==============================

    auth = async (req, res) => {

        try {

            const safeData = matchedData(req);

            const userExist = await this.userService.verifyAccountExist(safeData);

            if (!userExist) throw new Error("Email ou mot de passe incorrect.");

            const rolesMaps = await this.userService.rolesMaps(userExist);

            console.log(rolesMaps)

            /* = rolesMaps[roleKey].session(userExist); */

            
        /* res.locals.missionByRegion = await missionMdl.getMissionByRegion(idRegionByUser);

        res.locals.missionsUser = await missionMdl.getAllMissionsByUser(idUser);

        res.locals.historyMissionUser = await missionMdl.addUserHistoryMission(idUser); */

            req.session.userExist = session;

            res.locals.pseudoUser = req.session.userExist.firstName;
            res.locals.isSuperAdmin = req.session.userExist.isSuperAdmin;
            res.locals.isAdmin = req.session.userExist.isAdmin;

            rolesMaps[roleKey].action(req, res);

        } catch (error) {

            console.error(error);

            res.render('connection/signIn', {
                errorAlertMsg: error.message
            });
        }
    }
}
module.exports = UserGeneralController;





