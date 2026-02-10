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
            SELECT identifier_mail FROM registration_mission
            LEFT JOIN mission ON _id_mission = id_mission 
            LEFT JOIN user ON _id_user = id_user
            LEFT JOIN identifier ON _id_identifier = id_identifier
            WHERE mission_date >= NOW() AND mission_date <= DATE_ADD(NOW(), INTERVAL ${value} DAY) 
            GROUP BY identifier_mail;
        `
        const [result] = await db.query(request);

        return result;

    } catch (error) {

        console.log(error)
    }
}
