<?php
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
