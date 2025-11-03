const homeModel = require('../models/HomeModel')

//--- VIEWS ---//

exports.homePage = async (req, res) => {

    res.render('home/homePage')
}

exports.becomeVolunteer = async (req, res) => {

    res.render('home/becomeVolunteer')
}

//------------------//

exports.submitForm = async (req, res) => {

    try {

        const nameForm = req.body.nameForm;
        const emailForm = req.body.emailForm;
        const txtArea = req.body.txtArea;

        const result = await homeModel.addMessageForm(nameForm, emailForm, txtArea);

        //console.log('---->', result[0].insertId)

    } catch (error) {
        
        res.render('home/homePage', {
            //////////////////////////////AlertMsg: "Le formulaire n'a pas pus etre soumis"
        })

        console.log('--->', error);

    }

}


/*<?php

class HomeController
{

    public $db;
    public $messageFormModel;
    public $alertError = "";
    public $alertSuccess = "";
    public $generalStyle = "";
    public $styles = [];
    public $scripts = [];

    public function __construct($db)
    {
        $this->db = $db;
        $this->messageFormModel = new MessageFormModel($db);
    }

    public function manage()
    {

        $action = filter_input(INPUT_GET, "action");

        if ($action === "signIn") {
            $this->showSignIn();
        } else if ($action === "submitForm") {
            $this->submitForm();
        } else if ($action === "showBecomeVolunteers") {
            $this->showBecomeVolunteers();
        } else {
            $this->showHomePage();
        } 
    }

    public function showSignIn() {}

    public function showHomePage()
    {
        
        $this->scripts = [
            "homePage"
        ];
        $this->styles = [
            "home/styleV3",
            "home/header"
        ];
        require_once "src/frontend/views/home/homePage.php";
    }

    public function showBecomeVolunteers()
    {
        $this->styles = [
            "home/footer",
            "home/header",
            "home/styleBecomeVolunteer"
        ];

        $this->scripts = [
            "becomeVolunteer",
            "homePage"
        ];
        require_once "src/frontend/views/home/becomeVolunteer.php";
    }

    
}

*/
