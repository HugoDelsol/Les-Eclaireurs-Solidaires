const { userData } = require('../middleware/globalVars.middleware');
const missionModel = require('../models/MissionModel');
const service = require('../service/getGlobalData');
const missionCtrlPost = require('./mission.ctrl.post');

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

        //throw new Error("Essai du catch");

        res.render('account/listMissionUser', {
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            regions: req.session.regions,
            missions: getAllMissions
        });

    } catch (error) {

        console.error(error);

        res.render('account/listMissionUser', {
            alertMsg: "Impossible d'afficher la liste des missions.",
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            regions: req.session.regions,
            missions: getAllMissions
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

exports.getAllMissionsByUser = async (req, res, idUser) => {

    try {

        const allMissionByUser = await missionModel.getAllMissionsByUser(idUser);

        res.render('account/dashboardUser', {

            missionsUser: allMissionByUser.length ? allMissionByUser : false

        })

    } catch (error) {

        console.log("Controler : ", error)
    }


}

//---
//--- FAIRE DES RECHERCHES DE MISSIONS PAR CATEGORIES
//---

exports.searchByCategories = async (req, res) => {

    try {

    } catch (error) {

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
//--- ENREGISTRER L'INSCRIPTION DUN BENEVOLE DANS UNE MISSION
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
