function init(cb) {
  connect(function (database) {
    exports.db = database;
    cb();
  });
}

function connect(cb) {
  var MongoClient = require('mongodb').MongoClient;
  var DatabaseConfiguration = require('./util/DatabaseConfiguration');
  var mongoURL = DatabaseConfiguration.mongoURL();

  MongoClient.connect(mongoURL, function (err, db) {
    if (err)
      throw err;

    cb(db);
  });
}

function reset(cb) {
  var col = [];
  var fs = require("fs");

  fs.readdir('./server/domain', function (err, files) {
    if (err) {
      throw 'Error: ' + err;
    }
    var domainUtil = require('./util/DomainUtil');
    var collections = [];
    for (var i = 0; i < files.length; i++) {
      var domainName = files[i].replace(".js", "");
      var collectionName = domainUtil.collectionsName(domainName);
      collections.push(collectionName);
    }

    connect(function (db) {
      function removeDb(i, db) {
        return function () {
          if (i >= collections.length) {
            cb();
            db.close();
            return;
          }
          db.collection(collections[i]).remove(removeDb(i + 1, db));
        }
      }

      removeDb(0, db)();
    });

  });
}

exports.init = init;
exports.connect = connect;
exports.reset = reset;