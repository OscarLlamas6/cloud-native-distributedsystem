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
  app: 'modulo-de-monitoreo'
});

// Add Default Metrics
client.collectDefaultMetrics({ metrics });

// Create Metrics
const httpTotalRam = new client.Gauge({ name: 'http_request_totalram', help: 'Ram Total' });
const httpUsedRam = new client.Gauge({ name: 'http_request_usedram', help: 'Ram Utilizada' });
const httpLibreRam = new client.Gauge({ name: 'http_request_freeram', help: 'Ram Libre' });
const httpPorcentUsed = new client.Gauge({ name: 'http_request_porcentusedram', help: 'Porcentaje De Ram Utilizada' });
const httpPorcentCPU = new client.Gauge({ name: 'http_request_porcentcpu', help: 'Porcentaje De CPU Utilizado' });
const httpProcessNumber = new client.Gauge({ name: 'http_request_processnumber', help: 'Numero De Procesos Activos' });

// Add Metrics
metrics.registerMetric(httpTotalRam);
metrics.registerMetric(httpUsedRam);
metrics.registerMetric(httpLibreRam);
metrics.registerMetric(httpPorcentUsed);
metrics.registerMetric(httpPorcentCPU);
metrics.registerMetric(httpProcessNumber);

// Ruta Inicial
application.get('/', (req, res)=>{ 

    res.status(200).send({ mensaje: "Servicio Monitoreo Prometheus - SOPES1 :D ", });

});

application.get('/metrics', async (req, res)=>{ 

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

    // Set Values 
    httpTotalRam.set(parseInt(ramArray[0].trim()));
    httpUsedRam.set(parseInt(ramArray[1].trim()));
    httpLibreRam.set(parseInt(ramArray[2].trim()));
    httpPorcentUsed.set(parseInt(ramArray[3].trim()));
    httpPorcentCPU.set(parseInt(cpuArray[0].trim()));
    httpProcessNumber.set(parseInt(cpuArray[2].trim()));
  
    // Send Response
    res.setHeader('Content-Type', metrics.contentType);
    res.end(await metrics.metrics());

});

application.listen(9099, () => {

    // Server Up
    console.log(`Service Is Running At ${9099} :D`);

}); 