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
            SELECT id_registration, identifier_mail, mission_title, mission_date, mission_start_time, mission_place_name FROM registration_mission
            LEFT JOIN mission ON _id_mission = id_mission 
            LEFT JOIN user ON _id_user = id_user
            LEFT JOIN identifier ON _id_identifier = id_identifier
            WHERE mission_date >= NOW() AND mission_date <= DATE_ADD(NOW(), INTERVAL ${value} DAY) 
            AND registration_mission_recall_send = 1
            GROUP BY id_registration, identifier_mail, mission_title, mission_date, mission_start_time, mission_place_name;
        `
        const [result] = await db.query(request);

        console.log(result)

        return result;

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

        await db.query(update,[idRegistration]);

    } catch (error) {
        
        console.log(error)
    }
}
