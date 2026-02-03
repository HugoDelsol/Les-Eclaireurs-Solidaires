// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

// Libraries

// Models
const missionMdl = require('../../models/MissionModel');

// Controllers

// Utils - Services
const utils = require('../../utils/utils.js');
const service = require('../../services/services.js');

// Get Functions

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

            res.render('account/addMission', {
                pseudoUser: req.session.userExist.firstName,
                categoriesMission: req.session.categoriesMission,
                successAlertMsg: 'Missions ajoutée',

            })
        }

    } catch (error) {

        console.log(error);

        res.render('account/addMission', {
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
            errorAlertMsg: 'Veuillez remplir tous les champs.',
        })
    }
}

//---
//--- AFFICHER A L'ADMIN LES STATS ET MISSIONS SUR LES 30 PROCHAIN JOURS (DASHBOARD)
//---

exports.getStatsMissions = async (req, res) => {

    try {

        const getStatsMissions = await missionMdl.getStatsMissions();

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

        req.session.regions = await missionMdl.getAllRegions();

        req.session.categoriesMission = await missionMdl.getAllCategories();

        getAllMissions = await missionMdl.getAllMission();

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
//--- AFICHER LE FORMULAIRE D'AJOUT DE MISSION
//---

exports.addMissionShow = async (req, res) => {

    const categoriesMission = await missionMdl.getAllCategories();

    req.session.categoriesMission = categoriesMission;

    res.render('account/addMission');
}

