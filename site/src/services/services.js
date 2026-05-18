const jwt = require('jsonwebtoken');
require('dotenv').config();
const missionModel = require('../models/MissionModel');
const logger = require('../utils/logger')

const secretToken = process.env.TOKEN_SECRET;

exports.generateTokenSession = (idUser) => {

    try {

        const baseToken = { idUser };
        const expiry = { expiresIn: "1d" };
        return jwt.sign(baseToken, secretToken, expiry);

    } catch (error) {

        logger.error(error);
        return null;
    }
}

exports.verifyTokenSession = (token, idUser) => {

    try {

        const decoded = jwt.verify(token, secretToken);

        if (decoded.idUser !== idUser) return null;

        return true;

    } catch (error) {

        logger.error(error);
        return null;
    }
}

exports.generateToken = (email, role) => {

    try {

        const baseToken = { email, role };

        const expiry = { expiresIn: "1d" };

        return jwt.sign(baseToken, secretToken, expiry);

    } catch (error) {

        logger.error(error);
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

        logger.error(error);
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

        logger.error(error);
        return null;
    }
}

exports.formatMissionStats = async (data) => {

    let tabStats = [];

    let average = Math.round(
        (data.resultSumVolunteers[0].total_next_30_days / data.resultSumPlaces[0].nbr_places) * 100
    ) || 0;

    for (const d of data.resultList) {

        const spaceAvailable = d.mission_available_place;
        const fillRate = spaceAvailable === 0 ? 100 : (d.nb_volunteers / spaceAvailable) * 100;

        tabStats.push({
            id: d.id_mission,
            mission: d.mission_title,
            date: d.mission_date,
            nbVolunteers: d.nb_volunteers,
            spaceAvailable: spaceAvailable,
            fillRate: `${Math.round(fillRate)}%`,
        });
    };

    return {
        tabStats,
        average,
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

exports.formatedDateForUpdateMission = (data) => {

    const startTime = data.mission_start_time;
    const startTimeFormatted = startTime.split("");
    startTimeFormatted.splice(5);
    const startTi = startTimeFormatted.join('');

    const endTime = data.mission_end_time;
    const endTimeFormatted = endTime.split("");
    endTimeFormatted.splice(5);
    const endTi = endTimeFormatted.join('');

    const date = new Date(data.mission_date);

    let month = date.getMonth() + 1;

    let dataDate = [
        newYear = date.getFullYear().toString(),
        newMonth = month.toString(),
        newDate = date.getDate().toString(),
    ]

    let i = 0;

    dataDate.forEach(el => {
        if (el.length === 1) {
            el = `0${el}`
            dataDate.splice(i, 1, el)
        }
        i++
    });

    const formattedDate = dataDate.join('-');

    return data = {
        startTi,
        endTi,
        formattedDate
    }
}