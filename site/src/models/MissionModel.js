const db = require('../config/database');

exports.getAllCategories = async () => {

    try {

        const request = `SELECT * FROM mission_category`;
        const [result] = await db.query(request);

        return result && result[0] ? result : null;

    } catch (e) {

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

    const request = `SELECT * FROM region`;

    const [result] = await db.query(request);

    return result;
}

exports.getAllMission = async () => {

    const request = `SELECT id_mission, mission_title, DATE_FORMAT(mission_date, '%e/%m/%Y') AS mission_date, mission_category_name,  city_name                 
                    FROM mission
                    LEFT JOIN city
                    ON id_city = _id_city
                    LEFT JOIN mission_category
                    ON id_mission_category = _id_mission_category`
    ;

    const [result] = await db.query(request);

    return result;
}

exports.registerMissionUser = async (idUser , idMission) => {
    const request = 'INSERT INTO registration_mission (_id_user, _id_mission) VALUES (?, ?)'
    await db.query(request,[idUser, idMission]);
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
