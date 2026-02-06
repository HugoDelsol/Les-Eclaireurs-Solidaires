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

    async cronScript(stringVal) {

        if (stringVal.selectedDelay){

            let tabCheck = Object.keys(stringVal);    
            const result = await messageModel.managementRecall(tabCheck)

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