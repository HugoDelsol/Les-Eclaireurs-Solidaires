const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
process.env.NODE_ENV === 'test' ? dotenv.config({ path: '.env.test' }) : dotenv.config();

const connection = mysql.createPool( {

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWRD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'

});

console.log(`--- Démarrage en mode : ${process.env.NODE_ENV} ---`);
console.log(`--- Base ciblée : ${process.env.DB_NAME} ---`);

module.exports = connection;