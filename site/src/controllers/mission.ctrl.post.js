const session = require('express-session');
const { userData } = require('../middleware/globalVars.middleware');
const missionModel = require('../models/MissionModel');
const utils = require('../utils/utils');

//---
//--- FAIRE DES RECHERCHES DE MISSIONS PAR CATEGORIES
//---

/* exports.searchByCategories = async (req, res) => {

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
        
        if (!regionSelected || !categorySelected) {
            res.locals.alertMsg = "dzdzdz"
            return res.render('account/listMissionUser', {
                missionsClear: [],
            })
        }

        missionsSelected = await missionModel.searchByCategories(regionSelected, categorySelected, tripStart, tripEnd);               

        if (tripStart && !tripEnd || !tripStart && tripEnd) {

            if (req.session.userExist.isVolunteer) {
                
                return res.render('account/listMissionUser', {
                    alertMsg: "Veuilliez saisir une date de début et une date de fin."
                });
            }

            
            if (req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {
                
                return res.render('account/listMissionsAdmin', {
                    missionSelected: clearData,
                    categoriesMission: req.session.categoriesMission,
                    regions: req.session.regions,
                    missions: clearData,
                    categorySelected: categorySelected,
                    regionSelected: regionSelected,
                    alertMsg: "Veuilliez saisir une date de début et une date de fin."
                });
            }
        }

        const clearDataSelected = utils.clearData(missionsSelected);
        res.locals.missionsClear = clearDataSelected; 

        if (req.session.userExist.isVolunteer) {           

            return res.render('account/listMissionUser', {
                missionsClear: [],
                categorySelected: categorySelected,
                regionSelected: regionSelected,
            });

        } else {

            return res.render('account/listMissionsAdmin', {
                
                categoriesMission: req.session.categoriesMission,
                regions: req.session.regions,
                missions: [],
                categorySelected: categorySelected,
                regionSelected: regionSelected,
            });
        }

    } catch (error) {

        console.log(error);
        res.render('home/404');
    }
} */

exports.searchByCategories = async (req, res) => {
    try {

        const { regionSelected, categorySelected, tripStart, tripEnd } = req.body;
        const user = req.session.userExist;

        const renderPathByRole = user.isVolunteer ? 'account/listMissionUser' : 'account/listMissionsAdmin';

        const isDateIncomplete = (tripStart && !tripEnd) || (!tripStart && tripEnd);

        if (!regionSelected && !categorySelected || isDateIncomplete) {

            res.locals.alertMsg = isDateIncomplete
                ? "Veuillez saisir une date de début ET une date de fin."
                : "Veuillez sélectionner une région ou une catégorie.";

                
            user.isVolunteer ? res.locals.missionsClear = [] : res.locals.missions = [];
            return res.render(renderPathByRole);
        }

        const missions = await missionModel.searchByCategories(regionSelected, categorySelected, tripStart, tripEnd);

        res.locals.missions = missions
        res.locals.missionsClear = utils.clearData(missions);
        res.locals.searchFilters = { regionSelected, categorySelected }; 
        
        res.render(renderPathByRole);

    } catch (error) {
        console.error(error);
        res.render('home/404');
    }
};

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
