// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries

// Models
const missionMdl = require('../../models/MissionModel');
const userModel = require('../../models/UserModel');

// Controllers

// Utils - Services
const utils = require('../../utils/utils.js');
const service = require('../../services/services.js');

// Get Functions

//---
//--- AFFICHER UN MODAL POUR VALIDER L'INSCRIPTIONN A UNE MISSION
//---

exports.modalRegisterMission = async (req, res) => {
    return res.render('modals/subscribe');
}

//---
//--- AFFICHER EN RESPONSIV LES MISSIONS PAR REGIONS DU BENEVOLE VIA JAVASCRIPT
//---

exports.fetchMissionByRegionDashboardUser = async (req, res) => {

    try {

        const getUserAddress = await userModel.getUserAddress(req.session.userExist.id);

        const idRegion = getUserAddress[0].id_region;

        const getMissionByRegion = await missionMdl.getMissionByRegion(idRegion);

        res.json(getMissionByRegion);

    } catch (error) {

    }
}

exports.fetchMissionByRegistrationDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getAllMissionsByUser = await missionMdl.getAllMissionsByUser(idUser);

        res.json(getAllMissionsByUser);

    } catch (error) {

    }
}

exports.fetchMissionAccomplishedDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getMissionAccomplishedByUser = await missionMdl.addUserHistoryMission(idUser)

        res.json(getMissionAccomplishedByUser);

    } catch (error) {

    }
}

//---
//--- AFICHER LA LISTE DES MISSIONS A L'UTILISATEUR
//---

exports.missionUserShow = async (req, res) => {

    try {

        const regions = await missionMdl.getAllRegions();

        const categoriesMission = await missionMdl.getAllCategories();

        const filterOutRegisteredMissions = await service.filterOutRegisteredMissions(req);

        req.session.regions = regions;
        req.session.categoriesMission = categoriesMission;

        const clearData = utils.clearData(filterOutRegisteredMissions);

        res.locals.missionsClear = clearData;
        res.locals.regions = req.session.regions;
        res.locals.categoriesMission = req.session.categoriesMission;

        res.render('account/listMissionUser');

    } catch (error) {

        console.error(error);

        res.locals.alertMsg = "Impossible d'afficher la liste des missions.";
        res.locals.missionsClear = [];

        res.render('account/listMissionUser');
    }
}

exports.dashboardAllStats = async (req, res, idUser) => {

    try {

        const getUserAddress = await userModel.getUserAddress(idUser);

        const idRegionByUser = getUserAddress[0].id_region

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

        res.locals.statsOnVolunteer = obtainStatsOnVolunteer
        res.locals.nbrTimeAccomplished = count

        res.render('account/dashboardUser')

    } catch (error) {

        console.log("Controler getAllMissionsByUser: ", error);
        res.locals.errorAlertMsg = "Une erreur est survenue lors du chargement de votre tableau de bord. Merci de réessayer dans quelques instants."

        res.render('account/dashboardUser', {
            missionByRegion: [],
            missionsUser: [],
            historyMissionUser: [],
        })
    }
}

//---
//--- ENREGISTRER L'INSCRIPTION D'UN BENEVOLE DANS UNE MISSION
//---

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
            return res.json({ alreadyAdded: true });

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

/* exports.registerMissionUser = async (idUser, idMission) => {

    try {

        await missionMdl.registerMissionUser(idUser, idMission);

    } catch (error) {

        console.log(error);
        return false
    }
} */