// Const And Variables
const http = require('http')
const url = require('url')

// Cliente Prometeus
const client = require('prom-client');

// Add Metrics
const metrics = new client.Registry();

// Label To Metrics
metrics.setDefaultLabels({

  app: 'Módulo De Monitoreo'

});

// Default Metrics
client.collectDefaultMetrics({ metrics });

// Create Server
const application = http.createServer(async (req, res) => {

  // Obtain endpoint
  const endpoint = url.parse(req.url).pathname;

  // Check EndPoint
  if (endpoint === '/metricas') {

    // Obtain Type Metrics
    res.setHeader('Content-Type', metrics.contentType);

    // Send Metrics
    res.end(metrics.metrics());
  
  } else if(endpoint === '/') {

    // Send Saludo
    res.send({"mensaje": "Servicio Monitoreo En Grafana Y Prometheus - SOPES1 :D "})

  }

});

// Start Server
application.listen(9099, () => {

  console.log(`Service is running at 9099! :D`);  

});