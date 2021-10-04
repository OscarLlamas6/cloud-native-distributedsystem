"use strict";

// get the client
var mysql = require('mysql2'); // create the connection to database


var connection = mysql.createConnection({
  host: process.env.CLOUDSQL_HOST,
  user: process.env.CLOUDSQL_USER,
  database: process.env.CLOUDSQL_DB,
  password: process.env.CLOUDSQL_PASS
});
module.exports = connection;