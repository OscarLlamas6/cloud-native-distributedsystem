const morgan = require('morgan');
const express = require('express');
const fs = require('fs')
require('dotenv').config();

var app = express();
app.use(morgan('dev'));
const port = process.env.API_MODULOS_PORT;

app.get('/', (req, res)=>{ 
    res.status(200).send({ mensaje: "Servicio módulos kernel - SOPES1 :D ", });
});

app.get('/leer', (req, res)=>{ 

    try {
        const RAMdata = fs.readFileSync('/proc/rammodule', 'utf8');
        const CPUdata = fs.readFileSync('/proc/processmodule', 'utf8');
        console.log(RAMdata, CPUdata)
        res.status(200).send({  RAM: RAMdata.toString(),
                                CPU: CPUdata.toString(),
                                mensaje: "Módulos kernel leidos exitosamente :D!" });
      } catch (err) {
        console.error(err);
        res.status(404).send({ mensaje: "Error al leer módulos kernel :(" });
      }

});

app.listen(port, () => {
    console.log(`Service is running at ${port} :D`);
});
