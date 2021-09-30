import dotenv from 'dotenv';
dotenv.config();
const { allTweets, countTweets, countHashTags, countUpvotes, upvotesVSdownvotes, topHashtags, recentPosts } = require('./mongoDatabase')
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


/* -------------------- IMPORTS PUBSUB -------------------- */
let credentials_path = 'pubsub.privatekey.json';
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path;
const subscriptionName = 'projects/sopes-proyecto1-324500/subscriptions/sopes-sub';;
const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const myMessages = [];
let messageCount = 0;
/* -------------------------------------------------------- */



let val = false;

io.on('connection', (socket) => {

    socket.on('conectado', () => {
        console.log('nueva conexion', socket.id)
    })

    socket.on('cambio', (data) => {
        console.log('cambio de base', data)
        val = data
        if (!val) GCPemits()
        else CDBMemits()
    })

    if (!val) GCPemits()
    else CDBMemits()

})

//Cosmosdb mongo emits
const CDBMemits = async () => {

    const alltweets = await allTweets()

    const counttweets = await countTweets()

    const counthashtags = await countHashTags()

    const countupvotes = await countUpvotes()

    const upvotesvsdownvotes = await upvotesVSdownvotes()

    const tophashtags = await topHashtags()

    const recentposts = await recentPosts()

    io.emit('datamongo', { alltweets: alltweets, counttweets: counttweets, counthashtags: counthashtags, countupvotes: countupvotes, upvotesvsdownvotes: upvotesvsdownvotes, tophashtags: tophashtags, recentposts: recentposts })

    io.emit('val', val)
}

const GCPemits = async () => {

    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: '34.69.19.145', user: 'root', database: 'SOPES1', password: '1234' });

    const [alltweets, alltweetsf] = await connection.execute('SELECT * FROM TWEET', []);

    const [counttweets, counttweetsf] = await connection.execute('SELECT count(*) as count FROM TWEET', []);

    const [counthashtags, counthashtagsf] = await connection.execute(`SELECT count(*) as count FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag
    FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
    ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1
    group by hashtag) AS ListaHashtags`, []);

    const [countupvotes, countupvotesf] = await connection.execute(`SELECT SUM(upvotes) AS count from TWEET`, []);

    const [upvotesvsdownvotes, upvotesvsdownvotesf] = await connection.execute(`SELECT fecha, sum(upvotes) AS upvotes, sum(downvotes) AS downvotes
    FROM (SELECT DATE_FORMAT(fecha, '%e/%m/%Y') AS fecha, upvotes, downvotes
    FROM (SELECT upvotes, downvotes, STR_TO_DATE(fecha, '%e/%m/%Y') AS fecha FROM TWEET) AS FechaConvertida) 
    AS FechasFormateadas GROUP BY  fecha`, []);

    const [tophashtags, tophashtagsf] = await connection.execute(`SELECT SUM(upvotes) AS TotalUpvotes, hashtag
    FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes
    FROM (SELECT 1 n UNION ALL SELECT 2
    UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
    ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags
    GROUP BY hashtag ORDER BY TotalUpvotes desc LIMIT 5`, []);

    const [recentposts, recentpostsf] = await connection.execute('select * from TWEET order by idTweet desc LIMIT 5', []);


    io.emit('datamysql', { alltweets: alltweets, counttweets: counttweets, counthashtags: counthashtags, countupvotes: countupvotes, upvotesvsdownvotes: upvotesvsdownvotes, tophashtags: tophashtags, recentposts: recentposts })

    io.emit('val', val)
}

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

            if (!val) GCPemits()
            else CDBMemits()

        },
    });

    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

const pubsub = async () => {

    console.log("Listening for messages :)")
    const subscription = pubSubClient.subscription(subscriptionName);
    const messageHandler = message => {
        let msj = message;
        myMessages.push(msj)

        console.log(`Received message: id ${msj.id}`);
        console.log(`Data: ${msj.data}`);
        console.log(`Attributes: ${JSON.stringify(msj.attributes, null, 2)}`);
        messageCount += 1;
        message.ack();
    };
    console.log(`${messageCount} message(s) received.`);
    subscription.on('message', (message) => {
        messageHandler(message)
        //io.emit('notificaciones', myMessages);
    })

    process.on('SIGINT', function () {
        subscription.removeListener('message', messageHandler);
        console.log(`${messageCount} message(s) received.`);
        process.exit();
    });


}

program()
    .then(() => console.log('Waiting for database events...'))
    .catch(console.error);

pubsub()
    .then(() => console.log('Waiting for Pub/Sub notifications...'))
    .catch(console.error);

server.listen(8080)
console.log('Server on port', 8080)

/*
db.query(
    `SELECT SUM(upvotes) AS TotalUpvotes
    FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes
    FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
    ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags`,
    function (err, results) {
        io.emit('totalUpvotesv2', results)
    }
);

//Google cloud emits
const GCPemits2 = () => {

    db.query(
        'SELECT * FROM TWEET',
        function (err, results) {
            io.emit('insercion', results)
        }
    );

    db.query(
        'SELECT count(*) as count FROM TWEET',
        function (err, result) {
            io.emit('totalNoticias', result)
        }
    );

    db.query(
        `SELECT count(*) as count FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag
        FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
        ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1
        group by hashtag) AS ListaHashtags`,
        function (err, result) {
            io.emit('totalHashtags', result)
        }
    );

    db.query(
        `SELECT SUM(upvotes) AS count from TWEET`,
        function (err, result) {
            io.emit('totalUpvotes', result)
        }
    );

    db.query(
        `SELECT fecha, sum(upvotes) AS upvotes, sum(downvotes) AS downvotes
        FROM (SELECT DATE_FORMAT(fecha, '%e/%m/%Y') AS fecha, upvotes, downvotes
        FROM (SELECT upvotes, downvotes, STR_TO_DATE(fecha, '%e/%m/%Y') AS fecha FROM TWEET) AS FechaConvertida)
        AS FechasFormateadas GROUP BY  fecha`,
        function (err, results) {
            io.emit('reporteDiario', results)
        }
    );

    db.query(
        `SELECT SUM(upvotes) AS TotalUpvotes, hashtag
        FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes
        FROM (SELECT 1 n UNION ALL SELECT 2
        UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET
        ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags
        GROUP BY hashtag ORDER BY TotalUpvotes desc LIMIT 5`,
        function (err, results) {
            io.emit('topHashtags', results)
        }
    );

    db.query(
        `select * from TWEET order by idTweet desc LIMIT 5`,
        function (err, results) {
            io.emit('recentPosts', results)
        }
    );

}

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

*/