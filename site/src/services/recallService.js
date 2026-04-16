const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, '..', 'config', 'manageRecall.json');
const nodemailer = require('nodemailer');
const messageMdl = require('../models/MessageModel');

class RecallService {

    async writeFile(jsonData) {
        try {            
            await fs.writeFile(filePath, jsonData, 'utf-8');
        } catch (error) {
            console.log("Erreur lors de l'écriture du fichier :", error);
        }
    }

    async parseReadFile() {
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.log("Erreur lors de la lecture ou du parse JSON :", error);
            return null;
        }
    }

    async sendEmail(templateModel, users) {

        if (users.length === 0) { return null; }

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        for (const u of users) {

            const emailContent = this.updateTemplate(templateModel, u);

            let mailOptions = {
                from: process.env.MAIL_FROM,
                to: 'hugo.delsol64@gmail.com',
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

        const data =  await stringVal

        try {

            if (data.recallIsCheckeds) {

                const recallModel = await messageMdl.recallModel();

                const selectUsersRecallsByDelay = await this.selectMissionRecallsByDelay(data.selectedDelay);

                if (data.emailMessage) {
                    this.sendEmail(recallModel[0], selectUsersRecallsByDelay);
                }

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
