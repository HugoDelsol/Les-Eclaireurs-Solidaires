const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'config', 'checkBoxData.json');
const nodemailer = require('nodemailer');
const messageMdl = require('../models/MessageModel');

class RecallService {

    constructor() {

    }

    writeFile(jsonData) {
        fs.writeFileSync(filePath, jsonData);
    }

    parseReadFile() {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    async sendEmail(templateModel, users) {

        if (users.length === 0){ return null; }

        for (const u of users) {

            const emailContent = this.updateTemplate(templateModel, u);            

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });

            let mailOptions = {
                from: 'hugo.delsol64@gmail.com',
                to: u.identifier_mail,
                subject: templateModel.message_object,
                text: emailContent
            };

            transporter.sendMail(mailOptions, (error, info) => {

                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ', info.response);
                }
            });           

            await messageMdl.updateValueSend(u.id_registration);
        }
    }

    async selectMissionRecallsByDelay(delay) {

        if (delay === "J-1") {
            const getUsersWithMissionInNextValue = await messageMdl.getUsersWithMissionInNextValue(1);
            return getUsersWithMissionInNextValue;
        }

        if (delay === "J-3") {
            const getUsersWithMissionInNextValue = await messageMdl.getUsersWithMissionInNextValue(3);
            return getUsersWithMissionInNextValue;
        }

        if (delay === "J-7") {
            const getUsersWithMissionInNextValue = await messageMdl.getUsersWithMissionInNextValue(7);
            return getUsersWithMissionInNextValue;
        }
    }

    updateTemplate(recallModel, u) {

        let content = recallModel.message_content;

        content = content.replace("{{mission}}", u.mission_title);
        content = content.replace("{{date}}", u.mission_date);
        content = content.replace("{{heure}}", u.mission_start_time);
        content = content.replace("{{lieu}}", u.mission_place_name);

        return content;
    }

    async cronScript(stringVal) {

        try {

            if (stringVal.recallIsCheckeds) {

                const recallModel = await messageMdl.recallModel();

                const selectUsersRecallsByDelay = await this.selectMissionRecallsByDelay(stringVal.selectedDelay);

                //console.log(selectUsersRecallsByDelay)

                if (stringVal.emailMessage) {
                    this.sendEmail(recallModel[0], selectUsersRecallsByDelay);
                }

                /*  if (stringVal.smsMessage) {
                     this.sendSms(recallModel[1], selectUsersRecallsByDelay);
                 } */

                /*  if (stringVal.pushMessage) {
                     this.sendPush(recallModel[2], selectUsersRecallsByDelay);
                 }  */

            } else {

                console.log('no activated');
            }

        } catch (error) {

            console.log(error)
        }
    }
}

module.exports = {
    RecallService,
}
