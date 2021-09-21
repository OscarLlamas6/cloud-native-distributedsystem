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
// Ubuntu
const httpTotalRam = new client.Gauge({ name: 'http_request_totalram', help: 'Ram Total' });
const httpUsedRam = new client.Gauge({ name: 'http_request_usedram', help: 'Ram Utilizada' });
const httpLibreRam = new client.Gauge({ name: 'http_request_freeram', help: 'Ram Libre' });
const httpPorcentUsed = new client.Gauge({ name: 'http_request_porcentusedram', help: 'Porcentaje De Ram Utilizada' });
const httpPorcentCPU = new client.Gauge({ name: 'http_request_porcentcpu', help: 'Porcentaje De CPU Utilizado' });
const httpProcessNumber = new client.Gauge({ name: 'http_request_processnumber', help: 'Numero De Procesos Activos' });
// Centos
const httpTotalRam_centoos = new client.Gauge({ name: 'http_request_totalram_centoos', help: 'Ram Total' });
const httpUsedRam_centoos = new client.Gauge({ name: 'http_request_usedram_centoos', help: 'Ram Utilizada' });
const httpLibreRam_centoos = new client.Gauge({ name: 'http_request_freeram_centoos', help: 'Ram Libre' });
const httpPorcentUsed_centoos = new client.Gauge({ name: 'http_request_porcentusedram_centoos', help: 'Porcentaje De Ram Utilizada' });
const httpPorcentCPU_centoos = new client.Gauge({ name: 'http_request_porcentcpu_centoos', help: 'Porcentaje De CPU Utilizado' });
const httpProcessNumber_centoos = new client.Gauge({ name: 'http_request_processnumber_centoos', help: 'Numero De Procesos Activos' });
// Debian
const httpTotalRam_debian = new client.Gauge({ name: 'http_request_totalram_debian', help: 'Ram Total' });
const httpUsedRam_debian = new client.Gauge({ name: 'http_request_usedram_debian', help: 'Ram Utilizada' });
const httpLibreRam_debian = new client.Gauge({ name: 'http_request_freeram_debian', help: 'Ram Libre' });
const httpPorcentUsed_debian = new client.Gauge({ name: 'http_request_porcentusedram_debian', help: 'Porcentaje De Ram Utilizada' });
const httpPorcentCPU_debian = new client.Gauge({ name: 'http_request_porcentcpu_debian', help: 'Porcentaje De CPU Utilizado' });
const httpProcessNumber_debian = new client.Gauge({ name: 'http_request_processnumber_debian', help: 'Numero De Procesos Activos' });

// Add Metrics
// Ubuntu
metrics.registerMetric(httpTotalRam);
metrics.registerMetric(httpUsedRam);
metrics.registerMetric(httpLibreRam);
metrics.registerMetric(httpPorcentUsed);
metrics.registerMetric(httpPorcentCPU);
metrics.registerMetric(httpProcessNumber);
// Centos
metrics.registerMetric(httpTotalRam_centoos);
metrics.registerMetric(httpUsedRam_centoos);
metrics.registerMetric(httpLibreRam_centoos);
metrics.registerMetric(httpPorcentUsed_centoos);
metrics.registerMetric(httpPorcentCPU_centoos);
metrics.registerMetric(httpProcessNumber_centoos);
// Debian
metrics.registerMetric(httpTotalRam_debian);
metrics.registerMetric(httpUsedRam_debian);
metrics.registerMetric(httpLibreRam_debian);
metrics.registerMetric(httpPorcentUsed_debian);
metrics.registerMetric(httpPorcentCPU_debian);
metrics.registerMetric(httpProcessNumber_debian);

// Ruta Inicial
application.get('/', (req, res)=>{ 

    res.status(200).send({ mensaje: "Servicio Monitoreo Prometheus - SOPES1 :D ", });

});

application.get('/metrics', async (req, res)=>{ 

    // Data 
    let data = "";  
    let data_centos = "";
    let data_debian = "";
  
    // Make Request Ubuntu
    await axios.get('http://34.125.26.7:3065/leer')
    .then(response => {

      data = response.data;
    
    })
    .catch(error => {

      console.log(error);
    
    });  

    // Make Request Centos
    await axios.get('http://10.182.0.7:3065/leer')
    .then(response => {

      data_centos = response.data;
    
    })
    .catch(error => {

      console.log(error);
    
    }); 

    // Make Request Debian
    await axios.get('http://10.182.0.6:3065/leer')
    .then(response => {

      data_debian = response.data;
    
    })
    .catch(error => {

      console.log(error);
    
    }); 
    
    const ramArray = data["RAM"].split(",");
    const cpuArray = data["CPU"].split(",");
    const ramArrayCentos = data_centos["RAM"].split(",");
    const cpuArrayCentos = data_centos["CPU"].split(",");
    const ramArrayDebian = data_debian["RAM"].split(",");
    const cpuArrayDebian = data_debian["CPU"].split(",");

    // Set Values 
    // Ubuntu
    httpTotalRam.set(parseInt(ramArray[0].trim()));
    httpUsedRam.set(parseInt(ramArray[1].trim()));
    httpLibreRam.set(parseInt(ramArray[2].trim()));
    httpPorcentUsed.set(parseInt(ramArray[3].trim()));
    httpPorcentCPU.set(parseInt(cpuArray[0].trim()));
    httpProcessNumber.set(parseInt(cpuArray[2].trim()));
    // Centos
    // Set Values 
    httpTotalRam_centoos.set(parseInt(ramArrayCentos[0].trim()));
    httpUsedRam_centoos.set(parseInt(ramArrayCentos[1].trim()));
    httpLibreRam_centoos.set(parseInt(ramArrayCentos[2].trim()));
    httpPorcentUsed_centoos.set(parseInt(ramArrayCentos[3].trim()));
    httpPorcentCPU_centoos.set(parseInt(cpuArrayCentos[0].trim()));
    httpProcessNumber_centoos.set(parseInt(cpuArrayCentos[2].trim()));
    // Debian
    // Set Values 
    httpTotalRam_debian.set(parseInt(ramArrayDebian[0].trim()));
    httpUsedRam_debian.set(parseInt(ramArrayDebian[1].trim()));
    httpLibreRam_debian.set(parseInt(ramArrayDebian[2].trim()));
    httpPorcentUsed_debian.set(parseInt(ramArrayDebian[3].trim()));
    httpPorcentCPU_debian.set(parseInt(cpuArrayDebian[0].trim()));
    httpProcessNumber_debian.set(parseInt(cpuArrayDebian[2].trim()));

  
    // Send Response
    res.setHeader('Content-Type', metrics.contentType);
    res.end(await metrics.metrics());

});

application.listen(9099, () => {

    // Server Up
    console.log(`Service Is Running At ${9099} :D`);

}); 