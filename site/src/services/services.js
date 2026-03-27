/* const jwt = require('jsonwebtoken');
require('dotenv').config();
const missionModel = require('../models/MissionModel'); */

class Services {

    constructor(missionModel, utils) {
        this.missionModel = missionModel;
        this.utils = utils;
    }

    remainingSpace = async () => {

        const missions = await this.missionModel.getAllMission("3");

        let promiseTab = [];
        let registrationsCount = [];

        for (const m of missions) {
            const promise = this.missionModel.getNbrRegistrationByMission(m.id_mission);
            promiseTab.push(promise);
        }

        const allDataPromise = await Promise.all(promiseTab);

        if (allDataPromise) {
            for (const a of allDataPromise) {
                registrationsCount.push(a.nbr_registration);
            }
        }

        const formattedMissions = this.utils.clearData(missions, registrationsCount);
        return formattedMissions;
    }
}

module.exports = Services;

const secretToken = process.env.TOKEN_SECRET;

exports.generateToken = (email, role) => {

    try {

        const baseToken = { email, role };

        const expiry = { expiresIn: "1d" };

        return jwt.sign(baseToken, secretToken, expiry);

    } catch (error) {

        console.log("Generate Token Service :", error);
        return null;
    }
}

exports.verifyToken = (token, email) => {

    try {

        const decoded = jwt.verify(token, secretToken);

        if (decoded.email != email) return null;

        if (decoded.role === "superAdmin") return "superAdmin";

        if (decoded.role === "admin") return "admin";

        return null;

    } catch (error) {

        console.log("Generate Token Service :", error);
        return null;
    }
}

exports.filterOutRegisteredMissions = async (req, missionsSelected) => {

    try {

        let filteredMission = [];

        if (!missionsSelected) {

            filteredMission = await missionModel.getAllMission();

        } else {

            filteredMission = missionsSelected;
        }

        const idUser = req.session.userExist.id

        const alreadyRegisteredByUser = await missionModel.alreadyRegistered(idUser)

        if (filteredMission.length > 0 && alreadyRegisteredByUser.length > 0) {
            for (let i = 0; i < alreadyRegisteredByUser.length; i++) {
                for (let u = 0; u < filteredMission.length; u++) {
                    if (alreadyRegisteredByUser[i]._id_mission === filteredMission[u].id_mission) {
                        filteredMission.splice([u], 1);
                    }
                }
            }
        }

        return filteredMission;

    } catch (error) {

        console.log("filterOutRegisteredMissions : ", error);
        return null;
    }
}






exports.dateFormat = (date) => {

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const dateObj = new Date(date);
    const dateFormat = dateObj.toLocaleDateString('fr', options).toUpperCase();
    return dateFormat;
}

exports.timeFormat = (startTime, endTime) => {

    const splitStartTime = startTime.split(':');
    const splitEndTime = endTime.split(':');

    const timeFormatStart = `${splitStartTime[0]}h${splitStartTime[1]}`;
    const timeFormatEnd = `${splitEndTime[0]}h${splitEndTime[1]}`;

    return data = {
        timeFormatStart,
        timeFormatEnd
    };
}

