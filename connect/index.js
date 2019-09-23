const mysql = require('mysql');
const con = mysql.createConnection({
    host: "phpmyadmin.tombaby.vn",
    user: "pm2",
    password: "@T12345678",
    database: "demo_tombaby"
})

module.exports = con