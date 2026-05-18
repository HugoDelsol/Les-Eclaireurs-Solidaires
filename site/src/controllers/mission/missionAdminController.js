// ==============================
// IMPORTS & DEPENDENCIES
// ==============================
const logger = require('../../utils/logger.js');
const { matchedData } = require('express-validator');
const missionMdl = require('../../models/MissionModel');
const utils = require('../../utils/utils.js');
const service = require('../../services/services.js');

// ==============================
// POST A VOLUNTEER OPPORTUNITY
// ==============================
exports.addMission = async (req, res) => {

    try {
        res.locals.categoriesMission = await missionMdl.getAllCategories();

        if (res.locals.errorAlertMsg.length > 0) {
            return res.status(422).render('account/admin/addMission', {
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

        logger.error(error);
        return res.status(500).render('account/admin/addMission', {
            pseudoUser: req.session.userExist.firstName,
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
    }
}

// ==============================
// DISPLAY STATS NEXT DAYS
// ==============================

exports.getStatsMissions = async (req, res) => {

    try {

        const missionStats = await missionMdl.getStatsMissions();        
        const resultService = await service.formatMissionStats(missionStats);

        return res.status(200).render("account/admin/dashboardAdmin", {
            tabStats: resultService.tabStats,
            resultSum: missionStats.resultSumVolunteers[0].total_next_30_days,
            average: resultService.average,
            totalMission: missionStats.resultTotalMissions[0]
        });

    } catch (error) {

        logger.error(error);
        return res.status(500).render("account/admin/dashboardAdmin", {
            tabStats: [],
            resultSum: 0,
            average: 0,
            totalMission: 0,
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
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

        return res.status(200).render('account/admin/listMissionsAdmin');

    } catch (error) {

        logger.error(error);

        return res.status(500).render('account/admin/listMissionsAdmin', {
            categoriesMission: res.locals.categoriesMission || [],
            regions: res.locals.regions || [],
            missions: res.locals.missions || [],
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
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
        return res.status(200).render('account/admin/addMission');

    } catch (error) {

        logger.error(error);
        res.locals.errorAlertMsg = "Une erreur est survenue. Merci de réessayer dans un instant.";
        res.status(500).render('account/admin/addMission');
    }

}

exports.updateMissionView = async (req, res) => {

    try {

        res.locals.categoriesMission = await missionMdl.getAllCategories();
        const dataMission = await missionMdl.getDataMissionById(req.params.idMission);
        const dataFormatted = service.formatedDateForUpdateMission(dataMission);
        res.locals.idMission = dataMission.id_mission;

        return res.status(200).render('account/admin/updateMission', {
            dataMission: dataMission,
            formattedDate: dataFormatted.formattedDate,
            startTime: dataFormatted.startTi,
            endTime: dataFormatted.endTi,
        });

    } catch (error) {

        logger.error(error);
        res.locals.errorAlertMsg = "Une erreur est survenue. Merci de réessayer dans un instant.";
        return res.status(500).render('account/admin/updateMission', {
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
                    categoryName = element.mission_category_name;
                }
            });

            return res.status(422).render('account/admin/updateMission', {
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

        logger.error(error);
        res.status(500).render('account/admin/updateMission', {
            idMission: req.params.idMission,
            dataMission: req.body,
            categoryName: [],
            formattedDate: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
    }
}



