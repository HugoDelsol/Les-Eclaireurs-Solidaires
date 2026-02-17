const service = require('../services/recallService');

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
    res.render('messaging/messaging')
}

exports.messageRediger = async (req, res) => {
    res.render('messaging/chat')
}