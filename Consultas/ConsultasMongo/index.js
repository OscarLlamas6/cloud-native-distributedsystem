// Imports
const mainApplication = require('./src/app');
const { PORT } = require('./src/db/config');
const { connect } = require('./src/db/connection');

// Set Port
mainApplication.set('port', PORT);

// Function Main 
async function main() {

   //Database Connection
   await connect();

   //Express Application
   await mainApplication.listen(mainApplication.get('port'));

   // Message
   console.log(`Server On Port ${mainApplication.get('port')}: Connected! :D :)`);

};

// Call Main
main();