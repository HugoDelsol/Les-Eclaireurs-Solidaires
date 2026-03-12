const service = require('../services/recallService');
const utils = require('../utils/utils');
const messageMdl = require('../models/MessageModel');
const userMdl = require('../models/UserModel');
const { matchedData } = require('express-validator');

exports.newMessageRediger = (req, res) => {
    res.render('messaging/newMessage');
}
exports.newMessageByVolunteer = (req, res) => {
    res.render('messaging/volunteerNewMessage');
}

exports.reminderShow = async (req, res) => {

    try {

        const rServ = new service.RecallService();

        const dataView = await rServ.parseReadFile();

        res.render('account/admin/reminder', {
            dataView: dataView
        })

    } catch (error) {

        console.log(error)
        res.render('account/admin/reminder', {
            dataView: [],
            errorAlertMsg: "Impossible de charger vos données pour le moment."
        })
    }
}

exports.recallManagement = async (req, res) => {

    let dataView = null;

    try {

        const rServ = new service.RecallService;

        const checkBoxData = req.body;

        let jsonData = JSON.stringify(checkBoxData);

        await rServ.writeFile(jsonData);

        dataView = await rServ.parseReadFile();

        if (req.body.recallIsCheckeds && !req.body.emailMessage && !req.body.smsMessag && !req.body.pushMessage) {
            throw new Error("Sélectionnez au moins un canal de diffusion ou désactivez les rappels automatiques.");
        }

        res.render('account/admin/reminder', {
            dataView: dataView,
            successAlertMsg: "Vos modifications ont bien été prises en compte."
        })

    } catch (error) {

        console.log(error)
        res.render('account/admin/reminder', {
            dataView: dataView,
            errorAlertMsg: error.message
        });
    }
}

exports.volunteerMessagingShow = async (req, res) => {

    try {

        let message = null;

        const listOfChannel = await messageMdl.listOfChannelForVolunteer(req.session.userExist.id);

        if (listOfChannel.length == 0) {
            message = "Votre liste ne contient actuellement aucun message"
        }

        res.render('messaging/volunteerMessaging', {
            data: listOfChannel,
            successAlertMsg: message || ""
        });

    } catch (error) {

        console.log(error);
        res.render('messaging/volunteerMessaging', {
            data: [[]],
            errorAlertMsg: "Impossible de charger la liste des messages pour le moment"
        });
    }
}

exports.adminMessagingShow = async (req, res) => {

    try {

        let message = null;

        const listOfChannel = await messageMdl.listOfChannel();

        if (listOfChannel.length == 0) {
            message = "Votre liste ne contient actuellement aucun message";
        }

        res.render('messaging/messaging', {
            data: listOfChannel,
            successAlertMsg: message || ""
        });

    } catch (error) {

        console.log(error);
        res.render('messaging/messaging', {
            data: [[]],
            errorAlertMsg: "Impossible de charger la liste des messages pour le moment"
        });
    }
}

exports.messageRediger = async (req, res) => {

    let pathView = "";
    let status = "";

    if (req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {
        pathView = "messaging/chat";
        status = "admin";
    } else {
        pathView = "messaging/volunteerChat";
        status = "volunteer";
    }

    try {

        const data = await messageMdl.allMessageInChannel(req.params.idChannel);

        res.render(pathView, {
            data: data,
            status: status
        });

    } catch (error) {

        console.log(error);
        res.render(pathView, {
            data: [[]],
            errorAlertMsg: "Impossible de charger les messages de cette conversation pour le moment.",
            status: status
        })
    }
}

exports.sendNewMessageFromAdmin = async (req, res) => {

    try {

        const safeData = matchedData(req);

        const { object, email, content } = safeData;
        
        const mailIsOk = await userMdl.getOneUserByEmail(email);

        if (mailIsOk) {

            const senderId = req.session.userExist.id;
            const recipientId = mailIsOk.id_user;
            const fromUser = 0;
            const messageStatus = 2;
            await messageMdl.sendNewMessageFromAdmin(senderId, recipientId, object, content, fromUser, messageStatus);

        } else {

            throw new Error("L'email ne correspond à aucun bénévole enregistré.");
        }

        res.render('messaging/newMessage', {
            successAlertMsg: "Votre message a bien été envoyé.",
        });

    } catch (error) {

        const { object, email, content } = req.body;

        res.render('messaging/newMessage', {
            object: object,
            textarea: content,
            email: email,
            errorAlertMsg: error.message || "L'envoi de votre message a échoué. Veuillez réessayer."
        });
    }
}

exports.sendNewMessageFromVolunteer = async (req, res) => {

    try {

        const { object, content } = req.body;
        const fromUser = 1;
        const messageStatus = 2;
        const senderId = req.session.userExist.id;
        await messageMdl.sendNewMessageFromVolunteer(senderId, object, content, fromUser, messageStatus);

        res.render('messaging/volunteerNewMessage', {
            successAlertMsg: "Votre message a bien été envoyé.",
        });


    } catch (error) {

        const { object, content } = req.body;

        res.render('messaging/volunteerNewMessage', {
            object: object,
            textarea: content,
            errorAlertMsg: error.message || "L'envoi de votre message a échoué. Veuillez réessayer."
        });
    }
}

exports.replyToAMessage = async (req, res) => {

    let pathView = "";
    let status = "";

    if (req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {
        pathView = "messaging/chat";
        status = "admin";
    } else {
        pathView = "messaging/volunteerChat";
        status = "volunteer";
    }

    try {

        let messageStatus = 2;

        const safeData = matchedData(req);

        const { textarea } = safeData;
        const { idChannel, idUser } = req.body;

        console.log(idChannel)

        console.log(safeData)

        const dataBeforeSend = await messageMdl.allMessageInChannel(idChannel);
        const getStatusMessage = await messageMdl.getStatusMessage(idChannel);

        if (
            getStatusMessage[0].chat_message_from_user == 0 && req.session.userExist.isVolunteer ||
            getStatusMessage[0].chat_message_from_user == 1 && !req.session.userExist.isVolunteer
        ) {
            messageStatus = 3;
        }

        for (let i = 0; i < getStatusMessage.length - 1; i++) {

            if (

                getStatusMessage[i].chat_message_from_user == 1 && getStatusMessage[i + 1].chat_message_from_user == 0 ||
                getStatusMessage[i].chat_message_from_user == 0 && getStatusMessage[i + 1].chat_message_from_user == 1
            ) {

                messageStatus = 3;
            }
        }

        if (res.locals.errorAlertMsg.length > 0) {

            return res.render(pathView, {
                data: dataBeforeSend,
                status: status,
                errorAlertMsg: res.locals.errorAlertMsg,
            });

        } else {

            if (req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {

                const idAdmin = req.session.userExist.id;
                const chatMessageFromUser = 0;
                const data = { idChannel, idUser, idAdmin, textarea, chatMessageFromUser, messageStatus }
                await messageMdl.replyToAMessage(data);

            } else {

                const idUser = req.session.userExist.id;
                const chatMessageFromUser = 1;
                const data = { idChannel, idUser, textarea, messageStatus, chatMessageFromUser }
                await messageMdl.replyToAMessage(data);
            }
        }

        const dataAfterSend = await messageMdl.allMessageInChannel(idChannel);

        res.render(pathView, {
            data: dataAfterSend,
            status: status
        });


    } catch (error) {

        const { textarea } = req.body;

        res.render(pathView, {
            data: [[]],
            errorAlertMsg: "Une erreur est survenue. Veuillez réessayer dans quelques instants.",
            textarea: textarea,
            status: status
        });
    }
}

exports.sendMessageTo = async (req, res) => {

    try {

        const getEmailUserById = await userMdl.getEmailUserById(req.params.idUser);
        res.render('messaging/newMessage', {
            emailFrom: getEmailUserById[0].identifier_mail
        });

    } catch (error) {

        console.log(error);
        res.render('messaging/newMessage', {
            errorAlertMsg: "L'import de l'email n'a pas été pris en compte. Veuillez réessayer plus tard."
        });
    }
}

