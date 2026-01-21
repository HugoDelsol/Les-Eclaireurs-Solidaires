const db = require('../config/database');
const bcrypt = require('bcrypt')

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 2 AS solution');
        console.log('Connexion OK, test SQL:', rows[0].solution);
    } catch (err) {
        console.error('Erreur connexion DB:', err.message);
    }
}
testConnection();

exports.getAllAdmins = async () => {
    try {

        const requestSuperAdmins = `SELECT 
                                    *,
                                    DATE_FORMAT(admin_created_at, '%d/%m/%Y') AS admin_created_at
                                    FROM admin
                                    LEFT JOIN admin_role
                                    ON _id_admin_role = id_admin_role
                                    WHERE id_admin_role = 1;`

        const [resultSuperAdmins] = await db.query(requestSuperAdmins);

        const requestAdmins = `SELECT 
                                    *,
                                    DATE_FORMAT(admin_created_at, '%d/%m/%Y') AS admin_created_at
                                    FROM admin
                                    LEFT JOIN admin_role
                                    ON _id_admin_role = id_admin_role
                                    WHERE id_admin_role = 2;`

        const [resultAdmins] = await db.query(requestAdmins);

        return {
            resultSuperAdmins,
            resultAdmins
        };

    } catch (error) {

        throw new error;
    }
}

exports.getAllVolunteers = async () => {

    try {

        const request = `
            SELECT * FROM user 
            LEFT JOIN identifier 
            ON _id_identifier = id_identifier
            LEFT JOIN registration_mission
            ON _id_user = id_user

// REQUEST FOR SELCTED 

            SELECT user_first_name, user_created_at, COUNT(_id_mission) AS "nbr_registration" FROM user 
            LEFT JOIN identifier 
            ON _id_identifier = id_identifier
            LEFT JOIN registration_mission
            ON _id_user = id_user
            WHERE user_created_at < CURRENT_DATE()
            GROUP BY user_first_name, user_created_at              
            ORDER BY nbr_registration ASC;
            
        `;
        const [result] = await db.query(request);

        //const 

        return result;

    } catch (error) {

    }
}

exports.getOneUserByEmail = async (email) => {

    try {

        const request = `SELECT * FROM identifier 
                        LEFT JOIN user
                        ON user._id_identifier = identifier.id_identifier
                        LEFT JOIN admin
                        ON admin._id_identifier = identifier.id_identifier
                        WHERE identifier_mail = ?`;

        const [result] = await db.query(request, [email]);

        return result && result[0] ? result[0] : null;

    } catch (e) {

        throw e;
    }
}

exports.addUser = async (

    firstName,
    lastName,
    email,
    password,

) => {

    try {

        const saltRound = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, saltRound);

        const requestIdentifier = `INSERT INTO identifier (identifier_mail, identifier_password) VALUES (?, ?)`
        const [resultIdentifier] = await db.query(requestIdentifier, [email, passwordHash]);

        let lasInsertId = resultIdentifier.insertId;

        const requestUser = `INSERT INTO user (user_first_name, user_last_name, _id_identifier) VALUES (?, ?, ?)`
        const [resultUser] = await db.query(requestUser, [firstName, lastName, lasInsertId]);

        return resultUser;

    } catch (e) {

        throw e;

    }
}

exports.addAdmin = async (

    firstName,
    lastName,
    email,
    password,
    idAdminRole,

) => {

    try {

        const saltRound = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, saltRound);

        const requestIdentifier = `INSERT INTO identifier (identifier_mail, identifier_password) VALUES (?, ?)`;
        const [resultIdentifier] = await db.query(requestIdentifier, [email, passwordHash]);

        const lastInsertId = resultIdentifier.insertId

        const requestAdmin = `INSERT INTO admin (admin_first_name, admin_last_name, _id_admin_role, _id_identifier) VALUES (?, ?, ?, ?)`;
        const [resultAdmin] = await db.query(requestAdmin, [firstName, lastName, idAdminRole, lastInsertId]);

        return resultAdmin;

    } catch (error) {

        throw error;
    }
}

exports.getUserAddress = async (idUser) => {

    try {

        const getDatas = `
            SELECT * FROM user AS u
            LEFT JOIN city
            ON id_city = _id_city
            LEFT JOIN region 
            ON id_region = _id_region            
            WHERE id_user = ?
        `;

        const [result] = await db.query(getDatas, idUser);
        return result;

    } catch (error) {

    }
}