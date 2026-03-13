// ==============================
// IMPORTS & DEPENDENCIES
// ==============================

const { body, validationResult } = require('express-validator');

// ==============================
// FORM ADD NEW MESSAGE FROM ADMIN PROTECTION
// ==============================

const messagingAddNewMessage = [

    body('object').trim().escape().notEmpty().withMessage("L'objet de votre demande est requis"),
    body('email').trim().isEmail().normalizeEmail().withMessage("L'adresse email saisie n'est pas valide"),
    body('content').trim().escape().notEmpty().withMessage("Le contenu du message ne peut pas être vide").isLength({ min: 10 }).withMessage("Votre message est trop court (10 caractères minimum)"),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {

            const message = error.array()[0].msg;

            return res.render('messaging/newMessage', {
                errorAlertMsg: message,
                object: req.body.object,
                email: req.body.email,
                content: req.body.content,
            });
        }

        next();
    }
];

// ==============================
// FORM ADD NEW MESSAGE FROM VOLUNTEER PROTECTION
// ==============================

const messagingAddNewMessageFromVolunteer = [

    body('object').trim().escape().notEmpty().withMessage("L'objet de votre demande est requis"),
    body('content').trim().escape().notEmpty().withMessage("Le contenu du message ne peut pas être vide").isLength({ min: 10 }).withMessage("Votre message est trop court (10 caractères minimum)"),

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {

            const message = error.array()[0].msg;

            return res.render('messaging/volunteerNewMessage', {
                errorAlertMsg: message,
                object: req.body.object,
                content: req.body.content,
            });
        }

        next();
    }
];

// ==============================
// CHAT MESSAGING PROTECTION FROM ALL USERS
// ==============================

const chatMessagingProtection = [

    body('textarea')
        .trim()
        .escape()
        .notEmpty().withMessage("Un message est requis")
        .isLength({ max: 2000 }).withMessage("Le message doit faire au maximum 2000 caractères"),        

    (req, res, next) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {

            const message = error.array()[0].msg;
            res.locals.errorAlertMsg = message;
            console.log(res.locals.errorAlertMsg);
        }

        next();
    }
];

module.exports = {
    messagingAddNewMessage,
    messagingAddNewMessageFromVolunteer,
    chatMessagingProtection,
}