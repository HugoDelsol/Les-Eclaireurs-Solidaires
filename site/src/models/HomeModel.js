const db = require('../config/database');

exports.addMessageForm = async (nameForm, emailForm, txtArea) => {

    try {

        const request = `INSERT INTO message_form (name_form, email_form, message_text_form) VALUES (?, ?, ?)`
        
        const result = await db.query(request, [nameForm, emailForm, txtArea])  
        
        return result

    } catch (error) {

        throw error;
    }
}
