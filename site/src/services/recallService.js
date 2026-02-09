const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'config', 'checkBoxData.json');
const messageModel = require('../models/MessageModel');


class RecallService {

    constructor() {

    }

    writeFile(jsonData) {
        fs.writeFileSync(filePath, jsonData);
    }

    parseReadFile() {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    nodemailer() {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'youremail@gmail.com',
                pass: 'yourpassword'
            }
        });

        let mailOptions = {
            from: 'youremail@gmail.com',
            to: 'myfriend@yahoo.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    async cronScript(stringVal) {



        if (stringVal.recallIsCheckeds) {

            let tabCheck = Object.keys(stringVal);
            const result = await messageModel.managementRecall(tabCheck)

        } else {
            console.log('no activated')
        }
    }

}

module.exports = {
    RecallService,
}

/* 
for (let s in stringVal) {
    //console.log(stringVal[s] === "true")

}

console.log(stringVal.selectedDelay)

if (stringVal.recallIsCheckeds) {

    if (stringVal.mail) {

    }

} */