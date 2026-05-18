const mysql = require('mysql2/promise');

const connection = mysql.createPool({

    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWRD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'

});

module.exports = connection;