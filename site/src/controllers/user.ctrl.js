const userModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const service = require('../service/generateToken');
const { getAllMissionsByUser } = require('./mission.ctrl.get');
const { getStatsMissions } = require('./mission.ctrl.get');

// --- VIEWS ---


exports.signIn = async (req, res) => {
    res.render('connection/signIn');
}

exports.signUp = async (req, res) => {
    res.render('connection/signUp', {
        firstName: null
    });
}

exports.signUpAdminForm = async (req, res) => {
    res.render('connection/signUpAdmin');
}

exports.dashboardAdmin = async (req, res) => {
    getStatsMissions(req, res);
}

exports.dashboardUser = async (req, res) => {
    const idUser = req.session.userExist.id;
    getAllMissionsByUser(req, res, idUser);
}

exports.tokenView = async (req, res) => {

    const admins = await userModel.getAllAdmins();

    req.session.userExist.admins = admins.resultAdmins;
    req.session.userExist.superAdmins = admins.resultSuperAdmins;

    res.render('account/generateToken', {
        admins: admins.resultAdmins,
        superAdmins: admins.resultSuperAdmins,
    });
}

exports.listOfVolunteers = async (req,res) => {

    console.log("coucou")

    res.render('account/listOfVolunteers');
}

// --- --- ---


exports.generateToken = async (req, res) => {

    let generateTokenSuper;
    let generateTokenAdmin;

    try {

        const emailTokenSuper = req.body.emailTokenSuper;
        const emailTokenAdmin = req.body.emailTokenAdmin;

        if (req.body.emailTokenSuper) {

            generateTokenSuper = service.generateToken(emailTokenSuper, "superAdmin");

        } else if (req.body.emailTokenAdmin) {

            generateTokenAdmin = service.generateToken(emailTokenAdmin, "admin");
        } 

        res.render('account/generateToken', {
            tokenAdmin: generateTokenAdmin,
            tokenSuper: generateTokenSuper,
            admins: req.session.userExist.admins,
            superAdmins: req.session.userExist.superAdmins,
        })

    } catch (error) {

        console.log(error)
    }
}

exports.saveAdmin = async (req, res) => {

    try {

        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let password = req.body.password;
        let token = req.body.token;


        if (!req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.password ||
            !req.body.passwordConfirm ||
            !req.body.token) {

            throw new Error('Merci de compléter tous les champs');
        }

        let userExist = await userModel.getOneUserByEmail(email);

        if (userExist) {
            throw new Error("Un utilisateur utilise deja cette email");
        }

        const tokenRole = service.verifyToken(token, email);

        if (!tokenRole) throw new Error("Le token ou email est invalide")

        if (tokenRole === "superAdmin") {

            console.log("superAdmin")

            const idAdminRole = 1;

            const saveAdmin = await userModel.addAdmin(
                firstName,
                lastName,
                email,
                password,
                idAdminRole,
            )

            if (saveAdmin) {
                res.render('connection/signIn', {
                    alertMsg: "Veuillez vous connecter pour accéder à votre compte."
                });
            }

        } else if (tokenRole === "admin") {

            console.log("admin")

            const idAdminRole = 2;

            const saveAdmin = await userModel.addAdmin(
                firstName,
                lastName,
                email,
                password,
                idAdminRole,
            )

            if (saveAdmin) {
                res.render('connection/signIn', {
                    alertMsg: "Veuillez vous connecter pour accéder à votre compte."
                });
            }

        }

    } catch (error) {

        res.render('connection/signUpAdmin', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            alertMsg: error.message
        });
    }
}

exports.saveUser = async (req, res) => {

    try {

        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let password = req.body.password;
        let passwordConfirm = req.body.passwordConfirm;

        if (!req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.password ||
            !req.body.passwordConfirm) {

            throw new Error('Merci de compléter tous les champs');
        }

        if (password !== passwordConfirm) {
            throw new Error('Les mots de passe ne sont pas identiques')
        }

        let userExist = await userModel.getOneUserByEmail(email);

        if (userExist) {

            throw new Error("Un utilisateur utilise deja cette email");
        }

        const saveUser = await userModel.addUser(
            firstName,
            lastName,
            email,
            password,
        )

        if (saveUser) {
            res.render('connection/signIn', {
                alertMsg: "Veuillez vous connecter pour accéder à votre compte."
            });
        }

    } catch (error) {

        //console.log(error.message)

        res.render('connection/signUp', {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            alertMsg: error.message
        });
    }
}

exports.auth = async (req, res) => {

    try {

        let email = req.body.email;
        let password = req.body.password;

        if (!req.body.email || !req.body.password) {

            throw new Error('Merci de compléter tous les champs');
        }

        const userExist = await exports.verifyAccountExist(email, password);

        if (!userExist) {
            throw new Error("Email ou mot de passe incorrect.");
        }

        if (userExist.role === 'admin') {

            if (userExist._id_admin_role === 1) {

                req.session.userExist = {
                    id: userExist.id_admin,
                    firstName: userExist.admin_first_name,
                    isSuperAdmin: true
                }

                getStatsMissions(req, res);

            } else if (userExist._id_admin_role === 2) {

                req.session.userExist = {
                    id: userExist.id_admin,
                    firstName: userExist.admin_first_name,
                    isAdmin: true
                }

                getStatsMissions(req, res);
            }

        } else if (userExist.role === 'user') {

            req.session.userExist = {
                id: userExist.id_user,
                firstName: userExist.user_first_name,
                isAdmin: false
            }

            const idUser = req.session.userExist.id;

            getAllMissionsByUser(req, res, idUser);

        }

    } catch (error) {

        console.error(error)

        res.render('connection/signIn', {
            alertMsg: error.message
        });
    }
}

exports.verifyAccountExist = async (email, password) => {

    try {

        const userMail = await userModel.getOneUserByEmail(email);

        if (userMail && await bcrypt.compare(password, userMail.identifier_password)) {

            if (userMail.id_user) {

                userMail['role'] = 'user';

            } else if (userMail.id_admin) {

                userMail['role'] = 'admin';
            }

            return userMail;

        } else {

            return false;
        }

    } catch (e) {

        console.error(e);

    }
}


/*<?php

class UserController
{
    public $db;
    public $userModel;
    public $alertSuccess = null;
    public $alertError = null;
    public $generalStyle = "";
    public $styles = [];
    public $scripts = [];
    public $adminToken = null;

    public function __construct($db)
    {
        $this->db = $db;
        $this->userModel = new UserModel($db);
        $this->adminToken = "s8i45/gn**UpA^dm68/-inSh¨§/;ow62";
    }

    public function manage()
    {

        $action = filter_input(INPUT_GET, "action");
        $token = filter_input(INPUT_GET, "token");

        if ($action === "signInShow") {
            $this->signInShow();
        } else if ($action === "signUpShow") {
            $this->signUpShow();
        } else if ($action === "signIn") {
            $this->signIn();
        } else if ($action === "signUp") {
            $this->signUp();
        } else if ($action === "logout") {
            $this->sessionLogout();
        } else if ($action === "adminInvite") {
            if ($token === $this->adminToken) {
                $this->signUpAdmindShow();
            }
        } else if ($action === "signUpAdmin") {
            $this->signUpAdmin();
        } else if ($action === "dashboardAdminShow") {
            $this->dashboardAdminShow();
        } else {
            $this->forbiddenShow();
        }
    }

    //VIEWS PAGES 

    public function dashboardAdminShow()
    {
        $this->styles = [
            
            "account/styleSideNav"
        ];
        require_once "src/frontend/views/account/dashboardAdmin.php";
    }

    public function forbiddenShow()
    {
        require_once "src/frontend/views/home/404.php";
    }

    public function signUpAdmindShow()
    {
        $this->scripts = [
            "login"
        ];
        $this->styles = [
            "home/header",
            "connection/styleRegister"
        ];
        require_once "src/frontend/views/admin/signUpAdmin.php";
    }

    public function signInShow()
    {
        $this->scripts = [
            "login"
        ];
        $this->styles = [
            "home/header",
            "connection/styleLogin"
        ];
        require_once "src/frontend/views/connection/signIn.php";
    }

    public function signUpShow()
    {
        $this->scripts = [
            "login"
        ];
        $this->styles = [
            "home/header",
            "connection/styleRegister"
        ];
        require_once "src/frontend/views/connection/signUp.php";
    }

    //METHODS

    public function signUp()
    {
        if (isset($_POST["email"])) {

            if (
                empty($_POST["firstName"])  ||
                empty($_POST["lastName"])   ||
                empty($_POST["email"])      ||
                empty($_POST["password"])   ||
                empty($_POST["passwordConfirm"])
            ) {

                $this->alertError = 'Veuillez remplir tout les champs';
            } else if ($_POST["password"] !== $_POST["passwordConfirm"]) {

                $this->alertError = "Les mots de passe ne sont pas similaires";
            } else {

                $userEmail = $this->userModel->getUserByEmail($_POST["email"]);

                if ($userEmail) {

                    $this->alertError = 'Un utilisateur utilise deja cett email';
                } else {

                    $pswrdHash = password_hash($_POST["passwordConfirm"], PASSWORD_DEFAULT);

                    $this->userModel->addUser($_POST['firstName'], $_POST['lastName'], $_POST["email"], $pswrdHash);

                    $_SESSION["user"] = [
                        "firstName" => $_POST['firstName'],
                        "lastName" => $_POST['lastName']
                    ];

                    header("Location: index.php?page=user&action=signInShow");
                    exit();
                    //var_dump($_SESSION);
                }
            }
        }

        $this->signUpShow();
    }

    public function signUpAdmin()
    {
        // EMAIL ADMIN index.php?page=user&action=adminInvite&token=s8i45/gn**UpA^dm68/-inSh¨§/;ow62

        if (isset($_POST['firstName'])) {

            if (
                empty($_POST['firstName']) ||
                empty($_POST['lastName']) ||
                empty($_POST['email']) ||
                empty($_POST['password']) ||
                empty($_POST['passwordConfirm'])
            ) {

                $this->alertError = "Veuilliez renseigner tout les champs";
            } else {

                $adminEmail = $this->userModel->getAdminByEmail($_POST["email"]);

                if ($adminEmail) {

                    $this->alertError = "Un utilisateur utilise deja cett email";
                } else {

                    $pswrdHashAdmin = password_hash($_POST['passwordConfirm'], PASSWORD_DEFAULT);

                    $this->userModel->addAdmin($_POST['firstName'], $_POST['lastName'], $_POST['email'], $pswrdHashAdmin);

                    $_SESSION["admin"] = [
                        "firstName" => $_POST['firstName'],
                        "lastName" => $_POST['lastName']
                    ];

                    $this->dashboardAdminShow();
                    exit();
                }
            }
        }

        $this->signUpAdmindShow();
    }

    public function signIn()
    {
        if (isset($_POST["email"])) {

            if (
                empty($_POST["email"]) ||
                empty($_POST["password"])
            ) {

                $this->alertError = "Veuilliez renseignez tous les champs.";
            } else {

                $typeAccount = $this->verifyAccountExist($_POST['email'], $_POST["password"]);
                //var_dump($typeAccount);

                if ($typeAccount) {

                    if ($typeAccount['role'] === 'admin') {

                        unset($_SESSION['user']);

                        $_SESSION['admin'] = [

                            'firstName' => $typeAccount["admin_first_name"],
                            'lastName' => $typeAccount["admin_last_name"],
                            'userMail' => $typeAccount["identifier_mail"]
                        ];

                        $this->dashboardAdminShow();
                        exit();
                    } else if ($typeAccount['role'] === "user") {

                        unset($_SESSION['admin']);

                        $_SESSION['user'] = [

                            'firstName' => $typeAccount["user_first_name"],
                            'lastName' => $typeAccount["user_last_name"],
                            'userMail' => $typeAccount["identifier_mail"]
                        ];

                        header('Location: index.php');
                        exit();
                    }
                } else {
                    $this->alertError = "L'Email ou mot de passe est incorrect";
                }
            }
        }

        $this->signInShow();
    }

    public function verifyAccountExist($mail, $password)
    {
        $userMailSignIn = $this->userModel->getUserByEmail($mail);

        if ($userMailSignIn && password_verify($password, $userMailSignIn['identifier_password'])) {

            if (!empty($userMailSignIn['id_user'])) {

                $userMailSignIn['role'] = "user";
            } else if (!empty($userMailSignIn['id_admin'])) {

                $userMailSignIn['role'] = "admin";
            }

            return $userMailSignIn;
        } else {

            return false;
        }
    }

    //LOGOUT

    public function sessionLogout()
    {
        $_SESSION = [];
        session_destroy();
        header('Location: index.php');
        exit();
    }
}
*/
