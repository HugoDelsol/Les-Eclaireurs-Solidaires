//--- VIEWS ---//

exports.homePage = async  (req, res) => {

    res.render('home/homePage')
}

exports.becomeVolunteer = async (req, res) => {

    res.render('home/becomeVolunteer')
}


//------------------//

















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

    public function submitForm()
    {

        $data = json_decode(file_get_contents("php://input"), true);

        var_dump($data);

        if (!$data || !isset($data['nameForm'])) {
            http_response_code(400);
            echo json_encode(["error" => "Données invalides"]);
            return;
        }

        $nameForm = htmlspecialchars($data['nameForm'], ENT_QUOTES, 'UTF-8') ;
        $emailForm = htmlspecialchars($data['emailForm'],ENT_QUOTES, 'UTF-8') ;
        $txtAreaForm = htmlspecialchars($data['txtArea'], ENT_QUOTES, 'UTF-8') ;

        $this->messageFormModel->addMessageForm($nameForm, $emailForm, $txtAreaForm);
    }
}

*/
