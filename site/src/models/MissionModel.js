const db = require('../config/database');

exports.updateUserProfile = async (idUser, lastName, firstName, phone, address, cityId, category) => {

    try {

        let query = [];
        let params = [];

        if (lastName) {
            query.push("user_last_name = ?");
            params.push(lastName);
        }
        if (firstName) {
            query.push("user_first_name = ?");
            params.push(firstName)
        }
        if (phone) {
            query.push("user_phone_number = ?");
            params.push(phone)
        }
        if (address) {
            query.push("user_adress = ?");
            params.push(address)
        }
        if (cityId) {
            query.push("_id_city = ?");
            params.push(cityId)
        }
        if (category) {
            query.push("_id_category = ?");
            params.push(category)
        }

        if (query.length > 0) {

            params.push(idUser);

            const updateUserProfile = `
                UPDATE user                                    
                SET ${query.join(", ")}
                WHERE id_user = ?
            `;

            const [result] = await db.query(updateUserProfile, params);
            return result;

        } else {

            return false
        }

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.fetchStatsMissionForHomePage = async () => {

    try {

        const request = `
            SELECT COUNT(id_mission) AS nbrMissions FROM mission;
            SELECT COUNT(DISTINCT _id_city) AS nbrCitys FROM mission;
        `
        const [result] = await db.query(request);
        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.addUserHistoryMission = async (idUser) => {

    try {

        const requestSelect = `
            SELECT *, DATE_FORMAT(mission_date, '%d/%m/%Y') AS mission_date
            FROM registration_mission
            LEFT JOIN mission 
            ON id_mission = _id_mission
            WHERE _id_user = ?
            AND CURRENT_DATE > mission_date
            ORDER BY mission.mission_date DESC
        `;

        const [result] = await db.query(requestSelect, [idUser]);

        return result

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.obtainStatsOnVolunteer = async (idUser) => {

    try {

        const timeDiff = `
            SELECT TIMEDIFF(mission_end_time, mission_start_time) as timeDiff FROM registration_mission
            LEFT JOIN mission 
            ON id_mission = _id_mission
            WHERE _id_user = ? AND mission_date < CURRENT_DATE;
        `;

        const [resultTimeDiff] = await db.query(timeDiff, [idUser])

        const nbrMissionAccomplished = `
            SELECT COUNT(_id_user) AS nbr
            FROM registration_mission 
            LEFT JOIN mission ON id_mission = _id_mission 
            WHERE _id_user = ? AND mission_date < CURRENT_DATE
            GROUP BY _id_user;
        `
        const [resultNbrMissionAccomplished] = await db.query(nbrMissionAccomplished, [idUser])

        return data = {
            resultTimeDiff,
            resultNbrMissionAccomplished
        }

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getMissionByRegion = async (idRegion) => {

    try {

        const request = `
            SELECT * FROM mission
            LEFT JOIN  city
                ON id_city = _id_city
            LEFT JOIN region
                ON id_region = _id_region
            WHERE id_region = ?
                AND mission_date >= CURRENT_DATE() 
                AND mission_available_place > 0                        
            LIMIT 3
        `;

        const [result] = await db.query(request, [idRegion])
        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getNbrRegistrationByMission = async (idMission) => {

    try {

        const request = `
            SELECT _id_mission, 
            COUNT(_id_user) as nbr_registration 
            FROM registration_mission 
            LEFT JOIN mission
            ON _id_mission = id_mission
            WHERE _id_mission = ?
            GROUP BY _id_mission; 
        `

        const [result] = await db.query(request, [idMission]);

        if (result.length > 0) {
            return result[0];
        }

        return false;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getStatsMissions = async () => {

    try {

        const requestList = `
            SELECT  
                m.id_mission,
                m.mission_title,
                DATE_FORMAT(m.mission_date, '%d/%m/%Y') AS mission_date,
                m.mission_start_time,
                m.mission_end_time,
                m.mission_description,
                m.mission_place_name,
                m.mission_available_place, 
                m.mission_img,
                m._id_mission_category,
                COUNT(DISTINCT r._id_user) AS nb_volunteers
            FROM mission AS m
            LEFT JOIN registration_mission AS r
                ON r._id_mission = m.id_mission
            WHERE m.mission_date >= CURRENT_DATE()
                AND m.mission_date <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY)                        
            GROUP BY 
                m.id_mission,
                m.mission_title,
                m.mission_date,
                m.mission_start_time,
                m.mission_end_time,
                m.mission_description,
                m.mission_place_name,
                m.mission_available_place, 
                m.mission_img,
                m._id_mission_category                        
            ORDER BY m.mission_date ASC
        `;

        const [resultList] = await db.query(requestList);

        const requestSumVolunteers = `
            SELECT COUNT(DISTINCT _id_user) AS total_next_30_days
            FROM registration_mission
            LEFT JOIN mission
            ON id_mission = _id_mission
            WHERE mission_date >= CURRENT_DATE()
            AND mission_date <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY)
        `;

        const [resultSumVolunteers] = await db.query(requestSumVolunteers);

        const requestTotalMissions = `
            SELECT COUNT(*) AS nbr_missions FROM mission
            WHERE mission_date >= CURRENT_DATE
            AND mission_date <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY)
        `;

        const [resultTotalMissions] = await db.query(requestTotalMissions);

        const requestSumPlaces = `
            SELECT sum(mission_available_place) AS nbr_places 
            FROM mission 
            WHERE mission_date >= CURRENT_DATE 
            AND mission_date <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY);  
        `;

        const [resultSumPlaces] = await db.query(requestSumPlaces)

        return {
            resultList,
            resultSumVolunteers,
            resultTotalMissions,
            resultSumPlaces
        }

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.searchByCategories = async (regionSelected, categorySelected, tripStart, tripEnd) => {

    let values = [];
    let params = [];

    try {

        if (regionSelected) {
            values.push("id_region = ?");
            params.push(regionSelected);
        }

        if (categorySelected) {
            values.push("id_mission_category = ?");
            params.push(categorySelected);
        }

        if (tripStart && tripEnd) {
            values.push("mission_date BETWEEN ? AND ?");
            params.push(tripStart);
            params.push(tripEnd);
        }

        if (values.length > 0) {

            const where = "WHERE " + values.join(" AND ");

            const request = `
                SELECT 
                    *, 
                    DATE_FORMAT(mission_date, '%d/%m/%Y') AS mission_date 
                FROM mission
                LEFT JOIN city
                    ON id_city = _id_city
                LEFT JOIN region
                    ON id_region = _id_region
                LEFT JOIN mission_category
                ON id_mission_category = _id_mission_category
                ${where}
                AND mission_date > CURRENT_DATE()
                ORDER BY mission_date ASC              

            `;

            const [result] = await db.query(request, params);
            return result;
        }

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getAllCategories = async () => {

    try {

        const request = `SELECT * FROM mission_category;`
        const [result] = await db.query(request);

        return result && result[0] ? result : null;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.insertMission = async (data, uploadImg) => {

    try {

        console.log("modeld", data)

        const request = `
            INSERT INTO mission (
            mission_title,
            _id_mission_category,
            mission_description,
            mission_date,
            mission_start_time,
            mission_end_time,
            _id_city,
            mission_place_name,
            mission_available_place,
            mission_img) VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(request, [
            data.title,
            data.category,
            data.description,
            data.date,
            data.startTime,
            data.endTime,
            data.cityId,
            data.placeName,
            data.spaceAvailable,
            uploadImg
        ])

        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.updateMission = async (idMission, data, imageUrl) => {
    try {

        const update = `
            UPDATE mission 
            SET mission_title = ?, mission_description = ?, mission_date = ?, mission_start_time = ?, mission_end_time = ?, mission_place_name = ?, mission_available_place = ?, mission_img = ?, _id_mission_category = ?, _id_city = ?
            WHERE id_mission = ?
        `
        await db.query(update, [data.title, data.description, data.date, data.startTime, data.endTime, data.placeName, data.spaceAvailable, imageUrl, data.category, data.cityId, idMission]);

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.searchCityInSql = async (q) => {

    try {

        const query = `SELECT * FROM city WHERE city_name LIKE ? LIMIT 20;`

        const [result] = await db.query(query, [`${q}%`]);

        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getAllRegions = async () => {

    try {

        const request = `SELECT * FROM region`;

        const [result] = await db.query(request);

        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getAllMission = async (sqlLimit) => {

    let limitCondition = "";

    if (sqlLimit) {
        limitCondition = ` LIMIT ${sqlLimit}`;
    }

    try {

        const request = `
            SELECT 
                id_mission, 
                mission_title, 
                DATE_FORMAT(mission_date, '%d/%m/%Y') AS mission_date, 
                mission_category_name,  
                city_name, 
                mission_description,
                mission_img,
                mission_available_place                
            FROM mission AS m
            LEFT JOIN city
                ON id_city = _id_city
            LEFT JOIN mission_category
                ON id_mission_category = _id_mission_category
            WHERE mission_date > CURRENT_DATE AND mission_available_place > 0
            ORDER BY m.mission_date ASC
            ${limitCondition}
        `;

        const [result] = await db.query(request);

        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getAllMissionForAdmin = async () => {

    try {

        const request = `
            SELECT 
                id_mission, 
                mission_title, 
                DATE_FORMAT(mission_date, '%d/%m/%Y') AS mission_date, 
                mission_category_name,  
                city_name, 
                mission_description,
                mission_img,
                mission_available_place                
            FROM mission AS m
            LEFT JOIN city
                ON id_city = _id_city
            LEFT JOIN mission_category
                ON id_mission_category = _id_mission_category
            WHERE mission_date > CURRENT_DATE 
            ORDER BY m.mission_date ASC
        `;

        const [result] = await db.query(request);

        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getRegistrationByUserId = async (idMission, idUser) => {

    try {

        const request = "SELECT _id_mission FROM registration_mission WHERE _id_mission = ? AND _id_user = ?";
        const [result] = await db.query(request, [idMission, idUser]);

        return result.length ? true : false;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.registerMissionUser = async (idUser, idMission) => {

    try {

        const request = 'INSERT INTO registration_mission (_id_user, _id_mission) VALUES (?, ?)';
        const [result] = await db.query(request, [idUser, idMission]);

        if (result.affectedRows !== 1) return false;

        const idUpdate = result.insertId;

        await this.updateSpaceAvailable(idUpdate, '-')

        return true;

    } catch (error) {

        throw new Error(error.message);
    }
};

exports.updateSpaceAvailable = async (idUpdate, value) => {

    try {

        if (value !== '+' && value !== '-') throw new Error;

        const update = `
            UPDATE registration_mission 
            LEFT JOIN mission ON _id_mission = id_mission 
            SET mission.mission_available_place = mission.mission_available_place ${value} 1 
            WHERE id_registration = ?;`

        const [result] = await db.query(update, [idUpdate])

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.unregisterAVolunteer = async (idRegistration) => {

    try {

        await this.updateSpaceAvailable(idRegistration, '+')

        const request = `
            DELETE FROM registration_mission
            WHERE id_registration = ?
        `
        const [result] = await db.query(request, idRegistration);

        if (result.affectedRows !== 1) return false;

        return true;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.getAllMissionsByUser = async (IdUser) => {

    try {

        const request = `
            SELECT *, DATE_FORMAT(mission_date, '%d/%m/%Y') AS mission_date, city_name 
            FROM registration_mission 
            LEFT JOIN mission
            ON id_mission = _id_mission
            LEFT JOIN city
            ON id_city = _id_city
            WHERE _id_user = ?
            AND CURRENT_DATE() < mission_date
            ORDER BY mission.mission_date ASC
        `;

        const [result] = await db.query(request, [IdUser]);

        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.alreadyRegistered = async (idUser) => {

    try {

        const request = `SELECT _id_mission FROM registration_mission WHERE _id_user = ?`;
        const [result] = await db.query(request, [idUser]);
        return result;

    } catch (error) {

        throw new Error(error.message);
    }
}

exports.fetchImgByCategory = async (category) => {

    try {

        const fetchImg = `SELECT id_mission_image, mission_image_url FROM mission_image WHERE _id_mission_category = ?`;
        const [result] = await db.query(fetchImg, [category]);
        return result;

    } catch (error) {

       throw new Error(error.message);
    }
}

exports.getDataMissionById = async (idMission) => {

    try {

        const request = `
            SELECT * FROM mission 
            LEFT JOIN city
            ON _id_city = id_city
            LEFT JOIN mission_category
            ON _id_mission_category = id_mission_category
            WHERE id_mission = ?;
        `
        const [result] = await db.query(request, idMission);

        return result[0];

    } catch (error) {

        throw new Error(error.message);
    }
}