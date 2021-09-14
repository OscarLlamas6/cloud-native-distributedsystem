const mysql = require('mysql');
const db = require('./database')
const MySQLEvents = require('@rodrigogs/mysql-events');
import express from 'express'
var cors = require('cors')
import { Server as WebSocketServer, Socket } from 'socket.io'
import http from 'http'

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new WebSocketServer(server, { cors: { origin: '*' } })


io.on('connection', (socket) => {

    socket.on('conectado', () => {
        console.log('nueva conexion', socket.id)
    })

    db.query(
        'SELECT * FROM TWEET',
        function (err, results) {
            io.emit('insersionInicial', results)
        }
    );

    //socket.emit('insersion')
})






const program = async () => {
    const connection = mysql.createConnection({
        host: '34.69.19.145',
        user: 'root',
        password: '1234',
    });

    const instance = new MySQLEvents(connection, {
        startAtEnd: true,
        excludedSchemas: {
            mysql: true,
        },
    });

    await instance.start();

    instance.addTrigger({
        name: 'TEST',
        expression: '*',
        statement: MySQLEvents.STATEMENTS.INSERT,
        onEvent: (event) => { // You will receive the events here
            console.log(event);
            db.query(
                'SELECT * FROM TWEET',
                function (err, results) {
                    io.emit('insersion', results)
                }
            );

        },
    });


    instance.addTrigger({
        name: 'TEST',
        expression: '*',
        statement: MySQLEvents.STATEMENTS.DELETE,
        onEvent: (event) => { // You will receive the events here
            console.log(event);
            db.query(
                'SELECT * FROM TWEET',
                function (err, results) {
                    io.emit('insersion', results)
                }
            );

        },
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);
















server.listen(3001)

console.log('Server on port', 3001)