// Const And Variables
require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const port = process.env.API_MONITOREO_PORT;
var application = express();
// Cliente Prometeus
const client = require('prom-client');
// Add Metrics
const metrics = new client.Registry();

// Use App
application.use(morgan('dev'));

// Label To Metrics
metrics.setDefaultLabels({
  app: 'Módulo De Monitoreo'
});

// Default Metrics
client.collectDefaultMetrics({ metrics });

// Ruta Inicial
application.get('/', (req, res)=>{ 

    res.status(200).send({ mensaje: "Servicio Monitoreo Prometheus - SOPES1 :D ", });

});

application.get('/metricas', (req, res)=>{ 

    // Send Response
    res.setHeader('Content-Type', metrics.contentType);
    res.end(metrics.metrics());

});

application.listen(port, () => {

    // Server Up
    console.log(`Service Is Running At ${port} :D`);

});