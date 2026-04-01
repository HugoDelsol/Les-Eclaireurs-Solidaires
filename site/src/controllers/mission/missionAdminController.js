// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries
const { matchedData } = require('express-validator');

// Models
const missionMdl = require('../../models/MissionModel');

// Controllers

// Utils - Services
const utils = require('../../utils/utils.js');
const service = require('../../services/services.js');

// Get Functions

// ==============================
// POST A VOLUNTEER OPPORTUNITY
// ==============================

exports.addMission = async (req, res) => {

    try {

        let imageUrl = null;

        const category = req.body.category;

        if (!req.body.uploadImg) {

            const fetchGroupImages = await missionMdl.fetchImgByCategory(category);

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

        const insertMission = await missionMdl.insertMission
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

            res.render('account/admin/addMission', {
                pseudoUser: req.session.userExist.firstName,
                categoriesMission: req.session.categoriesMission,
                successAlertMsg: 'Missions ajoutée !',
            })
        }

    } catch (error) {

        console.log(error);

        res.render('account/admin/addMission', {
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            errorAlertMsg: 'Veuillez remplir tous les champs.',
        })
    }
}

// ==============================
// DISPLAY STATS NEXT DAYS
// ==============================

exports.getStatsMissions = async (req, res) => {

    try {

        const getStatsMissions = await missionMdl.getStatsMissions();

        const resultService = await service.formatMissionStats(getStatsMissions);

        res.locals.isSuperAdmin = req.session.userExist.isSuperAdmin;
        res.locals.isAdmin = req.session.userExist.isAdmin;

        res.render("account/admin/dashboardAdmin", {
            tabStats: resultService.tabStats,
            resultSum: getStatsMissions.resultSumVolunteers[0].total_next_30_days,
            average: resultService.averageToFixed,
            totalMission: getStatsMissions.resultTotalMissions[0]
        });

    } catch (error) {

        console.log(error)
        res.render("account/admin/dashboardAdmin", {
            errorAlertMsg: "Échec de la récupération des statistiques utilisateurs.",
            tabStats: [],
            resultSum: [],
            average: [],
            totalMission: [],
        })
    }
}

// ==============================
// GET UPCOMING MISSIONS
// ==============================

exports.missionAdminShow = async (req, res) => {

    try {

        res.locals.regions = await missionMdl.getAllRegions();
        res.locals.categoriesMission = await missionMdl.getAllCategories();
        res.locals.missions = await missionMdl.getAllMission();

        res.render('account/admin/listMissionsAdmin');

    } catch (error) {

        console.error(error);

        res.render('account/admin/listMissionsAdmin', {
            errorAlertMsg: "Impossible d'afficher la liste des missions.",
            categoriesMission: res.locals.categoriesMission || [],
            regions: res.locals.regions || [],
            missions: res.locals.missions || []
        });
    }
}

// ==============================
// DISPLAY FORM ADD MISSION
// ==============================

exports.addMissionShow = async (req, res) => {

    try {

        const categoriesMission = await missionMdl.getAllCategories();
        res.locals.categoriesMission = categoriesMission;
        res.render('account/admin/addMission');

    } catch (error) {

        console.log(error);
        res.locals.errorAlertMsg = "Impossible de récupérer la liste des catégories";
        res.render('account/admin/addMission');
    }

}

exports.updateMissionView = async (req, res, safeData) => {

    
    try {
        
        if(safeData){
            const dataMission = safeData.dataMission
        }

        res.locals.categoriesMission = await missionMdl.getAllCategories();
        const dataMission = await missionMdl.getDataMissionById(req.params.idMission);
        const dataFormatted = service.formatedDateForUpdateMission(dataMission[0]);

        res.locals.idMission = dataMission[0].id_mission;

        res.render('account/admin/updateMission', {
            dataMission: dataMission[0],
            formattedDate: dataFormatted.formattedDate,
            startTime: dataFormatted.startTi,
            endTime: dataFormatted.endTi,
        });

    } catch (error) {

        console.log(error);
        res.locals.errorAlertMsg = "Un problème est survenu lors de l'accès aux détails de la mission.";
        res.render('account/admin/updateMission', {
            dataMission: [[]],
            formattedDate: [],
            startTime: [],
            endTime: [],
        });

    }
}

exports.updateMission = async (req, res) => {

    try {

        /* console.log("--- DEBUG UPLOAD ---");
        console.log("Fichier reçu (req.file) :", req.file);
        console.log("Champs texte (req.body) :", req.body); */

        const safeData = matchedData(req);

        console.log(safeData)

        if (res.locals.errorAlertMsg) {
            this.updateMissionView(req, res, safeData)
        }



    } catch (error) {

        console.log(error);
        res.locals.errorAlertMsg = "Un problème est survenu lors de l'accès aux détails de la mission.";
        res.render('account/admin/updateMission', {

        });

    }
}



