const mysql = require("mysql2");
const config = require("../config");

// buraya yazdığım bilgiler aslında veritabanında kurduğum bilgiler
let connection = mysql.createConnection(config.db);

connection.connect(function (err) {
    if (err) {
        console.log(err);
    }
    console.log("MySQL bağlantısı başarılı.");
});

module.exports = connection.promise();