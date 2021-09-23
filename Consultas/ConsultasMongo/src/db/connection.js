// Imports
const mongoose = require('mongoose');
const config = require("./config");

// Mongo URL
const MONGODB_URL = `mongodb://${config.MONGODB_HOST}/${config.MONGODB_DATABASE}`;

// Connection 
async function connect() {

    // Make Connection
    await mongoose.connect(MONGODB_URL, {

      useNewUrlParser: true,
      useUnifiedTopology: true,
    
    });
    
    console.log('\nDatabase Connected :D\n');
};

// Module Export
module.exports = { connect };