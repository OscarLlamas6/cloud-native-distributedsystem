// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: '34.69.19.145',
  user: 'root',
  database: 'SOPES1',
  password: '1234'
});

module.exports = connection;