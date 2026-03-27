const { matchedData } = require('express-validator');

class UserGeneralController {

    constructor(userService, missionService, utils) {
        this.userService = userService;
        this.missionService = missionService;
        this.utils = utils;
    }

    // ==============================
    // DISPLAY VIEWS
    // ==============================

    signIn = async (req, res) => { res.render('connection/signIn'); }

    signUp = async (req, res) => { res.render('connection/signUp'); }

    // ==============================
    // AUTHENTICATION
    // ==============================

    auth = async (req, res) => {

        try {

            const safeData = matchedData(req);

            const user = await this.userService.verifyAccountExist(safeData);

            if (!user) throw new Error("Email ou mot de passe incorrect.");

            const data = await this.userService.rolesMaps(user);

            this.utils.setUserSession(req, res, data);

            if (data.session.isVolunteer) {

                this.renderVolunteerDashboard(res, data);

            } else if (data.session.isAdmin || data.session.isSuperAdmin) {

                this.renderAdminDashboard(res, data);

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

    // ==============================
    // DASHBOARD VIEWS
    // ==============================

    renderVolunteerDashboard = (res, data) => {

        res.render("account/volunteer/dashboardUser", {
            missionByRegion: data.dataProfile.missionByRegion || [],
            missionsUser: data.dataProfile.missionUser || [],
            historyMissionUser: data.dataProfile.historyMissionUser || [],
            resultNbrMissionAccomplished: data.dataProfile.statsOnVolunteer.resultNbrMissionAccomplished || [],
            nbrTimeAccomplished: data.dataProfile.nbrTimeAccomplished || [],
        });
    }

    renderAdminDashboard = (res, data) => {

        res.render("account/admin/dashboardAdmin", {
            tabStats: data.resultService.tabStats || [],
            resultSum: data.getStatsMissions.resultSumVolunteers[0].total_next_30_days || [],
            average: data.resultService.averageToFixed || [],
            totalMission: data.getStatsMissions.resultTotalMissions[0] || [],
        });
    }
}
module.exports = UserGeneralController;