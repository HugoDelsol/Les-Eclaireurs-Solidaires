const db = require('../config/database');

exports.recallModel = async () => {

    try {

        const request = `SELECT * FROM message_recall_template`;

        const [result] = await db.query(request);

        return result;

    } catch (error) {

        console.log(error)
    }
}

exports.getUsersWithMissionInNextValue = async (value) => {

    try {

        const request = `
            SET lc_time_names = 'fr_FR';
            SELECT id_registration, identifier_mail, mission_title, DATE_FORMAT(mission_date, "%W %e %M %Y") AS mission_date , DATE_FORMAT(mission_start_time, "%Hh%i") AS mission_start_time, mission_place_name FROM registration_mission
            LEFT JOIN mission ON _id_mission = id_mission 
            LEFT JOIN user ON _id_user = id_user
            LEFT JOIN identifier ON _id_identifier = id_identifier
            WHERE mission_date >= NOW() AND mission_date <= DATE_ADD(NOW(), INTERVAL ${value} DAY) 
            AND registration_mission_recall_send = 0
            GROUP BY id_registration, identifier_mail, mission_title, mission_date, mission_start_time, mission_place_name;
        `
        const [result] = await db.query(request);

        return result[1];

    } catch (error) {

        console.log(error)
    }
}

exports.updateValueSend = async (idRegistration) => {

    try {

        const update = `
            UPDATE registration_mission
            SET registration_mission_recall_send = 1
            WHERE id_registration = ?
        `

        await db.query(update, [idRegistration]);

    } catch (error) {

        console.log(error)
    }
}

exports.sendNewMessageFromAdmin = async (senderId, recipientId, object, content, fromUser) => {

    try {
        const insertObject = `        
            INSERT INTO chat_channel (chat_channel_object) VALUE (?)
        `
        const [resultIdChannel] = await db.query(insertObject, object);

        const lastInsertIdChannel = resultIdChannel.insertId;

        const insertAll = `
            INSERT INTO chat_message (chat_message_content, _id_user, _id_admin, chat_message_from_user, _id_chat_channel) VALUES (?, ?, ?, ?, ?)
        `
        await db.query(insertAll, [content, recipientId, senderId, fromUser, lastInsertIdChannel])
    } catch (error) {
        console.log(error)
    }
}

exports.listOfChannel = async () => {

    try {

        const request = `
            SET lc_time_names = 'fr_FR';
            SELECT DISTINCT id_chat_channel, chat_channel_object, DATE_FORMAT(chat_channel_date, "%W %e %M %Y") AS chat_channel_date, chat_message_from_user, chat_message_status FROM chat_channel 
            LEFT JOIN chat_message ON _id_chat_channel = id_chat_channel;            
        `
        const [result] = await db.query(request)
        return result

    } catch (error) {

        console.log(error)
    }
}

exports.allMessageInChannel = async (idChannel) => {

    try {
        
        const request = `
            SELECT * FROM chat_message 
            LEFT JOIN chat_channel ON _id_chat_channel = id_chat_channel 
            LEFT JOIN admin ON _id_admin = id_admin
            LEFT JOIN user ON _id_user = id_user
            LEFT JOIN identifier ON _id_identifier = id_identifier
            WHERE id_chat_channel = ?`;

        const [result] = await db.query(request, idChannel);

        console.log(result)

        return result

    } catch (error) {
        
        console.log(error);
    }
}
