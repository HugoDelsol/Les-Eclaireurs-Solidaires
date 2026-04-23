const service = require('../services/recallService');
const utils = require('../utils/utils');
const messageMdl = require('../models/MessageModel');
const userMdl = require('../models/UserModel');
const logger = require('../utils/logger.js')
const { matchedData } = require('express-validator');
const { Logger } = require('winston');

exports.newMessageRediger = (req, res) => {
    return res.status(200).render('messaging/newMessage');
}
exports.newMessageByVolunteer = (req, res) => {
    return res.status(200).render('messaging/volunteerNewMessage');
}

exports.reminderShow = async (req, res) => {

    try {

        const rServ = new service.RecallService();

        const dataView = await rServ.parseReadFile();

        return res.status(200).render('account/admin/reminder', {
            dataView: dataView
        });

    } catch (error) {

        logger.error(error);
        return res.status(500).render('account/admin/reminder', {
            dataView: [],
            errorAlertMsg: "Impossible de charger vos données pour le moment."
        });
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

        if (req.body.recallIsCheckeds && !req.body.emailMessage && !req.body.smsMessage && !req.body.pushMessage) {
            return res.status(422).render('account/admin/reminder', {
                dataView: dataView,
                errorAlertMsg: "Sélectionnez au moins un canal de diffusion ou désactivez les rappels automatiques."
            })
        }

        return res.status(200).render('account/admin/reminder', {
            dataView: dataView,
            successAlertMsg: "Vos modifications ont bien été prises en compte."
        })

    } catch (error) {

        logger.error(error);
        return res.status(500).render('account/admin/reminder', {
            dataView: dataView,
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant."
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

        return res.status(200).render('messaging/volunteerMessaging', {
            data: listOfChannel,
            successAlertMsg: message || ""
        });

    } catch (error) {

        logger.error(error);
        return res.status(500).render('messaging/volunteerMessaging', {
            data: [[]],
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant."
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

        return res.status(200).render('messaging/messaging', {
            data: listOfChannel,
            successAlertMsg: message || ""
        });

    } catch (error) {

        logger.error(error);
        return res.status(500).render('messaging/messaging', {
            data: [[]],
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant."
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

        if (req.session.userExist.isVolunteer) {
            const userAccess = await messageMdl.authorizeDisplayMessagesForUser(req.params.idChannel);
            if (!userAccess || req.session.userExist.id !== userAccess._id_user) {
                return res.status(404).render('home/404');
            }
        }

        req.session.chatData = {
            idChannel: data.resultForId[0].id_chat_channel || [],
            idUser: data.resultForId[0]._id_user || []
        }

        return res.status(200).render(pathView, {
            dataId: data.resultForId,
            dataMessages: data.resultForMessages[1],
            status: status
        });

    } catch (error) {

        logger.error(error);
        res.status(500).render(pathView, {
            dataId: [[]],
            dataMessages: [[]],
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
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

            return res.status(422).render('messaging/newMessage', {
                object: req.body.object,
                textarea: req.body.content,
                email: req.body.email,
                errorAlertMsg: "L'email renseigner n'est pas valide.",
            });
        }

        return res.status(200).render('messaging/newMessage', {
            successAlertMsg: "Votre message a bien été envoyé.",
        });

    } catch (error) {

        logger.error(error);

        const { object, email, content } = req.body;

        return res.status(500).render('messaging/newMessage', {
            object: object,
            textarea: content,
            email: email,
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant."
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

        return res.status(200).render('messaging/volunteerNewMessage', {
            successAlertMsg: "Votre message a bien été envoyé.",
        });


    } catch (error) {

        logger.error(error);

        const { object, content } = req.body;

        return res.status(500).render('messaging/volunteerNewMessage', {
            object: object,
            textarea: content,
            errorAlertMsg:  "Une erreur est survenue. Merci de réessayer dans un instant."
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
        const idChannel = req.session.chatData.idChannel;

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

            return res.status(422).render(pathView, {
                dataId: dataBeforeSend.resultForId,
                dataMessages: dataBeforeSend.resultForMessages[1],
                status: status,
                errorAlertMsg: res.locals.errorAlertMsg,
            });

        } else {

            if (req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {

                const idUser = req.session.chatData.idUser
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

        return res.status(200).render(pathView, {
            dataId: dataAfterSend.resultForId,
            dataMessages: dataAfterSend.resultForMessages[1],
            status: status
        });

    } catch (error) {
        
        const { textarea } = req.body;
        
        logger.error(error);
        return res.status(500).render(pathView, {
            dataId: [[]],
            dataMessages: [[]],
            textarea: textarea,
            status: status,
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
    }
}

exports.sendMessageTo = async (req, res) => {

    try {

        const getEmailUserById = await userMdl.getEmailUserById(req.params.idUser);
        return res.status(200).render('messaging/newMessage', {
            emailFrom: getEmailUserById[0].identifier_mail
        });

    } catch (error) {

        logger.error(error);
        return res.status(500).render('messaging/newMessage', {
            errorAlertMsg: "Une erreur est survenue. Merci de réessayer dans un instant.",
        });
    }
}

