const mysql = require('mysql2/promise');
const path = require('path')
const dotenv = require('dotenv');
process.env.NODE_ENV === 'test' ? dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') }) : dotenv.config();

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

console.log(`La configuration est : ${process.env.NODE_ENV}`)
console.log(`La configuration de dbName : ${process.env.DB_NAME}`)

module.exports = connection;