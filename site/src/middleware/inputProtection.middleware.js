// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

const { body, validationResult } = require('express-validator');

// ==============================
// REGISTRATION FORM PROTECTION
// ==============================

const signUpFormProtection = [

    body('firstName')
        .trim()
        .notEmpty().withMessage('Le prénom est requis')
        .isLength({ min: 2, max: 30 }).withMessage('Le prénom doit faire entre 2 et 30 caractères')
        .escape(),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2, max: 30 }).withMessage('Le nom doit faire entre 2 et 30 caractères')
        .escape(),

    body('email')
        .trim()
        .notEmpty().withMessage('Lemail est requis')
        .isEmail().withMessage('Veuillez saisir une adresse email valide.')
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({min: 8}).withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'),

    body('passwordConfirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Les mots de passe ne correspondent pas');
            }
            return true;
        }),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const message = errors.array()[0].msg

            return res.render('connection/signUp', {
                errorAlertMsg: message,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: "",
                passwordConfirm: "",
            })
        }

        next();
    }
];

// ==============================
// LOGIN FORM PROTECTION
// ==============================

const signInFormProtection = [

    body('email')
        .trim()
        .isEmail()
        .withMessage("L'email renseigné n'est pas valide")
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage("Veuillez saisir votre mot de passe"),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {

            const message = error.array()[0].msg

            return res.render('connection/signIn', {
                errorAlertMsg: message
            })
        }

        next();
    }
]

// ==============================
// PROTECTION REGISTRATION ADMIN FORM 
// ==============================

const adminSignFormProtection = [

  body('firstName')
        .trim()
        .notEmpty().withMessage('Le prénom est requis')
        .isLength({ min: 2, max: 30 }).withMessage('Le prénom doit faire entre 2 et 30 caractères')
        .escape(),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Le nom est requis')
        .isLength({ min: 2, max: 30 }).withMessage('Le nom doit faire entre 2 et 30 caractères')
        .escape(),

    body('email')
        .trim()
        .notEmpty().withMessage('Lemail est requis')
        .isEmail().withMessage('Veuillez saisir une adresse email valide.')
        .normalizeEmail(),

    body('password')
        .trim()
        .isLength({min: 8}).withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial'),

    body('token')
        .trim()
        .escape(),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.render('connection/signUpAdmin', {
                errorAlertMsg: error.array()[0].msg,
            })
        }

        next();
    }
]

// ==============================
// PROTECTION INPUT IN THE PROFILE EDIT FORM
// ==============================

const updateUserProfile = [

    body('lastname').optional({ checkFalsy: true }).trim().escape(),
    body('firstname').optional({ checkFalsy: true }).trim().escape(),
    body('phone').optional({ checkFalsy: true }).trim().isMobilePhone().escape(),
    body('adress').optional({ checkFalsy: true }).trim().escape(),
    body('cityId').optional({ checkFalsy: true }).isInt(),
    body('category').optional({ checkFalsy: true }).isInt(),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.render('account/volunteer/userProfileSettings', {
                pseudoUser: req.session.userExist.firstName,
                categoriesMission: req.session.categoriesMission,
                errorAlertMsg: 'Données invalides. Veuillez vérifier les champs.'
            })
        }

        next();
    }
]

// ==============================
// PROTECTION INPUT IN THE HOME PAGE
// ==============================

const homeFormProtection = [

    body('nameForm').toLowerCase().trim().escape(),
    body('emailForm').trim().isEmail().normalizeEmail(),
    body('txtArea').trim().escape(),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.json({ mdlError: "Données invalides. Veuillez vérifier les champs.", mdlErrorIsTrue: true });
        }

        next();
    }
]

// ==============================
// PROTECTION INPUT IN THE GENERATE TOKEN PAGE
// ==============================

const generateTokenInputProtection = [

    body('emailTokenAdmin').optional().trim().isEmail().normalizeEmail(),
    body('emailTokenSuper').optional().trim().isEmail().normalizeEmail(),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            res.locals.errorAlertMsg = "L'email renseigner n'est pas valide"
        }

        next()
    }
]


const manageMissionInputProtection = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Le titre est obligatoire")
        .escape(),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("La catégorie est obligatoire")
        .isInt()
        .withMessage("La catégorie doit être un nombre entier")
        .toInt(),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("La description est obligatoire")
        .isLength({ min: 2, max: 2000 })
        .withMessage("La description doit contenir entre 2 et 2000 caractères")
        .escape(),

    body("date")
        .trim()
        .notEmpty()
        .withMessage("La date est obligatoire")
        .isDate()
        .withMessage("La date doit être valide"),

    body("startTime")
        .trim()
        .notEmpty()
        .withMessage("L'heure de début est obligatoire")
        .matches(/^[0-9:]+$/)
        .withMessage("L'heure de début doit être au format valide"),

    body("endTime")
        .trim()
        .notEmpty()
        .withMessage("L'heure de fin est obligatoire")
        .matches(/^[0-9:]+$/)
        .withMessage("L'heure de fin doit être au format valide"),

    body("city")
        .trim()
        .escape(),

    body("cityId")
        .trim()
        .notEmpty()
        .withMessage("Vous n'avez pas sélectionné une ville valide")
        .isInt()
        .toInt()
        .withMessage("Vous n'avez pas sélectionné une ville valide"),

    body("placeName")
        .trim()
        .notEmpty()
        .withMessage("Le nom du lieu est obligatoire")
        .isLength({ min: 1, max: 500 })
        .withMessage("Le nom du lieu doit contenir entre 1 et 500 caractères")
        .escape(),

    body("spaceAvailable")
        .trim()
        .notEmpty()
        .withMessage("Le nombre de places est obligatoire")
        .isInt()
        .withMessage("Le nombre de places doit être un entier")
        .toInt(),

    body("uploadImg")
        .trim()
        .escape(),

    (req, res, next) => {
        
        const error = validationResult(req);

        if (!error.isEmpty()) {

            res.locals.errorAlertMsg = error.array()[0].msg;
        }

        next();
    }
]

const userOpinionInputProtection = [

    body('textContent')
        .trim()
        .isLength({ min: 20, max: 500 })
        .withMessage('Votre avis doit contenir entre 20 et 500 caractères.')
        .escape(),
        
    (req, res, next) => {

        console.log(req.body)

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.json({ mdlError: error.array()[0].msg, mdlErrorIsTrue: true });
        }

        next();
    }
]

module.exports = {
    signUpFormProtection,
    signInFormProtection,
    updateUserProfile,
    adminSignFormProtection,
    homeFormProtection,
    generateTokenInputProtection,
    manageMissionInputProtection,
    userOpinionInputProtection
};
