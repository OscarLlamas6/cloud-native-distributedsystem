// Imports
const { Schema, model } = require('mongoose');

// Schema
const tweetSchema = new Schema({

    nombre: String,
    comentario: String,
    fecha: String,
    hashtags: String,
    upvotes: Number,
    downvotes: Number

});

// Module Export
module.exports = model('tweet', tweetSchema);