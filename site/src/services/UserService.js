const bcrypt = require('bcrypt');

class UserService {

    constructor(userModel, missionModel, missionService) {
        this.userModel = userModel;
        this.missionModel = missionModel;
        this.missionService = missionService;
    }

    async verifyAccountExist(safeData) {

        const { email, password } = safeData;

        const userMail = await this.userModel.getOneUserByEmail(email);

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
    }

    async rolesMaps(userExist) {

        const rolesMaps = {

            admin_1: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isSuperAdmin: true
                }),
                //action: getStatsMissions
            },

            admin_2: {
                session: (u) => ({
                    id: u.id_admin,
                    firstName: u.admin_first_name,
                    isAdmin: true
                }),
            },

            user: {
                session: (u) => ({
                    id: u.id_user,
                    firstName: u.user_first_name,
                    isVolunteer: true
                }),
            }
        };

        let roleKey = null;

        if (userExist.role === "user") {

            roleKey = "user";

        } else if (userExist.role === "admin") {

            roleKey = `admin_${userExist._id_admin_role}`;
        }

        const session = rolesMaps[roleKey].session(userExist);

        if (session.isVolunteer) {

            return await this._formattedProfileVolunteer(session);

        } else {

            return await this._formattedProfileAdmin(session);
        }
    }

    async _formattedProfileVolunteer(session) {

        const idUser = session.id

        const getUserAddress = await this.userModel.getUserAddress(idUser);
        const idRegionByUser = getUserAddress.id_region;

        const obtainStatsOnVolunteer = await this.missionModel.obtainStatsOnVolunteer(idUser);

        let count = 0;
        let i = 0;
        let tab = [];

        obtainStatsOnVolunteer.resultTimeDiff.forEach((e) => {
            tab.push(parseInt(e.timeDiff));
            count += tab[i];
            i++;
        })

        const dataProfile = {

            missionByRegion: await this.missionModel.getMissionByRegion(idRegionByUser),
            missionUser: await this.missionModel.getAllMissionsByUser(idUser),
            historyMissionUser: await this.missionModel.addUserHistoryMission(idUser),
            statsOnVolunteer: obtainStatsOnVolunteer,
            nbrTimeAccomplished: count,
        }

        return { session, dataProfile };
    }

    async _formattedProfileAdmin(session) {


        const getStatsMissions = await this.missionModel.getStatsMissions();

        const resultService = await this.missionService.formatMissionStats(getStatsMissions);

        return { session, resultService, getStatsMissions };
    }
}
module.exports = UserService;