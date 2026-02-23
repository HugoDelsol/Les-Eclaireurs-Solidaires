const service = require('../services/recallService');
const messageMdl = require('../models/MessageModel');
const userMdl = require('../models/UserModel');

exports.reminderShow = async (req, res) => {

    try {

        const rServ = new service.RecallService();

        const dataView = await rServ.parseReadFile()

        res.render('account/admin/reminder', {
            dataView: dataView
        })

    } catch (error) {

    }
}

exports.recallManagement = async (req, res) => {

    let dataView = null;

    try {

        const rServ = new service.RecallService;

        const checkBoxData = req.body

        let jsonData = JSON.stringify(checkBoxData);

        await rServ.writeFile(jsonData);

        dataView = await rServ.parseReadFile()

        if (req.body.recallIsCheckeds && !req.body.emailMessage && !req.body.smsMessag && !req.body.pushMessage) {
            throw new Error("Sélectionnez au moins un canal de diffusion ou désactivez les rappels automatiques.")
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

exports.adminMessagingShow = async (req, res) => {

    try {

        const listOfChannel = await messageMdl.listOfChannel()

        console.log(listOfChannel[1])

        res.render('messaging/messaging', {
            data: listOfChannel[1],
        });

    } catch (error) {

        console.log(error)
    }
}

exports.messageRediger = async (req, res) => {

    try {

        const data = await messageMdl.allMessageInChannel(req.params.idChannel);

        res.render('messaging/chat', {
            data: data
        });

    } catch (error) {
        console.log(error)
    }
}

exports.newMessageRediger = (req, res) => {
    res.render('messaging/newMessage');
}

exports.sendNewMessageFromAdmin = async (req, res) => {

    try {

        const { object, email, content } = req.body;
        const mailIsOk = await userMdl.getOneUserByEmail(email);

        if (mailIsOk) {

            const senderId = req.session.userExist.id;
            const recipientId = mailIsOk.id_user;
            const fromUser = 0;
            await messageMdl.sendNewMessageFromAdmin(senderId, recipientId, object, content, fromUser);

        } else {

            throw new Error("L'email ne correspond à aucun bénévole enregistré.");
        }

        res.render('messaging/newMessage', {
            successAlertMsg: "Votre message a bien été envoyé.",
        })

    } catch (error) {

        res.render('messaging/newMessage', {
            errorAlertMsg: error.message
        })
    }
}

exports.replyToAMessage = async (req, res) => {

    try {

        let messageStatus = null;

        const { textarea, idChannel, idUser } = req.body;

        const getStatusMessage = await messageMdl.getStatusMessage(idChannel);

        for (let i = 0; i < getStatusMessage.length; i++) {

            for (let u = 1; u < getStatusMessage.length - 1; i++) {

                if ( 
                    getStatusMessage[i].chat_message_from_user == 1 && getStatusMessage[u].chat_message_from_user == 0 ||
                    getStatusMessage[i].chat_message_from_user == 0 && getStatusMessage[u].chat_message_from_user == 1
                ) {
                    // message repondu
                    break;
                }
            }
            /* console.log(getStatusMessage[i+1].chat_message_from_user) */
            /* console.log(getStatusMessage.chat_message_from_user[i]) */
            /* if (s.chat_message_from_user == 1 && s.chat_message_from_user + 1){

            } */
        }

        if (req.session.userExist.isAdmin || req.session.userExist.isSuperAdmin) {

            const idAdmin = req.session.userExist.id;
            const chatMessageFromUser = 0
            await messageMdl.replyToAMessage(idChannel, idUser, idAdmin, textarea, chatMessageFromUser, messageStatus);

        } else {

            await messageMdl.replyToAMessage(idChannel, idUser, textarea, messageStatus);
        }

        const data = await messageMdl.allMessageInChannel(idChannel);

        res.render('messaging/chat', {
            data: data
        });


    } catch (error) {

    }
}

