const db = require('../config/database');

exports.addUserHistoryMission = async (idUser) => {

    try {

        console.log("coucou")
        
        const request = `SELECT * FROM registration_mission
                        LEFT JOIN mission 
                        ON id_mission = _id_mission
                        WHERE _id_user = ?
                        AND CURRENT_DATE > mission_date;` 

        const [result] = await db.query(request, [idUser]);

        console.log(result)

    } catch (error) {
        
    }
}

exports.getMissionByRegion = async (idRegion) => {

    try {

        const request = `SELECT * FROM mission
                        LEFT JOIN  city
                            ON id_city = _id_city
                        LEFT JOIN region
                            ON id_region = _id_region
                        WHERE id_region = ?
                            AND mission_date >= CURRENT_DATE()                        
                        LIMIT 3`

        const [result] = await db.query(request, [idRegion])
        return result;

    } catch (error) {

        console.error("Erreur SQL getMissionByRegion :", error);
        throw error;
    }
}

exports.getStatsMissions = async () => {

    try {

        const requestList = `SELECT  
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
                            ORDER BY m.mission_date ASC;`

        const [resultList] = await db.query(requestList);

        const requestSumVolunteers = `SELECT COUNT(DISTINCT _id_user) AS total_next_30_days
                                        FROM registration_mission
                                        LEFT JOIN mission
                                        ON id_mission = _id_mission
                                        WHERE mission_date >= CURRENT_DATE()
                                        AND mission_date <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY);`

        const [resultSumVolunteers] = await db.query(requestSumVolunteers);

        const requestTotalMissions = `SELECT COUNT(*) AS nbr_missions FROM mission
                                        WHERE mission_date >= CURRENT_DATE
                                        AND mission_date <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY);`

        const [resultTotalMissions] = await db.query(requestTotalMissions);

        return {
            resultList,
            resultSumVolunteers,
            resultTotalMissions
        }

    } catch (error) {

        console.error("Erreur SQL getStatsMissions :", error);
        throw error;
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

            const request = `SELECT 
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
                            AND mission_date >= CURRENT_DATE();`

            const [result] = await db.query(request, params);
            return result;
        }

    } catch (error) {

        console.error("Erreur SQL searchByCategories :", error);
        throw error;
    }
}

exports.getAllCategories = async () => {

    try {

        const request = `SELECT * FROM mission_category;`
        const [result] = await db.query(request);

        return result && result[0] ? result : null;

    } catch (e) {

        console.error("Erreur SQL getAllCategories :", e);
        throw e;
    }
}

exports.insertMission = async (
    title,
    category,
    description,
    date,
    startTime,
    endTime,
    city,
    placeName,
    spaceAvailable,
    uploadImg

) => {

    try {

        const request = `INSERT INTO mission (
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
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

        const [result] = await db.query(request, [
            title,
            category,
            description,
            date,
            startTime,
            endTime,
            city,
            placeName,
            spaceAvailable,
            uploadImg
        ])

        return result;

    } catch (error) {

        throw error;
    }

}

exports.searchCityInSql = async (q) => {

    try {

        const query = `SELECT * FROM city WHERE city_name LIKE ? LIMIT 20;`

        const [result] = await db.query(query, [`${q}%`]);

        return result;

    } catch (error) {

        throw error;
    }
}

exports.getAllRegions = async () => {
    try {

        const request = `SELECT * FROM region`;

        const [result] = await db.query(request);

        return result;

    } catch (error) {
        console.error("Erreur SQL getAllRegions :", error);
        throw error;
    }

}

exports.getAllMission = async () => {

    try {

        const request = `SELECT 
                            id_mission, 
                            mission_title, 
                            DATE_FORMAT(mission_date, '%d/%m/%Y') AS mission_date, 
                            mission_category_name,  
                            city_name, 
                            mission_description                 
                        FROM mission AS m
                        LEFT JOIN city
                            ON id_city = _id_city
                        LEFT JOIN mission_category
                            ON id_mission_category = _id_mission_category
                        WHERE mission_date >= CURRENT_DATE
                        ORDER BY m.mission_date ASC;`

        const [result] = await db.query(request);

        return result;

    } catch (error) {

        console.error("Erreur SQL getAllMission :", error);

        throw error;
    }
}

exports.registerMissionUser = async (idUser, idMission) => {

    try {

        const request = 'INSERT INTO registration_mission (_id_user, _id_mission) VALUES (?, ?)';
        await db.query(request, [idUser, idMission]);

    } catch (error) {

        console.error("Erreur SQL registerMissionUser :", error);
        throw error;
    }
};

exports.getRegistrationByUserId = async (idMission, idUser) => {

    try {

        const request = "SELECT _id_mission FROM registration_mission WHERE _id_mission = ? AND _id_user = ?";
        const [result] = await db.query(request, [idMission, idUser]);

        console.log("=======", result);

        console.log(idMission, idUser);

        return result.length ? true : false;

    } catch (error) {

        console.error("Erreur SQL getRegistrationByUserId :", error);
        throw error;
    }
}

exports.getAllMissionsByUser = async (IdUser) => {

    try {

        const request = `SELECT mission_title, DATE_FORMAT(mission_date, '%e/%m/%Y') AS mission_date, city_name 
                        FROM registration_mission 
                        LEFT JOIN mission
                        ON id_mission = _id_mission
                        LEFT JOIN city
                        ON id_city = _id_city
                        WHERE _id_user = ?`;
        const [result] = await db.query(request, [IdUser]);

        return result;

    } catch (error) {

        throw error;
    }
}

exports.alreadyRegistered = async (idUser) => {
    try {

        const request = `SELECT _id_mission FROM registration_mission WHERE _id_user = ?`;
        const [result] = await db.query(request, [idUser]);
        return result;

    } catch (error) {

        throw error;
    }

}


/*<?php
class MissionModel
{

    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function getAllCategories()
    {
        try {

            $request = $this->db->query("SELECT * FROM mission_category");
            $response = $request->fetchAll(PDO::FETCH_ASSOC);
            return $response;
        } catch (PDOException $e) {

            var_dump("ERROR SQL / " . $e->getMessage());
        }
    }

    public function addMission(
        $title,
        $category,
        $description,
        $date,
        $startTime,
        $endTime,
        $city,
        $placeName,
        $spaceAvailable,
        $uploadImg
    ) {
        
        try {

            $request = $this->db->prepare(
                "INSERT INTO mission 
                (
                    mission_title,
                    _id_mission_category,
                    mission_description,
                    mission_date,
                    mission_start_time,
                    mission_end_time,
                    _id_city,
                    mission_place_name,
                    mission_available_place,
                    mission_img
                    
                ) VALUES (?,?,?,?,?,?,?,?,?,?)"
            );

            $request->execute([
                $title,
                $category,
                $description,
                $date,
                $startTime,
                $endTime,
                $city,
                $placeName,
                $spaceAvailable,
                $uploadImg
            ]);
        } catch (PDOException $e) {

            var_dump("ERROR SQL / " . $e->getMessage());
        }
    }
}
    */
