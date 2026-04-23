// ==============================
// IMPORTS & DEPENDENCIES
// ==============================
const missionMdl = require('../../models/MissionModel');
const userMdl = require('../../models/UserModel');
const utils = require('../../utils/utils.js');
const service = require('../../services/services.js');
const logger = require('../../utils/logger.js');

// ==============================
// DISPLAY MODAL REGISTER MISSION
// ==============================
exports.modalRegisterMission = async (req, res) => {
    return res.status(200).render('modals/subscribe');
}

// ==============================
// DISPLAY MODAL UNSUBSCRIBE MISSION
// ==============================

exports.modalUnsubscribeMission = async (req, res) => {
    return res.status(200).render('modals/unsubscribe');
}

// ==============================
// RESPONSIV MISSION DASHBOARD VOLUNTEER
// ==============================

exports.fetchMissionByRegionDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getUserAddress = await userMdl.getUserAddress(idUser);
        const idRegionByUser = getUserAddress[0].id_region;
        let missionByRegion = await missionMdl.getMissionByRegion(idRegionByUser);

        let ourSelectionRegion = await service.filterOutRegisteredMissions(req, missionByRegion);
        let ourSelectionAll = await service.filterOutRegisteredMissions(req);

        for (let i = 0; i < ourSelectionAll.length; i++) {

            const alreadyExist = ourSelectionRegion.some(
                (item) => item.id_mission === ourSelectionAll[i].id_mission
            );

            if (!alreadyExist) {
                ourSelectionRegion.push(ourSelectionAll[i])
            }

            if (ourSelectionRegion.length === 3) {
                break;
            }
        }

        return res.status(200).json(ourSelectionRegion);

    } catch (error) {

        console.log(error);
        return res.status(500).json({ errorMsg: "Impossible d'afficher la liste des missions sélectionnées pour vous." });
    }
}

exports.fetchMissionByRegistrationDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getAllMissionsByUser = await missionMdl.getAllMissionsByUser(idUser);

        return res.status(200).json(getAllMissionsByUser);

    } catch (error) {

        console.log(error);
        return res.status(500).json({ errorMsg: "Impossible d'afficher la liste des missions liées aux inscriptions." });
    }
}

exports.fetchMissionAccomplishedDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getMissionAccomplishedByUser = await missionMdl.addUserHistoryMission(idUser)

        return res.status(200).json(getMissionAccomplishedByUser);

    } catch (error) {
        
        console.log(error);
        return res.status(500).json({ errorMsg: "Impossible d'afficher la liste des missions accomplies." });
    }
}

// ==============================
// LIST OF MISSION FOR VOLUNTEER
// ==============================

exports.missionUserShow = async (req, res) => {

    try {

        const regions = await missionMdl.getAllRegions();

        const categoriesMission = await missionMdl.getAllCategories();

        const filterOutRegisteredMissions = await service.filterOutRegisteredMissions(req);

        const clearData = utils.clearData(filterOutRegisteredMissions);

        res.locals.missionsClear = clearData;
        res.locals.regions = regions;
        res.locals.categoriesMission = categoriesMission;

        return res.status(200).render('account/volunteer/listMissionUser');

    } catch (error) {

        logger.error(error);

        res.locals.errorAlertMsg = "Impossible d'afficher la liste des missions.";
        res.locals.missionsClear = [];

        return res.status(500).render('account/volunteer/listMissionUser');
    }
}

// ==============================
// DISPLAY DASHBOARD VOLUNTEER 
// ==============================

exports.dashboardAllStats = async (req, res, idUser) => {

    try {

        const getUserAddress = await userMdl.getUserAddress(idUser);
        const idRegionByUser = getUserAddress[0].id_region;
        let missionByRegion = await missionMdl.getMissionByRegion(idRegionByUser);

        let ourSelectionRegion = await service.filterOutRegisteredMissions(req, missionByRegion);
        let ourSelectionAll = await service.filterOutRegisteredMissions(req);

        for (let i = 0; i < ourSelectionAll.length; i++) {

            const alreadyExist = ourSelectionRegion.some(
                (item) => item.id_mission === ourSelectionAll[i].id_mission
            );

            if (!alreadyExist) {
                ourSelectionRegion.push(ourSelectionAll[i])
            }

            if (ourSelectionRegion.length === 3) {
                break;
            }
        }

        res.locals.missionsUser = await missionMdl.getAllMissionsByUser(idUser);

        res.locals.historyMissionUser = await missionMdl.addUserHistoryMission(idUser);

        const obtainStatsOnVolunteer = await missionMdl.obtainStatsOnVolunteer(idUser);

        let count = 0;
        let i = 0;
        let tab = [];

        obtainStatsOnVolunteer.resultTimeDiff.forEach((e) => {
            tab.push(parseInt(e.timeDiff));
            count += tab[i];
            i++;
        })

        res.locals.idUser = req.session.userExist.id
        res.locals.statsOnVolunteer = obtainStatsOnVolunteer;
        res.locals.nbrTimeAccomplished = count;

        res.locals.missionByRegion = ourSelectionRegion;

        return res.status(200).render('account/volunteer/dashboardUser');

    } catch (error) {

        logger.error(error);
        res.locals.errorAlertMsg = "Une erreur est survenue lors du chargement de votre tableau de bord. Merci de réessayer dans quelques instants."

        return res.status(500).render('account/volunteer/dashboardUser', {
            missionByRegion: [],
            missionsUser: [],
            historyMissionUser: [],
        })
    }
}

// ==============================
// SAVE VOLUNTEER REGISTRATION
// ==============================

exports.addRegisterMissionUser = async (req, res) => {

    try {

        const idUser = parseInt(req.query.idUser);
        const idMission = parseInt(req.query.idMission);

        const registrationByUser = await missionMdl.getRegistrationByUserId(idMission, idUser);

        if (!req.session || !req.session.userExist || req.session.userExist.id !== idUser) {

            return res.status(403).json({ message: "Accès interdit" });
        }

        if (registrationByUser) {

            return res.status(409).json({ alreadyAdded: true, message: "Vous êtes déjà inscrit à cette mission" });

        } else {

            const result = await missionMdl.registerMissionUser(idUser, idMission);

            if (result === false) {
                throw new Error;
            }
            
            return res.status(200).json({ alreadyAdded: false });
        }

    } catch (error) {

        logger.error(error);
        return res.status(500).json({ message: "Une erreur est survenu, veuillez réessayer dans un instant." })
    }
}

exports.unregisterAVolunteer = async (req, res) => {

    try {

        const idRegistration = parseInt(req.query.idRegistration);
        const idUser = parseInt(req.query.idUser);

        if (!req.session || !req.session.userExist || req.session.userExist.id !== idUser) {

            return res.status(403).json({ message: "Accès interdit" });
        }

        const result = await missionMdl.unregisterAVolunteer(idRegistration);

        if (result === false) {
            return res.json({ registrationDeleted: false, message: "Une erreur est survenu, veuillez réessayer dans un instant." })
        }

        return res.status(200).json({ registrationDeleted: true })

    } catch (error) {

        logger.error(error);
        return res.status(500).json({ message: "Une erreur est survenu, veuillez réessayer dans un instant." })
    }
}

exports.detailsOfNextMission = async (req, res) => {

    try {

        const dataMission = await missionMdl.getDataMissionById(req.params.idMission);
        const dateFormat = service.dateFormat(dataMission.mission_date);
        const timeFormat = service.timeFormat(dataMission.mission_start_time, dataMission.mission_end_time);

        return res.status(200).render("account/volunteer/detailsOfNextMission", {
            dataMission: dataMission || [],
            dateFormat: dateFormat || [],
            timeFormat: timeFormat || [],
        });

    } catch (error) {

        logger.error(error);
        res.locals.errorAlertMsg = "Un problème est survenu. Merci de réessayer dans quelques instants.";
        return res.status(500).render(renderPathByRole, {
            dataMission: [[]],
            dateFormat: [],
            timeFormat: [],
        });
    }
}