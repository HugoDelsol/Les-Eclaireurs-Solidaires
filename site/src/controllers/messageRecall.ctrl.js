const service = require('../services/recallService');
const fs = require('fs');

exports.reminderShow = async (req, res) => {

    try {

        const rServ = new service.RecallService();

        res.render('account/admin/reminder', {
            stringVal: rServ.parseReadFile()
        })

    } catch (error) {

    }
}

exports.recallManagement = async (req, res) => {

    try {

        const rServ = new service.RecallService;

        const checkBoxData = req.body

        let jsonData = JSON.stringify(checkBoxData);

        rServ.writeFile(jsonData);

        ///////////
        const stringVal = rServ.parseReadFile()
        rServ.cronScript(stringVal);
        /////////////////

        res.render('account/admin/reminder', {
            stringVal: rServ.parseReadFile(),
            successAlertMsg: "Vos modifications ont bien été prises en compte."
        })

    } catch (error) {

        console.log(error)
    }
}