let mysql = require('mysql');
let pool = null;
exports.connect = function() {
    pool = mysql.createPool({
        host:"localhost",
        user: "api",
        password: "as32x83s$",
        database: "worldcup"
    });
  }
  exports.get = function() {
    return pool;
  }