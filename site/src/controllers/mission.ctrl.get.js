const { userData } = require('../middleware/globalVars.middleware');
const missionModel = require('../models/MissionModel');
const userModel = require('../models/UserModel');
const service = require('../service/getGlobalData');
const missionCtrlPost = require('./mission.ctrl.post');

//---
//--- RECUPERER LES 3 PROCHAINES MISSIONS DANS LA REGION DU BENEVOLE
//---

/* exports.getMissionByRegion = async (req, res) => {

    try {        

        const idRegion = 1;

        const getMissionByRegion = await missionModel.getMissionByRegion(idRegion);

        return getMissionByRegion

    } catch (error) {
        
    }
} */

//---
//--- AFFICHER EN RESPONSIV LES MISSIONS PAR REGIONS DU BENEVOLE VIA JAVASCRIPT
//---

exports.fetchMissionByRegionDashboardUser = async (req, res) => {

    try { 

        const idRegion = 1;

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

    let tabStats = [];

    try {

        const getStatsMissions = await missionModel.getStatsMissions();

        let average = Math.round((getStatsMissions.resultSumVolunteers[0].total_next_30_days / getStatsMissions.resultTotalMissions[0].nbr_missions) * 100);
        const averageToFixed = average.toFixed(0);

        for (let g of getStatsMissions.resultList) {

            const spaceAvailable = g.mission_available_place - g.nb_volunteers;
            const fillRate = (g.nb_volunteers / g.mission_available_place) * 100;
            
            const fillRateToString = fillRate + "%";

            tabStats.push({
                id: g.id_mission,
                mission: g.mission_title,
                date: g.mission_date,
                nbVolunteers: g.nb_volunteers,
                spaceAvailable: spaceAvailable,
                fillRate: fillRateToString,
            })
        }

        res.render("account/dashboardAdmin", {
            pseudoUser: req.session.userExist.firstName,
            isSuperAdmin: req.session.userExist.isSuperAdmin,
            tabStats: tabStats,
            resultSum: getStatsMissions.resultSumVolunteers[0].total_next_30_days,
            average: averageToFixed,
            isSuperAdmin: req.session.userExist.isSuperAdmin
        });

    } catch (error) {

        console.log(error)
    }
}

//---
//--- RECUPERER LES MISSIONS A VENIR
//---

exports.missionAdminShow = async (req, res) => {

    let getAllMissions = [];

    try {

        const regionsServ = await service.region();

        req.session.regions = regionsServ;

        const dataTab = await service.categories();

        req.session.categoriesMission = dataTab;

        getAllMissions = await missionModel.getAllMission();

        req.session.getAllMissions = getAllMissions;

        res.render('account/listMissionsAdmin', {
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            regions: req.session.regions,
            missions: req.session.getAllMissions
        });

    } catch (error) {

        console.error(error);

        res.render('account/listMissionsAdmin', {
            alertMsg: "Impossible d'afficher la liste des missions.",
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            regions: req.session.regions,
            missions: req.session.getAllMissions
        });
    }
}

//---
//--- AFICHER LA LISTE DES MISSIONS A L'UTILISATEUR
//---

exports.missionUserShow = async (req, res) => {

    let getAllMissions = [];

    try {

        const regionsServ = await service.region();

        req.session.regions = regionsServ;

        const dataTab = await service.categories();

        req.session.categoriesMission = dataTab;

        getAllMissions = await missionModel.getAllMission();
        req.session.getAllMissions = getAllMissions;

        const idUser = req.session.userExist.id

        const alreadyRegisteredByUser = await missionModel.alreadyRegistered(idUser)

        if (getAllMissions.length > 0 && alreadyRegisteredByUser.length > 0) {
            for (let i = 0; i < alreadyRegisteredByUser.length; i++) {
                for (let u = 0; u < getAllMissions.length; u++) {
                    if (alreadyRegisteredByUser[i]._id_mission === getAllMissions[u].id_mission) {
                        getAllMissions.splice([u], 1);
                    }
                }
            }
        }

        res.render('account/listMissionUser', {
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            regions: req.session.regions,
            missions: req.session.getAllMissions,
        });

    } catch (error) {

        console.error(error);

        res.render('account/listMissionUser', {
            alertMsg: "Impossible d'afficher la liste des missions.",
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            regions: req.session.regions,
            missions: req.session.getAllMissions,
        });
    }
}

//---
//--- AFICHER LE FORMULAIRE D'AJOUT DE MISSION
//---

exports.addMissionShow = async (req, res) => {

    try {

        const dataTab = await service.categories();

        req.session.categoriesMission = dataTab;

        //throw new Error("Essai du catch");

        res.render('account/addMission', {
            alertMsg: null,
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
        });

    } catch (error) {

        console.error(error);

        res.render('account/addMission', {
            alertMsg: "Impossible d'afficher le formulaire",
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
        });
    }
}

//---
//--- SYSTEME D'AUTOCOMPLETION LORS DE L'AJOUT DUNE VILLE DANS LE FORMULAIRE D'AJOUT DE MISSION VIA JS + QUERY
//---

exports.searchCity = async (req, res) => {

    try {

        const valueInput = req.query.q;

        console.log(valueInput)

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

//---
//--- RECUPERER TOUTE LES MISSIONS DU BENEVOLE
//---

/* exports.getAllMissionsByUser = async (req, res, idUser) => {

    try {

        const allMissionByUser = await missionModel.getAllMissionsByUser(idUser);

        res.render('account/dashboardUser', {

            pseudoUser: req.session.userExist.firstName,
            missionsUser: allMissionByUser.length ? allMissionByUser : false
        })

    } catch (error) {

        console.log("Controler getAllMissionsByUser: ", error)
    }
} */

exports.dashboardAllStats = async (req, res, idUser) => {

    try {
        const getUserAddress = await userModel.getUserAddress(idUser);

        const idRegionByUser = getUserAddress[0].id_region;

        const getMissionByRegion = await missionModel.getMissionByRegion(idRegionByUser);

        console.log(getMissionByRegion)

        const allMissionByUser = await missionModel.getAllMissionsByUser(idUser);

        const historyMissionUser = await missionModel.addUserHistoryMission(idUser);

        res.render('account/dashboardUser', {

            pseudoUser: req.session.userExist.firstName,
            missionsUser: allMissionByUser.length ? allMissionByUser : false,
            missionByRegion: getMissionByRegion,
            historyMissionUser: historyMissionUser,
        })

    } catch (error) {

        console.log("Controler getAllMissionsByUser: ", error)
    }
}

//---
//--- AFFICHER UN MODAL POUR VALIDER L'INSCRIPTIONN A UNE MISSION
//---

exports.modalRegisterMission = async (req, res) => {
    try {

        return res.render('modals/subscribe');

    } catch (error) {

    }
}

//---
//--- ENREGISTRER L'INSCRIPTION D'UN BENEVOLE DANS UNE MISSION
//---

exports.addRegisterMissionUser = async (req, res) => {

    try {

        const idUser = parseInt(req.query.idUser);
        const idMission = parseInt(req.query.idMission);

        const registrationByUser = await missionModel.getRegistrationByUserId(idMission, idUser);

        console.log(idMission)

        if (!req.session || !req.session.userExist || req.session.userExist.id !== idUser) {

            return res.status(400).json({ message: "Petit coquin, tu as bien failli m'avoir" });
        }

        if (registrationByUser) {

            console.log("mission deja ajoutée");
            return res.json({ alreadyAdded: true });

        } else {

            console.log(registrationByUser)

            await missionCtrlPost.registerMissionUser(idUser, idMission);

            console.log("ajouter");
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
