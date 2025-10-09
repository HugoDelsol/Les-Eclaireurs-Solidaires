<?php

class MissionController
{

    public $db;
    public $missionModel;
    public $alertSuccess = null;
    public $alertError = null;
    public $styles = [];
    public $scripts = [];
    public $categories;

    public function __construct($db)
    {
        $this->db = $db;
        $this->missionModel = new MissionModel($db);
    }

    public function manage()
    {
        $action = filter_input(INPUT_GET, "action");

        if ($action === "addMissionShow") {
            $this->addMissionShow();
        } else if ($action === "addMission") {
            $this->addMission();
        }
    }

    public function addMissionShow()
    {
        $this->styles = [
            "account/styleSideNav",
            "account/styleAddMission"
        ];

        $this->categories = $this->missionModel->getAllCategories();
        require_once 'src/frontend/views/account/addMission.php';
    }

    public function addMission()
    {
        $this->categories = $this->missionModel->getAllCategories();

        if (isset($_POST["title"])) {

            if (
                empty($_POST["title"]) ||
                empty($_POST["category"]) ||
                empty($_POST["description"]) ||
                empty($_POST["date"]) ||
                empty($_POST["startTime"]) ||
                empty($_POST["endTime"]) ||
                empty($_POST["city"]) ||
                empty($_POST["placeName"]) ||
                empty($_POST["spaceAvailable"]) ||
                empty($_POST["uploadImg"])
            ) {                
                $this->alertError = "Veuilliez renseigner tout les champs";
                $this->addMissionShow();
            } else {
                $this->missionModel->addMission(
                    $_POST["title"],
                    $_POST["category"],
                    $_POST["description"],
                    $_POST["date"],
                    $_POST["startTime"],
                    $_POST["endTime"],
                    $_POST["city"],
                    $_POST["placeName"],
                    $_POST["spaceAvailable"],
                    $_POST["uploadImg"]
                );
                
            }
        }
    }
}
