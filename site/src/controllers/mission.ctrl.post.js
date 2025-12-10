const { userData } = require('../middleware/globalVars.middleware');
const missionModel = require('../models/MissionModel');

//---
//--- FAIRE DES RECHERCHES DE MISSIONS PAR CATEGORIES
//---

exports.searchByCategories = async (req, res) => {

    let missionsSelected = []

    try {

        const regionSelected = req.body.regionSelected;
        const categorySelected = req.body.categorySelected;
        let tripStart = req.body.tripStart;
        let tripEnd = req.body.tripEnd;

        console.log(regionSelected)
        console.log(categorySelected);


        !tripStart ? tripStart = false : tripStart;
        !tripEnd ? tripEnd = false : tripEnd;

        if (tripStart && !tripEnd || !tripStart && tripEnd) {
            throw new Error("Veuillez saisir une date de début et une date de fin.")
        }

        missionsSelected = await missionModel.searchByCategories(regionSelected, categorySelected, tripStart, tripEnd);

        if (req.session.userExist.isAdmin === false) {
            
            res.render('account/listMissionUser', {
                missionSelected: missionsSelected,
                categoriesMission: req.session.categoriesMission,
                regions: req.session.regions,
            });

        } else {
            
            res.render('account/listMissionsAdmin', {
                missionSelected: missionsSelected,
                categoriesMission: req.session.categoriesMission,
                regions: req.session.regions,
            });
        }

    } catch (error) {

        console.log(error)
    }
}

exports.addMission = async (req, res) => {

    try {

        const title = req.body.title;
        const category = req.body.category;
        const description = req.body.description;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const cityId = req.body.cityId;
        const placeName = req.body.placeName;
        const spaceAvailable = req.body.spaceAvailable;
        const uploadImg = req.body.uploadImg;

        if (
            !req.body.title ||
            !req.body.category ||
            !req.body.description ||
            !req.body.date ||
            !req.body.startTime ||
            !req.body.endTime ||
            !req.body.cityId ||
            !req.body.placeName ||
            !req.body.spaceAvailable ||
            !req.body.uploadImg) {

            throw new Error("Veuillez remplir tous les champs.");
        }

        console.log("***", req.body.cityId);

        const insertMission = await missionModel.insertMission
            (
                title,
                category,
                description,
                date,
                startTime,
                endTime,
                cityId,
                placeName,
                spaceAvailable,
                uploadImg
            );

        if (insertMission) {

            res.render('account/dashboardAdmin', {
                pseudoUser: req.session.userExist.firstName,
                alertMsg: 'Missions ajoutée',

            })

            console.log("Insertion MISSION BDD OK");
        }

    } catch (error) {

        res.render('account/addMission', {

            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            alertMsg: 'Veuillez remplir tous les champs.',

        })

        console.log(error);
    }
}

exports.registerMissionUser = async (idUser, idMission) => {

    try {

        await missionModel.registerMissionUser(idUser, idMission);


    } catch (error) {

        console.log(error);
    }

}
