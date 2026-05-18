const { error } = require('winston');
const db = require('../config/database');

exports.addMessageForm = async (nameForm, emailForm, txtArea) => {

    try {

        const request = `INSERT INTO message_form (name_form, email_form, message_text_form) VALUES (?, ?, ?)`;
        
        await db.query(request, [nameForm, emailForm, txtArea]);

    } catch (error) {

        throw new Error(error.message);
    }
}
