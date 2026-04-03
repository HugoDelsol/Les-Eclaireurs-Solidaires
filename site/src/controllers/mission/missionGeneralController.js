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

// ==============================
// SEARCH BY CATEGORY, REGION AND DATE
// ==============================

exports.searchByCategories = async (req, res) => {

    let renderPathByRole = "home/404"

    try {

        res.locals.regions = await missionMdl.getAllRegions();
        res.locals.categoriesMission = await missionMdl.getAllCategories();

        const { regionSelected, categorySelected, tripStart, tripEnd } = req.body;
        const user = req.session.userExist;

        renderPathByRole = user.isVolunteer ? 'account/volunteer/listMissionUser' : 'account/admin/listMissionsAdmin';

        const isDateIncomplete = (tripStart && !tripEnd) || (!tripStart && tripEnd);

        if (!regionSelected && !categorySelected || isDateIncomplete) {

            res.locals.errorAlertMsg = isDateIncomplete
                ? "Veuillez saisir une date de début ET une date de fin."
                : "Veuillez sélectionner une région ou une catégorie."
                ;

            user.isVolunteer ? res.locals.missionsClear = [] : res.locals.missions = [];
            return res.render(renderPathByRole);
        }

        const missionsSelected = await missionMdl.searchByCategories(regionSelected, categorySelected, tripStart, tripEnd);

        const filterOutRegisteredMissions = await service.filterOutRegisteredMissions(req, missionsSelected);

        res.locals.missions = filterOutRegisteredMissions
        res.locals.missionsClear = utils.clearData(filterOutRegisteredMissions);
        res.locals.searchFilters = { regionSelected, categorySelected };

        res.render(renderPathByRole);

    } catch (error) {

        console.log("test")

        console.error(error);

        res.locals.missions = [];
        res.locals.missionsClear = [];
        res.locals.searchFilters = [];
        res.locals.errorAlertMsg = "Un problème est survenu. Merci de réessayer dans quelques instants.";

        res.render(renderPathByRole);
    }
}

// ==============================
// AUTO COMPLETION SYSTEM FOR INSERTING CITY IN FORM
// ==============================

exports.searchCity = async (req, res) => {

    try {

        const valueInput = req.query.q;

        const myRegex = /[^a-zA-ZÀ-ÿ \-']/g;

        const valueClean = valueInput.replace(myRegex, "");

        const searchCity = await missionMdl.searchCityInSql(valueClean);

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

        console.error('Erreur searchCity :', error);
    }
}

// ==============================
// GET DATA MISSION SHOW
// ==============================

exports.getDataMission = async (req, res) => {

    let renderPathByRole = null;
    req.session.userExist.isVolunteer ? renderPathByRole = "account/volunteer/missionDetails" : renderPathByRole = "account/admin/missionDetails";

    try {

        const dataMission = await missionMdl.getDataMissionById(req.params.idMission);
        const dateFormat = service.dateFormat(dataMission.mission_date);
        const timeFormat = service.timeFormat(dataMission.mission_start_time, dataMission.mission_end_time);

        res.render(renderPathByRole, {
            dataMission: dataMission || [],
            dateFormat: dateFormat || [],
            timeFormat: timeFormat || [],
        });

    } catch (error) {

        console.log(error);

        res.locals.errorAlertMsg = "Un problème est survenu. Merci de réessayer dans quelques instants.";
        res.render(renderPathByRole, {
            dataMission: [[]],
            dateFormat: [],
            timeFormat: [],
        });
    }
}

exports.getDataMissionHome = async (req, res) => {

    try {
        const dataMission = await missionMdl.getDataMissionById(req.params.idMission);
        const dateFormat = service.dateFormat(dataMission.mission_date);
        const timeFormat = service.timeFormat(dataMission.mission_start_time, dataMission.mission_end_time);

        res.render('home/detailMission', {
            dataMission: dataMission || [],
            dateFormat: dateFormat || [],
            timeFormat: timeFormat || [],
        });

    } catch (error) {

        console.log(error);

        res.locals.errorAlertMsg = "Un problème est survenu. Merci de réessayer dans quelques instants.";
        res.render('home/detailMission', {
            dataMission: [[]],
            dateFormat: [],
            timeFormat: [],
        });
    }
}
