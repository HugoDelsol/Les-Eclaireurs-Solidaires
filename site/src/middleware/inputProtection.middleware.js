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


    // AMELIORATION PASSWORD REQUISE AVANT DEPLOIEMENT
    body('password'),

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

    body('firstName').trim().escape(),
    body('lastName').trim().escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('password'),
    body('token').trim().escape(),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.render('connection/signUpAdmin', {
                errorAlertMsg: 'Données invalides. Veuillez vérifier les champs.'
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

    body("title").trim().escape(),
    body("category").trim().isInt().toInt(),
    body("description").trim().isLength({ min: 2, max: 2000 }).withMessage("La description doit contenir entre 2 et 2000 caractères").escape(),
    body("date").trim().isDate(),
    body("startTime").trim().matches(/^[0-9:]+$/),
    body("endTime").trim().matches(/^[0-9:]+$/),
    body("city").trim().isLength({ min: 1, max: 200 }).escape(),
    body("cityId").trim().isInt().toInt(),
    body("placeName").trim().isLength({ min: 1, max: 500 }).escape(),
    body("spaceAvailable").trim().isInt().toInt(),
    body("uploadImg").trim().escape(),

    (req, res, next) => {

        const error = validationResult(req); 

        if (!error.isEmpty()) {

            res.locals.errorAlertMsg = error.array()[0].msg;
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
};
