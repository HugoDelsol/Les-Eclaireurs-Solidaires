const db = require('../config/database');

exports.recallModel = async () => {

    try {

        const request = `SELECT * FROM message_recall_template`;

        const [result] = await db.query(request);

        return result;

    } catch (error) {

        console.log(error);
        throw error;
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

        console.log(error);
        throw error;
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

        console.log(error);
        throw error;
    }
}

exports.sendNewMessageFromAdmin = async (senderId, recipientId, object, content, fromUser, messageStatus) => {

    try {

        const insertObject = `        
            INSERT INTO chat_channel (chat_channel_object) VALUE (?)
        `
        const [resultIdChannel] = await db.query(insertObject, object);

        const lastInsertIdChannel = resultIdChannel.insertId;

        const insertAll = `
            INSERT INTO chat_message (chat_message_content, _id_user, _id_admin, chat_message_from_user, _id_chat_channel, chat_message_status) VALUES (?, ?, ?, ?, ?, ?)
        `
        await db.query(insertAll, [content, recipientId, senderId, fromUser, lastInsertIdChannel, messageStatus]);

    } catch (error) {

        console.log(error);
        throw error;
    }
}

exports.sendNewMessageFromVolunteer = async (senderId, object, content, fromUser, messageStatus) => {

    try {

        const insertObject = `

            INSERT INTO chat_channel (chat_channel_object) VALUE (?);
        `
        const [resultIdChannel] = await db.query(insertObject, object);

        const lastInsertIdChannel = resultIdChannel.insertId;

        const insertAll = `
            INSERT INTO chat_message (_id_user, chat_message_content, chat_message_from_user, chat_message_status, _id_chat_channel) VALUES (?, ?, ?, ?, ?);
        `
        await db.query(insertAll, [senderId, content, fromUser, messageStatus, lastInsertIdChannel]);

    } catch (error) {

        console.log(error);
        throw error;
    }
}

exports.listOfChannel = async () => {

    try {

        const request = `
            SET lc_time_names = 'fr_FR';
            SELECT 
                cc.id_chat_channel,
                cc.chat_channel_object,
                DATE_FORMAT(cc.chat_channel_date, "%e %M %Y") AS chat_channel_date,
                cm.chat_message_from_user,
                cm.chat_message_status,
                u.user_first_name,
                u.user_last_name
            FROM chat_channel cc            
            LEFT JOIN chat_message cm 
                ON cm.id_chat_message = (
                    SELECT MAX(id_chat_message)
                    FROM chat_message
                    WHERE _id_chat_channel = cc.id_chat_channel
                )
           	LEFT JOIN user u ON cm._id_user = u.id_user
            ORDER BY chat_message_from_user DESC;           
        `
        const [result] = await db.query(request)
        return result[1]

    } catch (error) {

        console.log(error);
        throw error;
    }
}

exports.listOfChannelForVolunteer = async (idUser) => {

    try {

        const request = `
            SET lc_time_names = 'fr_FR';
            SELECT 
                cc.id_chat_channel,
                cc.chat_channel_object,
                DATE_FORMAT(cc.chat_channel_date, "%e %M %Y") AS chat_channel_date,
                cm.chat_message_from_user,
                cm.chat_message_status
            FROM chat_channel cc            
            LEFT JOIN chat_message cm 
                ON cm.id_chat_message = (
                    SELECT MAX(id_chat_message)
                    FROM chat_message
                    WHERE _id_chat_channel = cc.id_chat_channel
                )
           	LEFT JOIN user u ON cm._id_user = u.id_user
            WHERE cm._id_user = ?
            ORDER BY chat_message_from_user ASC; 
        `

        const [result] = await db.query(request, idUser);

        return result[1];

    } catch (error) {

    }
}

exports.authorizeDisplayMessagesForUser = async (idChannel) => {

    try {

        const req = `
            SELECT _id_user FROM chat_message WHERE _id_chat_channel = ? LIMIT 1
        `

        const [result] = await db.query(req, [idChannel]);

        return result[0]
        
    } catch (error) {

        console.log(error);
        throw error;
    }
}

exports.allMessageInChannel = async (idChannel) => {

    try {

        const reqForId = `
            SELECT chat_channel_object, identifier_mail, id_chat_channel, _id_user FROM chat_message AS cm
            LEFT JOIN chat_channel AS ch ON cm._id_chat_channel = ch.id_chat_channel
            LEFT JOIN user AS u ON cm._id_user = u.id_user
            LEFT JOIN identifier AS i ON u._id_identifier = i.id_identifier
            WHERE id_chat_channel = ?
            LIMIT 1;
        `
        const [resultForId] = await db.query(reqForId, idChannel);

        const reqForMessages = `
            SET lc_time_names = 'fr_FR';
            SELECT DATE_FORMAT(chat_message_date, "%d/%m/%Y - %Hh") AS date, chat_message_content, chat_message_from_user FROM chat_message AS cm
            LEFT JOIN chat_channel AS ch ON cm._id_chat_channel = ch.id_chat_channel
            WHERE id_chat_channel = ?;
        `
        const [resultForMessages] = await db.query(reqForMessages, idChannel);        

        return data = {
            resultForId,
            resultForMessages
        } 

    } catch (error) {

        console.log(error);
        throw error;
    }
}

exports.replyToAMessage = async (data) => {
    

    try {

        let query = null;

        if (data.chatMessageFromUser == 0) {

            query = `
                INSERT INTO chat_message (_id_chat_channel, _id_user, _id_admin, chat_message_content, chat_message_from_user, chat_message_status) VALUES (?, ?, ?, ?, ?, ?);
                `
            await db.query(query, [data.idChannel, data.idUser, data.idAdmin, data.textarea, data.chatMessageFromUser, data.messageStatus]);

        } else {

            query = `
                INSERT INTO chat_message (_id_chat_channel, _id_user, chat_message_content, chat_message_from_user, chat_message_status) VALUES (?, ?, ?, ?, ?);
            `
            await db.query(query, [data.idChannel, data.idUser, data.textarea, data.chatMessageFromUser, data.messageStatus]);
        }

    } catch (error) {

        console.log(error);
        throw error;
    }
}

exports.getStatusMessage = async (idChannel) => {

    try {

        const request = `
             SELECT chat_message_from_user FROM chat_message LEFT JOIN chat_channel ON  _id_chat_channel = id_chat_channel WHERE id_chat_channel = ?;
        `
        const [result] = await db.query(request, idChannel);

        return result;

    } catch (error) {

        console.log(error);
        throw error;
    }
}

exports.getStatusMessageForSideNav = async (idUser) => {

    try {

        const request = `
             SELECT
                cm.chat_message_status
            FROM chat_channel cc            
            LEFT JOIN chat_message cm 
                ON cm.id_chat_message = (
                    SELECT MAX(id_chat_message)
                    FROM chat_message
                    WHERE _id_chat_channel = cc.id_chat_channel
                )
           	LEFT JOIN user u ON cm._id_user = u.id_user
            WHERE cm._id_user = ?
            ORDER BY chat_message_from_user ASC
        `
    } catch (error) {

    }
}


