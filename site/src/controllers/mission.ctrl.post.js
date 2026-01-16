const { userData } = require('../middleware/globalVars.middleware');
const missionModel = require('../models/MissionModel');
const utils = require('../utils/utils');

//---
//--- FAIRE DES RECHERCHES DE MISSIONS PAR CATEGORIES
//---

exports.searchByCategories = async (req, res) => {

    let missionsSelected = [];

    try {

        let regionSelected = req.body.regionSelected;
        let categorySelected = req.body.categorySelected;
        let tripStart = req.body.tripStart;
        let tripEnd = req.body.tripEnd;

        !regionSelected ? regionSelected = false : regionSelected;
        !categorySelected ? categorySelected = false : categorySelected;

        !tripStart ? tripStart = false : tripStart;
        !tripEnd ? tripEnd = false : tripEnd;

        if (tripStart && !tripEnd || !tripStart && tripEnd) {

            if (req.session.userExist.isVolunteer) {

                return res.render('account/listMissionUser', {
                    categoriesMission: req.session.categoriesMission,
                    regions: req.session.regions,
                    missions: req.session.getAllMissions,
                    categorySelected: categorySelected,
                    regionSelected: regionSelected,
                    alertMsg: "Veuilliez saisir une date de début et une date de fin."
                });
            }

            if (req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {

                return res.render('account/listMissionsAdmin', {
                    categoriesMission: req.session.categoriesMission,
                    regions: req.session.regions,
                    missions: req.session.getAllMissions,
                    categorySelected: categorySelected,
                    regionSelected: regionSelected,
                    alertMsg: "Veuilliez saisir une date de début et une date de fin."
                });
            }
        }

        missionsSelected = await missionModel.searchByCategories(regionSelected, categorySelected, tripStart, tripEnd);

        if (req.session.userExist.isVolunteer) {

            return res.render('account/listMissionUser', {
                missionSelected: missionsSelected,
                categoriesMission: req.session.categoriesMission,
                regions: req.session.regions,
                missions: req.session.getAllMissions,
                categorySelected: categorySelected,
                regionSelected: regionSelected,
            });

        } else {

            return res.render('account/listMissionsAdmin', {
                missionSelected: missionsSelected,
                categoriesMission: req.session.categoriesMission,
                regions: req.session.regions,
                missions: req.session.getAllMissions,
                categorySelected: categorySelected,
                regionSelected: regionSelected,
            });
        }

    } catch (error) {

        console.log(error);
        res.render('home/404');
    }
}

exports.addMission = async (req, res) => {

    try {

        let imageUrl = null;

        const category = req.body.category;        
        
        if (!req.body.uploadImg) {                        

            const fetchGroupImages = await missionModel.fetchImgByCategory(category);

            const randomImage = utils.randomImage(fetchGroupImages);

            imageUrl = randomImage;

        } else {
            
            imageUrl = req.body.uploadImg;
        }

        const {
            title,
            description,
            date,
            startTime,
            endTime,
            cityId,
            placeName,
            spaceAvailable,
        } = req.body;

        if (
            !title ||
            !category ||
            !description ||
            !date ||
            !startTime ||
            !endTime ||
            !cityId ||
            !placeName ||
            !spaceAvailable) {

            throw new Error("Veuillez remplir tous les champs.");
        }

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
                imageUrl
            );

        if (insertMission) {

            res.render('account/addMission', {
                pseudoUser: req.session.userExist.firstName,
                categoriesMission: req.session.categoriesMission,
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
