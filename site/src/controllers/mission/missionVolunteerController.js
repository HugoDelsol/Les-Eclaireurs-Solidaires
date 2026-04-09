// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries

// Models
const missionMdl = require('../../models/MissionModel');
const userMdl = require('../../models/UserModel');

// Controllers

// Utils - Services
const utils = require('../../utils/utils.js');
const service = require('../../services/services.js');

// Get Functions

// ==============================
// DISPLAY MODAL REGISTER MISSION
// ==============================

exports.modalRegisterMission = async (req, res) => {
    return res.render('modals/subscribe');
}

// ==============================
// DISPLAY MODAL UNSUBSCRIBE MISSION
// ==============================

exports.modalUnsubscribeMission = async (req, res) => {
    return res.render('modals/unsubscribe');
}

// ==============================
// RESPONSIV MISSION DASHBOARD VOLUNTEER
// ==============================

exports.fetchMissionByRegionDashboardUser = async (req, res) => {

    try {

        const getUserAddress = await userMdl.getUserAddress(req.session.userExist.id);

        const idRegion = getUserAddress[0].id_region;

        const getMissionByRegion = await missionMdl.getMissionByRegion(idRegion);

        res.json(getMissionByRegion);

    } catch (error) {

        res.status(400).json({ errorMsg: "Impossible d'afficher la liste des missions sélectionnées pour vous." });
    }
}

exports.fetchMissionByRegistrationDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getAllMissionsByUser = await missionMdl.getAllMissionsByUser(idUser);

        res.json(getAllMissionsByUser);

    } catch (error) {

        res.status(400).json({ errorMsg: "Impossible d'afficher la liste des missions liées aux inscriptions." });
    }
}

exports.fetchMissionAccomplishedDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getMissionAccomplishedByUser = await missionMdl.addUserHistoryMission(idUser)

        res.json(getMissionAccomplishedByUser);

    } catch (error) {

        res.status(400).json({ errorMsg: "Impossible d'afficher la liste des missions accomplies." });
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

        res.render('account/volunteer/listMissionUser');

    } catch (error) {

        console.error(error);

        res.locals.errorAlertMsg = "Impossible d'afficher la liste des missions.";
        res.locals.missionsClear = [];

        res.render('account/volunteer/listMissionUser');
    }
}

// ==============================
// DISPLAY DASHBOARD VOLUNTEER 
// ==============================

exports.dashboardAllStats = async (req, res, idUser) => {

    try {

        const getUserAddress = await userMdl.getUserAddress(idUser);

        const idRegionByUser = getUserAddress[0].id_region;

        res.locals.missionByRegion = await missionMdl.getMissionByRegion(idRegionByUser);

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

        res.render('account/volunteer/dashboardUser');

    } catch (error) {

        console.log("Controler getAllMissionsByUser: ", error);
        res.locals.errorAlertMsg = "Une erreur est survenue lors du chargement de votre tableau de bord. Merci de réessayer dans quelques instants."

        res.render('account/volunteer/dashboardUser', {
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

            return res.status(400).json({ message: "Petit coquin, tu as bien failli m'avoir" });
        }

        if (registrationByUser) {

            console.log("alreadyAdded: true");
            return res.json({ alreadyAdded: true , message: "Vous êtes déjà inscrit à cette mission"});

        } else {

            const result = await missionMdl.registerMissionUser(idUser, idMission);

            if (result === false) {
                throw new Error;
            }

            console.log("alreadyAdded: false");
            return res.json({ alreadyAdded: false });
        }

    } catch (error) {

        console.error("Erreur registerMissionUser :", error);
        return res.json({ message: "Une erreur est survenu, veuillez réessayer dans un instant." })
    }
}

exports.unregisterAVolunteer = async (req, res) => {

    try {

        const idRegistration = parseInt(req.query.idRegistration);
        const idUser = parseInt(req.query.idUser);

        if (!req.session || !req.session.userExist || req.session.userExist.id !== idUser) {

            return res.status(400).json({ message: "Petit coquin, tu as bien failli m'avoir" });
        }

        const result = await missionMdl.unregisterAVolunteer(idRegistration);
        
        if (result === false) {
            return res.json({ registrationDeleted: false , message: "Une erreur est survenu, veuillez réessayer dans un instant."})
        }
        
        return res.json({ registrationDeleted: true})

    } catch (error) {

        console.error("Erreur registerMissionUser :", error);
        return res.json({ message: "Une erreur est survenu, veuillez réessayer dans un instant." })
    }
}