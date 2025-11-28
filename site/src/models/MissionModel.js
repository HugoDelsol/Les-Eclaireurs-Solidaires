const db = require('../config/database');

exports.getAllCategories = async () => {

    try {

        const request = `SELECT * FROM mission_category`;
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
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

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

        const query = `SELECT * FROM city WHERE city_name LIKE ? LIMIT 20`;

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

        const request = `SELECT id_mission, mission_title, DATE_FORMAT(mission_date, '%e/%m/%Y') AS mission_date, mission_category_name,  city_name                 
                    FROM mission
                    LEFT JOIN city
                    ON id_city = _id_city
                    LEFT JOIN mission_category
                    ON id_mission_category = _id_mission_category`
            ;

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

        console.log("defeffef", result);

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
                        ON id_city = _id_mission
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
