const missionModel = require('../models/MissionModel');

// --- --- --- --- ---

exports.addMissionShow = async (req, res) => {

    try {

        let allCategories = await missionModel.getAllCategories();

        let allTab = [];

        for (let category of allCategories) {

            objCategory = {
                categoryId: category.id_mission_category,
                categoryName: category.mission_category_name
            }

            allTab.push(objCategory);
        }

        req.session.categoriesMission = allTab;

        res.render('account/addMission', {
            alertMsg: null,
            pseudoUser: req.session.userExist.firstName,
            categoriesMission: req.session.categoriesMission,
        })

    } catch (error) {

        console.error(error);

    }

}

// --- --- --- --- ---

exports.addMission = async (req, res) => {

    try {

        const title = req.body.title;
        const category = req.body.category;
        const description = req.body.description;
        const date = req.body.date;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const cityId = req.body.cityId;
        const placeName = req.body.placeName;
        const spaceAvailable = req.body.spaceAvailable;
        const uploadImg = req.body.uploadImg;

        if (
            !req.body.title ||
            !req.body.category ||
            !req.body.description ||
            !req.body.date ||
            !req.body.startTime ||
            !req.body.endTime ||
            !req.body.cityId ||
            !req.body.placeName ||
            !req.body.spaceAvailable ||
            !req.body.uploadImg) {

            throw new Error("Veuillez remplir tous les champs.");
        }

        console.log("***", req.body.cityId);

        const insertMission = await missionModel.insertMission
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
                uploadImg
            );

        if (insertMission) {

            res.render('account/dashboardAdmin', {
                pseudoUser: req.session.userExist.firstName,
                alertMsg: 'Missions ajoutée',

            })

            console.log("Insertion MISSION BDD OK");
        }

    } catch (error) {

        res.render('account/addMission', {

            pseudoUser: req.session.userExist.firstName,            
            categoriesMission: req.session.categoriesMission,
            alertMsg: 'Veuillez remplir tous les champs.',

        })

        console.log(error);
    }
}

// --- --- --- --- ---

exports.searchCity = async (req, res) => {

    const valueInput = req.query.q

    const searchCity = await missionModel.searchCityInSql(valueInput);

    let allCitys = []

    for (c of searchCity) {

        const data = {
            idCity: c.id_city,
            cityName: c.city_name,
            idRegion: c._id_region,
        }

        allCitys.push(data);

    }

    res.json(allCitys)
}



















/*

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

*/
