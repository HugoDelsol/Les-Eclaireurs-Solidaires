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

        const url = "https://api.brevo.com/v3/smtp/email"

        for (const user of users) {

            const emailContent = this.updateTemplate(templateModel, user);

            const emailData = {
                sender: {
                    name: 'Les Éclaireurs Solidaires',
                    email: 'hugo.delsol64@gmail.com'
                },
                to: [{ email: 'hugo.delsol64@gmail.com' }],
                subject: templateModel.message_object,
                textContent: emailContent
            }

            try {

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': process.env.BREVO_API_KEY
                    },
                    body: JSON.stringify(emailData)
                })

                await messageMdl.updateValueSend(user.id_registration);
                console.log("response", response);

            } catch (error) {

                console.log(error);
            }
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

        const data = await stringVal;
        if (!data) return;

        try {

            if (data.recallIsCheckeds) {

                const recallModel = await messageMdl.recallModel();

                const selectUsersRecallsByDelay = await this.selectMissionRecallsByDelay(data.selectedDelay);

                if (selectUsersRecallsByDelay.length === 0) {
                    console.log("No users found for recall.");
                    return null;
                } 

                if (data.emailMessage) {
                    await this.sendEmail(recallModel[0], selectUsersRecallsByDelay);
                }

            } else {

                console.log('Recall not activated.');
            }

        } catch (error) {

            console.log("Error during cron execution : ", error);
        }
    }
}

module.exports = {
    RecallService,
}
