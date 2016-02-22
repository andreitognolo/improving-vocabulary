var DOMAIN_DIR = './domain/';
var DomainUtil = require('./util/DomainUtil');


function newEntityClass(entityClass) {
  return require(DOMAIN_DIR + entityClass)['new' + entityClass]();
}

function convertArrayToEntity(result, entityClass) {
  if (!result) {
    return [];
  }
  var array = [];
  for (var i = 0; i < result.length; i++) {
    var newEntity = newEntityClass(entityClass);
    for (var property in result[i]) {
      newEntity[property] = result[i][property];
    }
    array.push(newEntity);
  }
  return array;
}

exports.put = function (entity) {
  if (!entity.collection) {
    throw 'The entity doesnt have property with name "collection". Entity constructor: ' + entity.constructor.toString();
  }

  return {
    done: function (callback) {
      var set = {};
      var properties = DomainUtil.listProperties(entity);
      properties.forEach(function (property) {
        set[property] = entity[property];
      });

      var db = require('./MongoHelper').db;
      var collection = db.collection(entity.collection);
      collection.update({
        id: entity.id
      }, {
        $set: set
      }, {
        upsert: true,
        w: 1
      }, function () {
        callback();
      });
    }
  }
}


exports.query = function (entityClass) {
  var done = function (callback) {
    var mongoHelper = require('./MongoHelper');
    var db = mongoHelper.db;
    var collectionName = DomainUtil.collectionsName(entityClass);
    var col = db.collection(collectionName);
    var cursor = col.find(opts.query);

    if (opts.sort) {
      cursor = cursor.sort(opts.querySort);
    }

    cursor.toArray(function (err, result) {
      var array = convertArrayToEntity(result, entityClass);
      callback(array);
    });
  }

  var sort = function (s) {
    opts.querySort = s;
    return opts;
  }

  var opts = {
    done: done,
    sort: sort
  }

  return {
    find: function (q) {
      opts.query = q;
      return opts;
    }
  };
}

exports.findById = function (entityClass, id) {

  var mongoHelper = require('./MongoHelper');
  var collectionName = DomainUtil.collectionsName(entityClass);

  return {
    done: function (callback) {
      var db = mongoHelper.db;
      var collection = db.collection(collectionName);
      var params = {};
      params.id = id;
      collection.find(params).sort({id: 1}).toArray(function (err, result) {
        var array = convertArrayToEntity(result, entityClass);
        callback(array[0]);
      });
    }
  }
}