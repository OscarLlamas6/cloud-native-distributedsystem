"use strict";

// get the client
var mysql = require('mysql2'); // create the connection to database


var connection = mysql.createConnection({
  host: '34.69.19.145',
  user: 'root',
  database: 'SOPES1',
  password: '1234'
});
module.exports = connection;