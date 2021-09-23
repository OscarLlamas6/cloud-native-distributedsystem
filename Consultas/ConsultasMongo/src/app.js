// Creación Servidor

// Imports
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Main Application
const mainApplication = express();

// Config
mainApplication.use(morgan('dev'));
mainApplication.use(cors());
mainApplication.use(express.json());

// Routes
mainApplication.use(require('./routes/routes'));

// Module Export
module.exports = mainApplication;