const morgan = require('morgan');
const express = require('express');
require('dotenv').config();

var app = express();
app.use(morgan('dev'));
const port = process.env.API_MODULOS_PORT;


app.get('/', (req, res)=>{ 
    res.status(200).send({ mensaje: "Servicio módulos kernel - SOPES1 :D ", })
});


app.listen(port, () => {
    console.log(`Service is running at ${port} :D`)
});
