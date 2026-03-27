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

    constructor(userService, missionService) {
        this.userService = userService;
        this.missionService = missionService
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

            const data = await this.userService.rolesMaps(userExist);

            if (data.session.isVolunteer) {

                this.volunteerDisplay(req, res, data);

            } else if (data.session.isAdmin || data.session.isSuperAdmin) {

                this.adminDisplay(req, res, data);

            } else {

                throw new Error("Une erreur est survenue. Merci de réessayer dans quelques instants.");
            }

        } catch (error) {

            console.error(error);

            res.render('connection/signIn', {
                errorAlertMsg: error.message
            });
        }
    }

    volunteerDisplay = (req, res, data) => {

        try {

            req.session.userExist = data.session;

            req.session.save((err) => {
                if (err) console.log(err);
                res.render("account/volunteer/dashboardUser", {
                    missionByRegion: data.dataProfile.missionByRegion,
                    missionsUser: data.dataProfile.missionUser,
                    historyMissionUser: data.dataProfile.historyMissionUser,
                    resultNbrMissionAccomplished: data.dataProfile.statsOnVolunteer.resultNbrMissionAccomplished,
                    nbrTimeAccomplished: data.dataProfile.nbrTimeAccomplished
                });
            })

        } catch (error) {

            res.locals.errorAlertMsg = "Une erreur est survenue lors du chargement de votre tableau de bord. Merci de réessayer dans quelques instants."

            res.render('account/volunteer/dashboardUser', {
                missionByRegion: [],
                missionsUser: [],
                historyMissionUser: [],
                resultNbrMissionAccomplished: [],
                nbrTimeAccomplished: [],
            });
        }
    }

    adminDisplay = async (req, res, data) => {

        try {

            req.session.userExist = data.session;

            req.session.save((err) => {
                if (err) console.log(err);
                res.render("account/admin/dashboardAdmin", {
                    tabStats: data.resultService.tabStats,
                    resultSum: data.getStatsMissions.resultSumVolunteers[0].total_next_30_days,
                    average: data.resultService.averageToFixed,
                    totalMission: data.getStatsMissions.resultTotalMissions[0]
                });
            });



        } catch (error) {

            console.log(error);
            res.render("account/admin/dashboardAdmin", {
                errorAlertMsg: "Échec de la récupération des statistiques.",
                tabStats: [],
                resultSum: [],
                average: [],
                totalMission: [],
            })
        }
    }
}
module.exports = UserGeneralController;





