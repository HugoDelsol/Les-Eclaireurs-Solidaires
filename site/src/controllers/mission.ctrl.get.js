const { userData } = require('../middleware/globalVars.middleware');
const missionModel = require('../models/MissionModel');
const userModel = require('../models/UserModel');
const missionCtrlPost = require('./mission.ctrl.post');
const utils = require('../utils/utils');
const service = require('../services/services');

//---
//--- AFFICHER EN RESPONSIV LES MISSIONS PAR REGIONS DU BENEVOLE VIA JAVASCRIPT
//---

exports.fetchMissionByRegionDashboardUser = async (req, res) => {

    try {

        const getUserAddress = await userModel.getUserAddress(req.session.userExist.id);

        const idRegion = getUserAddress[0].id_region;

        const getMissionByRegion = await missionModel.getMissionByRegion(idRegion);

        res.json(getMissionByRegion);

    } catch (error) {

    }
}

exports.fetchMissionByRegistrationDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getAllMissionsByUser = await missionModel.getAllMissionsByUser(idUser);

        res.json(getAllMissionsByUser);

    } catch (error) {

    }
}

exports.fetchMissionAccomplishedDashboardUser = async (req, res) => {

    try {

        const idUser = req.session.userExist.id;

        const getMissionAccomplishedByUser = await missionModel.addUserHistoryMission(idUser)

        res.json(getMissionAccomplishedByUser);

    } catch (error) {

    }
}

//---
//--- AFFICHER A L'ADMIN LES STATS ET MISSIONS SUR LES 30 PROCHAIN JOURS (DASHBOARD)
//---

exports.getStatsMissions = async (req, res) => {

    try {

        const getStatsMissions = await missionModel.getStatsMissions();

        const resultService = await service.formatMissionStats(getStatsMissions)

        res.locals.isSuperAdmin = req.session.userExist.isSuperAdmin;
        res.locals.isAdmin = req.session.userExist.isAdmin;

        res.render("account/dashboardAdmin", {
            tabStats: resultService.tabStats,
            resultSum: getStatsMissions.resultSumVolunteers[0].total_next_30_days,
            average: resultService.averageToFixed,
            totalMission: getStatsMissions.resultTotalMissions[0]
        });

    } catch (error) {

        console.log(error)
        res.render("account/dashboardAdmin", {
            errorAlertMsg: "Échec de la récupération des statistiques utilisateurs.",
            tabStats: [],
            resultSum: [],
            average: [],
            totalMission: [],
        })
    }
}

//---
//--- RECUPERER LES MISSIONS A VENIR
//---

exports.missionAdminShow = async (req, res) => {

    let getAllMissions = [];

    try {

        req.session.regions = await missionModel.getAllRegions();

        req.session.categoriesMission = await missionModel.getAllCategories();

        getAllMissions = await missionModel.getAllMission();

        res.locals.regions = req.session.regions;
        res.locals.categoriesMission = req.session.categoriesMission;
        res.locals.missions = getAllMissions

        res.render('account/listMissionsAdmin');

    } catch (error) {

        console.error(error);

        res.render('account/listMissionsAdmin', {
            alertMsg: "Impossible d'afficher la liste des missions.",
            categoriesMission: req.session.categoriesMission || [],
            regions: req.session.regions || [],
            missions: req.session.getAllMissions || []
        });
    }
}

//---
//--- AFICHER LA LISTE DES MISSIONS A L'UTILISATEUR
//---

exports.missionUserShow = async (req, res) => {



    try {

        const regions = await missionModel.getAllRegions();

        const categoriesMission = await missionModel.getAllCategories();

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

//---
//--- AFICHER LE FORMULAIRE D'AJOUT DE MISSION
//---

exports.addMissionShow = async (req, res) => {

    const categoriesMission = await missionModel.getAllCategories();

    req.session.categoriesMission = categoriesMission;

    res.render('account/addMission');
}

//---
//--- SYSTEME D'AUTOCOMPLETION LORS DE L'AJOUT DUNE VILLE DANS LE FORMULAIRE D'AJOUT DE MISSION VIA JS + QUERY
//---

exports.searchCity = async (req, res) => {

    try {

        const valueInput = req.query.q;

        const searchCity = await missionModel.searchCityInSql(valueInput);

        let allCitys = [];

        for (c of searchCity) {

            const data = {
                idCity: c.id_city,
                cityName: c.city_name,
                idRegion: c._id_region,
            }

            allCitys.push(data);
        }

        res.json(allCitys);

    } catch (error) {

        console.error('Erreur:', error);
    }
}


exports.dashboardAllStats = async (req, res, idUser) => {

    try {

        const getUserAddress = await userModel.getUserAddress(idUser);

        const idRegionByUser = getUserAddress[0].id_region

        res.locals.missionByRegion = await missionModel.getMissionByRegion(idRegionByUser);

        res.locals.missionsUser = await missionModel.getAllMissionsByUser(idUser);

        res.locals.historyMissionUser = await missionModel.addUserHistoryMission(idUser);

        const obtainStatsOnVolunteer = await missionModel.obtainStatsOnVolunteer(idUser);

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
//--- AFFICHER UN MODAL POUR VALIDER L'INSCRIPTIONN A UNE MISSION
//---

exports.modalRegisterMission = async (req, res) => {
    return res.render('modals/subscribe');
}

//---
//--- ENREGISTRER L'INSCRIPTION D'UN BENEVOLE DANS UNE MISSION
//---

exports.addRegisterMissionUser = async (req, res) => {

    try {           

        const idUser = parseInt(req.query.idUser);
        const idMission = parseInt(req.query.idMission);

        const registrationByUser = await missionModel.getRegistrationByUserId(idMission, idUser);


        if (!req.session || !req.session.userExist || req.session.userExist.id !== idUser) {

            return res.status(400).json({ message: "Petit coquin, tu as bien failli m'avoir" });
        }

        if (registrationByUser) {

            console.log("alreadyAdded: true");
            return res.json({ alreadyAdded: true });

        } else {

            const result = await missionCtrlPost.registerMissionUser(idUser, idMission);

            if (result === false) {
                throw new Error;
            }

            console.log("alreadyAdded: false");
            return res.json({ alreadyAdded: false });
        }

    } catch (error) {

        console.error("Erreur registerMissionUser :", error);
    }
}

//---
//--- AFFICHER LES DONNEES D'UNE MISSION
//---

exports.getDataMission = async (req, res) => {
    console.log(req.params.idMission);
}
