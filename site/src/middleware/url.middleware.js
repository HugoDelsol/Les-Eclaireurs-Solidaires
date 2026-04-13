const { param, query, validationResult } = require('express-validator');

const urlMustBeANumberForMissionDetail = [

    param('idMission').isInt().withMessage("Ce n'est pas l'url de ta mère"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const message = errors.array()[0].msg;

            return res.render('home/404', {
                errorAlertMsg: message,
            });
        }

        next();
    }
]

const urlMustBeANumberForMessageChannel = [

    param('idChannel').isInt().withMessage("Ce n'est pas l'url de ta mère"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const message = errors.array()[0].msg;

            return res.render('home/404', {
                errorAlertMsg: message,
            });
        }

        next();
    }
]

const urlMustBeANumberForSendMessageToUser = [

    param('idUser').isInt().withMessage("Ce n'est pas l'url de ta mère"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            const message = errors.array()[0].msg;

            return res.render('home/404', {
                errorAlertMsg: message,
            });
        }

        next();
    }
]

module.exports = {
    urlMustBeANumberForMissionDetail,
    urlMustBeANumberForMessageChannel,
    urlMustBeANumberForSendMessageToUser
}