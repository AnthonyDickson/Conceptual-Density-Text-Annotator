require('dotenv').config();

const mysql = require('mysql');

exports.pool = mysql.createPool({
    host: process.env.MYSQL_URI || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DB || 'test',
    connectionLimit: 10,
    queueLimit: 20
});
