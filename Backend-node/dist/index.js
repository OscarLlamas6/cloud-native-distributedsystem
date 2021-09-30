"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _socket = require("socket.io");

var _http = _interopRequireDefault(require("http"));

_dotenv["default"].config();

var _require = require('./mongoDatabase'),
    allTweets = _require.allTweets,
    countTweets = _require.countTweets,
    countHashTags = _require.countHashTags,
    countUpvotes = _require.countUpvotes,
    upvotesVSdownvotes = _require.upvotesVSdownvotes,
    topHashtags = _require.topHashtags,
    recentPosts = _require.recentPosts;

var mysql = require('mysql');

var db = require('./database');

var MySQLEvents = require('@rodrigogs/mysql-events');

var cors = require('cors');

var app = (0, _express["default"])();
app.use(cors());

var server = _http["default"].createServer(app);

var io = new _socket.Server(server, {
  cors: {
    origin: '*'
  }
});
/* -------------------- IMPORTS PUBSUB -------------------- */

var credentials_path = 'pubsub.privatekey.json';
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path;
var subscriptionName = 'projects/sopes-proyecto1-324500/subscriptions/sopes-sub';
;

var _require2 = require('@google-cloud/pubsub'),
    PubSub = _require2.PubSub;

var pubSubClient = new PubSub();
var myMessages = [];
var messageCount = 0;
/* -------------------------------------------------------- */

var val = false;
io.on('connection', function (socket) {
  socket.on('conectado', function () {
    console.log('nueva conexion', socket.id);
  });
  socket.on('cambio', function (data) {
    console.log('cambio de base', data);
    val = data;
    if (!val) GCPemits();else CDBMemits();
  });
  if (!val) GCPemits();else CDBMemits();
}); //Cosmosdb mongo emits

var CDBMemits = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var alltweets, counttweets, counthashtags, countupvotes, upvotesvsdownvotes, tophashtags, recentposts;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return allTweets();

          case 2:
            alltweets = _context.sent;
            _context.next = 5;
            return countTweets();

          case 5:
            counttweets = _context.sent;
            _context.next = 8;
            return countHashTags();

          case 8:
            counthashtags = _context.sent;
            _context.next = 11;
            return countUpvotes();

          case 11:
            countupvotes = _context.sent;
            _context.next = 14;
            return upvotesVSdownvotes();

          case 14:
            upvotesvsdownvotes = _context.sent;
            _context.next = 17;
            return topHashtags();

          case 17:
            tophashtags = _context.sent;
            _context.next = 20;
            return recentPosts();

          case 20:
            recentposts = _context.sent;
            io.emit('datamongo', {
              alltweets: alltweets,
              counttweets: counttweets,
              counthashtags: counthashtags,
              countupvotes: countupvotes,
              upvotesvsdownvotes: upvotesvsdownvotes,
              tophashtags: tophashtags,
              recentposts: recentposts
            });
            io.emit('val', val);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function CDBMemits() {
    return _ref.apply(this, arguments);
  };
}();

var GCPemits = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var mysql, connection, _yield$connection$exe, _yield$connection$exe2, alltweets, alltweetsf, _yield$connection$exe3, _yield$connection$exe4, counttweets, counttweetsf, _yield$connection$exe5, _yield$connection$exe6, counthashtags, counthashtagsf, _yield$connection$exe7, _yield$connection$exe8, countupvotes, countupvotesf, _yield$connection$exe9, _yield$connection$exe10, upvotesvsdownvotes, upvotesvsdownvotesf, _yield$connection$exe11, _yield$connection$exe12, tophashtags, tophashtagsf, _yield$connection$exe13, _yield$connection$exe14, recentposts, recentpostsf;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mysql = require('mysql2/promise');
            _context2.next = 3;
            return mysql.createConnection({
              host: '34.69.19.145',
              user: 'root',
              database: 'SOPES1',
              password: '1234'
            });

          case 3:
            connection = _context2.sent;
            _context2.next = 6;
            return connection.execute('SELECT * FROM TWEET', []);

          case 6:
            _yield$connection$exe = _context2.sent;
            _yield$connection$exe2 = (0, _slicedToArray2["default"])(_yield$connection$exe, 2);
            alltweets = _yield$connection$exe2[0];
            alltweetsf = _yield$connection$exe2[1];
            _context2.next = 12;
            return connection.execute('SELECT count(*) as count FROM TWEET', []);

          case 12:
            _yield$connection$exe3 = _context2.sent;
            _yield$connection$exe4 = (0, _slicedToArray2["default"])(_yield$connection$exe3, 2);
            counttweets = _yield$connection$exe4[0];
            counttweetsf = _yield$connection$exe4[1];
            _context2.next = 18;
            return connection.execute("SELECT count(*) as count FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag\n    FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET\n    ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1\n    group by hashtag) AS ListaHashtags", []);

          case 18:
            _yield$connection$exe5 = _context2.sent;
            _yield$connection$exe6 = (0, _slicedToArray2["default"])(_yield$connection$exe5, 2);
            counthashtags = _yield$connection$exe6[0];
            counthashtagsf = _yield$connection$exe6[1];
            _context2.next = 24;
            return connection.execute("SELECT SUM(upvotes) AS count from TWEET", []);

          case 24:
            _yield$connection$exe7 = _context2.sent;
            _yield$connection$exe8 = (0, _slicedToArray2["default"])(_yield$connection$exe7, 2);
            countupvotes = _yield$connection$exe8[0];
            countupvotesf = _yield$connection$exe8[1];
            _context2.next = 30;
            return connection.execute("SELECT fecha, sum(upvotes) AS upvotes, sum(downvotes) AS downvotes\n    FROM (SELECT DATE_FORMAT(fecha, '%e/%m/%Y') AS fecha, upvotes, downvotes\n    FROM (SELECT upvotes, downvotes, STR_TO_DATE(fecha, '%e/%m/%Y') AS fecha FROM TWEET) AS FechaConvertida) \n    AS FechasFormateadas GROUP BY  fecha", []);

          case 30:
            _yield$connection$exe9 = _context2.sent;
            _yield$connection$exe10 = (0, _slicedToArray2["default"])(_yield$connection$exe9, 2);
            upvotesvsdownvotes = _yield$connection$exe10[0];
            upvotesvsdownvotesf = _yield$connection$exe10[1];
            _context2.next = 36;
            return connection.execute("SELECT SUM(upvotes) AS TotalUpvotes, hashtag\n    FROM (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(hashtags, ',', numbers.n), ',', -1) hashtag, upvotes\n    FROM (SELECT 1 n UNION ALL SELECT 2\n    UNION ALL SELECT 3 UNION ALL SELECT 4) numbers INNER JOIN TWEET\n    ON CHAR_LENGTH(hashtags) -CHAR_LENGTH(REPLACE(hashtags, ',', ''))>=numbers.n-1) AS ListaHashtags\n    GROUP BY hashtag ORDER BY TotalUpvotes desc LIMIT 5", []);

          case 36:
            _yield$connection$exe11 = _context2.sent;
            _yield$connection$exe12 = (0, _slicedToArray2["default"])(_yield$connection$exe11, 2);
            tophashtags = _yield$connection$exe12[0];
            tophashtagsf = _yield$connection$exe12[1];
            _context2.next = 42;
            return connection.execute('select * from TWEET order by idTweet desc LIMIT 5', []);

          case 42:
            _yield$connection$exe13 = _context2.sent;
            _yield$connection$exe14 = (0, _slicedToArray2["default"])(_yield$connection$exe13, 2);
            recentposts = _yield$connection$exe14[0];
            recentpostsf = _yield$connection$exe14[1];
            io.emit('datamysql', {
              alltweets: alltweets,
              counttweets: counttweets,
              counthashtags: counthashtags,
              countupvotes: countupvotes,
              upvotesvsdownvotes: upvotesvsdownvotes,
              tophashtags: tophashtags,
              recentposts: recentposts
            });
            io.emit('val', val);

          case 48:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function GCPemits() {
    return _ref2.apply(this, arguments);
  };
}();

var program = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var connection, instance;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            connection = mysql.createConnection({
              host: '34.69.19.145',
              user: 'root',
              password: '1234'
            });
            instance = new MySQLEvents(connection, {
              startAtEnd: true,
              excludedSchemas: {
                mysql: true
              }
            });
            _context3.next = 4;
            return instance.start();

          case 4:
            instance.addTrigger({
              name: 'TEST',
              expression: '*',
              statement: MySQLEvents.STATEMENTS.INSERT,
              onEvent: function onEvent(event) {
                // You will receive the events here
                console.log(event);
                if (!val) GCPemits();else CDBMemits();
              }
            });
            instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
            instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function program() {
    return _ref3.apply(this, arguments);
  };
}();

var pubsub = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var subscription, messageHandler;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log("Listening for messages :)");
            subscription = pubSubClient.subscription(subscriptionName);

            messageHandler = function messageHandler(message) {
              var msj = message;
              myMessages.push(msj);
              console.log("Received message: id ".concat(msj.id));
              console.log("Data: ".concat(msj.data));
              console.log("Attributes: ".concat(JSON.stringify(msj.attributes, null, 2)));
              messageCount += 1;
              message.ack();
            };

            console.log("".concat(messageCount, " message(s) received."));
            subscription.on('message', function (message) {
              messageHandler(message); //io.emit('notificaciones', myMessages);
            });
            process.on('SIGINT', function () {
              subscription.removeListener('message', messageHandler);
              console.log("".concat(messageCount, " message(s) received."));
              process.exit();
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function pubsub() {
    return _ref4.apply(this, arguments);
  };
}();

program().then(function () {
  return console.log('Waiting for database events...');
})["catch"](console.error);
pubsub().then(function () {
  return console.log('Waiting for Pub/Sub notifications...');
})["catch"](console.error);
server.listen(8080);
console.log('Server on port', 8080);
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