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
        res.locals.categoriesMission = await missionMdl.getAllCategories();

        if (res.locals.errorAlertMsg.length > 0) {
            return res.render('account/admin/addMission', {
                data: req.body
            });
        }

        let imageUrl = null;
        const category = req.body.category;

        if (!req.body.uploadImg) {

            const fetchGroupImages = await missionMdl.fetchImgByCategory(category);

            const randomImage = utils.randomImage(fetchGroupImages);

            imageUrl = randomImage;

        } else {

            imageUrl = req.body.uploadImg;
        }

        const safeData = matchedData(req);

        await missionMdl.insertMission(safeData, imageUrl);

        res.locals.successAlertMsg = 'Votre mission a bien été enregistrée';
        this.missionAdminShow(req, res);

    } catch (error) {

        console.log(error);

        res.render('account/admin/addMission', {
            pseudoUser: req.session.userExist.firstName,
            errorAlertMsg: 'Un problème technique est survenu, veuillez réessayer dans un instant',
        });
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
        res.locals.missions = await missionMdl.getAllMissionForAdmin();

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

exports.updateMissionView = async (req, res) => {

    try {

        res.locals.categoriesMission = await missionMdl.getAllCategories();
        const dataMission = await missionMdl.getDataMissionById(req.params.idMission);
        const dataFormatted = service.formatedDateForUpdateMission(dataMission);
        res.locals.idMission = dataMission.id_mission;

        res.render('account/admin/updateMission', {
            dataMission: dataMission,
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

        let categoryName = null;

        if (res.locals.errorAlertMsg.length > 0) {

            res.locals.categoriesMission = await missionMdl.getAllCategories();
            res.locals.categoriesMission.forEach(element => {
                if (element.id_mission_category === req.body.category) {
                    categoryName = element.mission_category_name
                }
            });

            res.render('account/admin/updateMission', {
                idMission: req.params.idMission,
                dataMission: req.body,
                categoryName: categoryName,
                formattedDate: req.body.date,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
            });
        }

        let imageUrl = null;

        const safeData = matchedData(req);

        if (!req.body.uploadImg) {

            const fetchGroupImages = await missionMdl.fetchImgByCategory(safeData.category);

            const randomImage = utils.randomImage(fetchGroupImages);

            imageUrl = randomImage;

        } else {

            imageUrl = safeData.uploadImg;
        }

        await missionMdl.updateMission(req.params.idMission, safeData, imageUrl);
        res.locals.successAlertMsg = `La mission "${req.body.title}" a bien été mise à jour`;
        return this.missionAdminShow(req, res);

    } catch (error) {

        console.log(error);
        res.status(500).render('home/404', {
            errorAlertMsg: "Un problème technique est survenu."
        });
    }
}



