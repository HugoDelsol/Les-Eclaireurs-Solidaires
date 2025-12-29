const { body, validationResult } = require('express-validator');

const signUpFormProtection = [

    body('firstName').trim().escape(),
    body('lastName').trim().escape(),
    body('email').trim().isEmail().normalizeEmail(),
    
    (req, res, next) => {        

        const error = validationResult(req);

        if (!error.isEmpty()) {

            return res.render('connection/signUp', {
                alertMsg: 'Données invalides. Veuillez vérifier les champs.'
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

module.exports = {
    signUpFormProtection,
    signInFormProtection
};
