const mysql = require('mysql');
const db = require('./database')
const MySQLEvents = require('@rodrigogs/mysql-events');
import express from 'express'
var cors = require('cors')
import { Server as WebSocketServer, Socket } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv';
dotenv.config();
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

    db.query(
        'SELECT count(*) FROM TWEET',
        function (err, result) {
            io.emit('totalNoticias', result)
        }
    );

    db.query(
        `SELECT count(*) FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag
        FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
        ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1
        group by hashtag) AS ListaHashtags`,
        function (err, result) {
            io.emit('totalHashtags', result)
        }
    );

    db.query(
        `SELECT SUM(upvotes) AS TotalUpvotes from TWEET`,
        function (err, result) {
            io.emit('totalUpvotes', result)
        }
    );

    db.query(
        `SELECT SUM(upvotes) AS TotalUpvotes 
        FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes
        FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
        ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags`,
        function (err, results) {
            io.emit('totalUpvotesv2', results)
        }
    );

    db.query(
        `SELECT SUM(upvotes) AS TotalUpvotes, hashtag
        FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes
        FROM (SELECT 1 n UNION ALL SELECT 2
        UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
        ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags
        GROUP BY hashtag ORDER BY upvotes DESC LIMIT 5`,
        function (err, results) {
            io.emit('top5Hashtags', results)
        }
    );

    db.query(
        `SELECT fecha, sum(upvotes) AS upvotes, sum(downvotes) AS downvotes
        FROM (SELECT DATE_FORMAT(fecha, '%e/%m/%Y') AS fecha, upvotes, downvotes
        FROM (SELECT upvotes, downvotes, STR_TO_DATE(fecha, '%e/%m/%Y') AS fecha FROM tweet) AS FechaConvertida) 
        AS FechasFormateadas GROUP BY  fecha`,
        function (err, results) {
            io.emit('reporteDiario', results)
        }
    );  
})


const program = async () => {
    const connection = mysql.createConnection({
        host: process.env.CLOUDSQL_HOST,
        user: process.env.CLOUDSQL_USER,
        password: process.env.CLOUDSQL_PASS,
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