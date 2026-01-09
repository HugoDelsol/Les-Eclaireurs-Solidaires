const { body, validationResult } = require('express-validator');

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
        .isEmail(),


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
                alertMsg: message,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password:"",
                passwordConfirm: "",
            })
        }

        next();
    }
];

const signInFormProtection = [

    body('email').trim().isEmail().normalizeEmail(),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
            return res.render('connection/signIn', {
                alertMsg: 'Données invalides. Veuillez vérifier les champs.'
            })
        }

        next();
    }
]

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
                alertMsg: 'Données invalides. Veuillez vérifier les champs.'
            })
        }

        next();
    }
]

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
            return res.render('account/userProfileSettings', {
                pseudoUser: req.session.userExist.firstName,
                categoriesMission: req.session.categoriesMission,
                alertMsg: 'Données invalides. Veuillez vérifier les champs.'
            })
        }

        next();
    }
]

module.exports = {
    signUpFormProtection,
    signInFormProtection,
    updateUserProfile,
    adminSignFormProtection,
};
