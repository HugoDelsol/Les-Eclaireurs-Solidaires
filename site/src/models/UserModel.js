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

/*<?php


class UserModel
{

    private $db;

    public function __construct($db)
    {

        $this->db = $db;
    }

    public function getUserByEmail($emailUser)
    {
        try {

            $request = $this->db->prepare(" SELECT * FROM identifier 
                                            LEFT JOIN `user`
                                            ON `user`._id_identifier = identifier.id_identifier
                                            LEFT JOIN `admin`
                                            ON `admin`._id_identifier = identifier.id_identifier
                                            WHERE identifier_mail = ? ");

            $request->execute([$emailUser]);

            $result = $request->fetch(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {


            var_dump("ECHEC :" . $e->getMessage());
        }
    }

    public function addUser($firstName, $lastName, $mail, $password)
    {
        try {

            $request = $this->db->prepare(" INSERT INTO identifier (identifier_mail, identifier_password) 
                                            VALUES (?, ?)");

            $request->execute([$mail, $password]);

            $userIdentifierId = $this->db->lastInsertId();

            $request = $this->db->prepare(" INSERT INTO user (user_first_name, user_last_name, _id_identifier) 
                                            VALUES (?, ?, ?)");

            $request->execute([$firstName, $lastName, $userIdentifierId]);
        } catch (PDOException $e) {+


            var_dump("ECHEC : " . $e->getMessage());
        }
    }

    public function getAdminByEmail($emailAdmin)
    {
        try {
            $request = $this->db->prepare(" SELECT * FROM identifier
                                            LEFT JOIN `admin`
                                            ON _id_identifier = id_identifier
                                            WHERE identifier_mail = ?");
            $request->execute([$emailAdmin]);

            $result = $request->fetch(PDO::FETCH_ASSOC);
            return $result;
            
        } catch (PDOException $e) {

            var_dump("ECHEC :" . $e->getMessage());
        }
    }

    public function addAdmin($firstName, $lastName, $email, $password)
    {
        try {

            $request = $this->db->prepare(" INSERT INTO `identifier` (identifier_mail, identifier_password)
                                            VALUE (?, ?)");

            $request->execute([$email, $password]);

            $userIdentifierId = $this->db->lastInsertId();

            $request = $this->db->prepare(" INSERT INTO `admin` (admin_first_name, admin_last_name, _id_identifier)
                                            VALUES (?, ?, ?)");

            $request->execute([$firstName, $lastName, $userIdentifierId]);
        } catch (PDOException $e) {

            var_dump("ECHEC : " . $e->getMessage());
        }
    }
}

*/
