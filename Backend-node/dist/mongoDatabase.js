"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recentPosts = exports.topHashtags = exports.upvotesVSdownvotes = exports.countUpvotes = exports.countHashTags = exports.countTweets = exports.allTweets = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var URI = 'mongodb://c2b8acdc-0ee0-4-231-b9ee:AaFFzNdgLk6rFKnGYj5h1wTouCPw5CbSvR6wPr9PkWVbwuH02kj9PDWPYR3BsMwbORhrN9rGBqJ1rr9xhpOWqw==@c2b8acdc-0ee0-4-231-b9ee.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@c2b8acdc-0ee0-4-231-b9ee@';

var MongoClient = require('mongodb').MongoClient;

function collection() {
  return _collection.apply(this, arguments);
}

function _collection() {
  _collection = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var connection;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return MongoClient.connect(URI);

          case 3:
            connection = _context8.sent.db("SOPES1").collection("TWEET");
            console.log('Mongo db is connected');
            return _context8.abrupt("return", connection);

          case 8:
            _context8.prev = 8;
            _context8.t0 = _context8["catch"](0);
            return _context8.abrupt("return", null);

          case 11:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 8]]);
  }));
  return _collection.apply(this, arguments);
}

var allTweets = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var tweets, allTweets;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return collection();

          case 2:
            tweets = _context.sent;
            _context.next = 5;
            return tweets.find({}).toArray();

          case 5:
            allTweets = _context.sent;
            return _context.abrupt("return", allTweets);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function allTweets() {
    return _ref.apply(this, arguments);
  };
}(); //allTweets()


exports.allTweets = allTweets;

var countTweets = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var tweets, count;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return collection();

          case 2:
            tweets = _context2.sent;
            _context2.next = 5;
            return tweets.count({});

          case 5:
            count = _context2.sent;
            return _context2.abrupt("return", count);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function countTweets() {
    return _ref2.apply(this, arguments);
  };
}(); //countTweets()


exports.countTweets = countTweets;

var countHashTags = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var arra, tweets, allTweets, _iterator, _step, tweet, _iterator2, _step2, iterator, arrb;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            arra = [];
            _context3.next = 3;
            return collection();

          case 3:
            tweets = _context3.sent;
            _context3.next = 6;
            return tweets.find({}).toArray();

          case 6:
            allTweets = _context3.sent;
            _iterator = _createForOfIteratorHelper(allTweets);

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                tweet = _step.value;

                if (tweet.hashtags !== null && tweet.hashtags !== undefined && Array.isArray(tweet.hashtags)) {
                  _iterator2 = _createForOfIteratorHelper(tweet.hashtags);

                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      iterator = _step2.value;
                      arra.push(iterator);
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }

            arrb = new Set(arra); //console.log(arrb.size)

            return _context3.abrupt("return", arrb.size);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function countHashTags() {
    return _ref3.apply(this, arguments);
  };
}(); //countHashTags()


exports.countHashTags = countHashTags;

var countUpvotes = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var count, tweets, allTweets, _iterator3, _step3, element;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            count = 0;
            _context4.next = 3;
            return collection();

          case 3:
            tweets = _context4.sent;
            _context4.next = 6;
            return tweets.find({}).toArray();

          case 6:
            allTweets = _context4.sent;
            _iterator3 = _createForOfIteratorHelper(allTweets);

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                element = _step3.value;

                if (element.upvotes !== null && element.upvotes !== undefined && !isNaN(element.upvotes)) {
                  //console.log(parseInt(element.upvotes))
                  count += parseInt(element.upvotes);
                }
              } //console.log('Conteo de votos', count)

            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            return _context4.abrupt("return", count);

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function countUpvotes() {
    return _ref4.apply(this, arguments);
  };
}(); //countUpvotes()


exports.countUpvotes = countUpvotes;

var upvotesVSdownvotes = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var up_array, down_array, tweets, allTweets, _iterator4, _step4, element, arreglo;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            up_array = {};
            down_array = {};
            _context5.next = 4;
            return collection();

          case 4:
            tweets = _context5.sent;
            _context5.next = 7;
            return tweets.find({}).toArray();

          case 7:
            allTweets = _context5.sent;
            _iterator4 = _createForOfIteratorHelper(allTweets);

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                element = _step4.value;

                if (element.upvotes !== null && element.upvotes !== undefined && !isNaN(element.upvotes) && element.fecha !== '') {
                  if (up_array[element.fecha] === undefined || up_array[element.fecha] === null) up_array[element.fecha] = parseInt(element.upvotes);else up_array[element.fecha] += parseInt(element.upvotes);
                }

                if (element.downvotes !== null && element.downvotes !== undefined && !isNaN(element.downvotes) && element.fecha !== '') {
                  if (down_array[element.fecha] === undefined || down_array[element.fecha] === null) down_array[element.fecha] = parseInt(element.downvotes);else down_array[element.fecha] += parseInt(element.downvotes);
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }

            arreglo = [up_array, down_array]; //console.log(arreglo)

            return _context5.abrupt("return", arreglo);

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function upvotesVSdownvotes() {
    return _ref5.apply(this, arguments);
  };
}(); //upvotesVSdownvotes()


exports.upvotesVSdownvotes = upvotesVSdownvotes;

var topHashtags = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var arr, tweets, allTweets, _iterator5, _step5, tweet, _iterator6, _step6, iterator, sortable;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            arr = {};
            _context6.next = 3;
            return collection();

          case 3:
            tweets = _context6.sent;
            _context6.next = 6;
            return tweets.find({}).toArray();

          case 6:
            allTweets = _context6.sent;
            _iterator5 = _createForOfIteratorHelper(allTweets);

            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                tweet = _step5.value;

                if (tweet.hashtags !== null && tweet.hashtags !== undefined && Array.isArray(tweet.hashtags)) {
                  _iterator6 = _createForOfIteratorHelper(tweet.hashtags);

                  try {
                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                      iterator = _step6.value;

                      if (tweet.upvotes !== null && tweet.upvotes !== undefined && !isNaN(tweet.upvotes)) {
                        if (arr[iterator] === undefined || arr[iterator] === null) arr[iterator] = parseInt(tweet.upvotes);else arr[iterator] += parseInt(tweet.upvotes);
                      }
                    }
                  } catch (err) {
                    _iterator6.e(err);
                  } finally {
                    _iterator6.f();
                  }
                }
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }

            sortable = Object.fromEntries(Object.entries(arr).sort(function (_ref7, _ref8) {
              var _ref9 = (0, _slicedToArray2["default"])(_ref7, 2),
                  a = _ref9[1];

              var _ref10 = (0, _slicedToArray2["default"])(_ref8, 2),
                  b = _ref10[1];

              return b - a;
            })); //console.log(sortable);

            return _context6.abrupt("return", sortable);

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function topHashtags() {
    return _ref6.apply(this, arguments);
  };
}();

exports.topHashtags = topHashtags;

var recentPosts = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var tweets, count, allTweets;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return collection();

          case 2:
            tweets = _context7.sent;
            _context7.next = 5;
            return tweets.count({});

          case 5:
            count = _context7.sent;
            _context7.next = 8;
            return tweets.find({}).skip(count > 5 ? count - 5 : 0).limit(5).toArray();

          case 8:
            allTweets = _context7.sent;
            return _context7.abrupt("return", allTweets);

          case 10:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function recentPosts() {
    return _ref11.apply(this, arguments);
  };
}(); //topHashtags()

/*
tweets.find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
    });

MongoClient.connect(URI, function (err, db) {
    if (err) throw err;
    var dbo = db.db("SOPES1");
    dbo.collection("TWEET").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});

*/


exports.recentPosts = recentPosts;