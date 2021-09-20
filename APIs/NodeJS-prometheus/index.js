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
    
    const ramArray = data["RAM"].split(",");
    const cpuArray = data["CPU"].split(",");
    
    // Create Metrics
    const httpTotalRam = new client.Gauge({ name: 'http_request_totalram', help: 'Ram Total' });
    httpTotalRam.set(parseInt(ramArray[0].trim()));
    const httpUsedRam = new client.Gauge({ name: 'http_request_usedram', help: 'Ram Utilizada' });
    httpUsedRam.set(parseInt(ramArray[1].trim()));
    const httpLibreRam = new client.Gauge({ name: 'http_request_freeram', help: 'Ram Libre' });
    httpLibreRam.set(parseInt(ramArray[2].trim()));
    const httpPorcentUsed = new client.Gauge({ name: 'http_request_porcentusedram', help: 'Porcentaje De Ram Utilizada' });
    httpPorcentUsed.set(parseInt(ramArray[3].trim()));
    const httpPorcentCPU = new client.Gauge({ name: 'http_request_porcentcpu', help: 'Porcentaje De CPU Utilizado' });
    httpPorcentCPU.set(parseInt(cpuArray[0].trim()));
    const httpProcessNumber = new client.Gauge({ name: 'http_request_processnumber', help: 'Numero De Procesos Activos' });
    httpProcessNumber.set(parseInt(cpuArray[2].trim()));

    // Add Metrics
    metrics.registerMetric(httpTotalRam);
    metrics.registerMetric(httpUsedRam);
    metrics.registerMetric(httpLibreRam);
    metrics.registerMetric(httpPorcentUsed);
    metrics.registerMetric(httpPorcentCPU);
    metrics.registerMetric(httpProcessNumber);

    // Send Response
    res.setHeader('Content-Type', metrics.contentType);
    res.end(await metrics.metrics());

});

application.listen(9099, () => {

    // Server Up
    console.log(`Service Is Running At ${9099} :D`);

}); 