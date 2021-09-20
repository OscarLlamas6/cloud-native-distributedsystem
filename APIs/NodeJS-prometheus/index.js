// Const And Variables
const morgan = require('morgan');
const express = require('express');
const axios = require('axios');

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

// Ruta Inicial
application.get('/', (req, res)=>{ 

    res.status(200).send({ mensaje: "Servicio Monitoreo Prometheus - SOPES1 :D ", });

});

application.get('/metricas', async (req, res)=>{ 

    // Data 
    let data = "";  
  
    // Make Request 
    await axios.get('http://34.125.26.7:3065/leer')
    .then(response => {

      data = response.data;
    
    })
    .catch(error => {

      console.log(error);
    
    });  
  
    // Create Metrics
    const httpRAMModule = new client.Gauge({ name: 'http_request_usedram', help: 'Ram Utilazada Por La Maquina' });
    httpRAMModule.set(80);

    // Add Metrics
    metrics.registerMetric(httpRAMModule);

    // Send Response
    res.setHeader('Content-Type', metrics.contentType);
    res.end(await metrics.metrics());

});

application.listen(9099, () => {

    // Server Up
    console.log(`Service Is Running At ${9099} :D`);

}); 