var DOMAIN_DIR = './domain/';
var entityToCollectionMap = {
	'EntityTest': 'EntityTest',
	'Episode': 'episodes'
}

var DomainUtil = require('./domain/DomainUtil');

function entity(entityClass){
    // FIXME(Andrei) - We dont need this map
    var collectionName = entityToCollectionMap[entityClass];
	if (!collectionName || typeof collectionName != 'string') {
		throw "Collection must be a valid string: '" + collectionName + "'";
	}
    return collectionName;
}

function newEntityClass(entityClass){
    return require(DOMAIN_DIR + entityClass)['new' + entityClass]();
}

function convertArrayToEntity(result, entityClass){
    var array = [];
    for(var i=0; i<result.length; i++){
        var newEntity = newEntityClass(entityClass);
        for (var property in result[i]) {
          newEntity[property] = result[i][property];
        }
        array.push(newEntity);
    }
    return array;
}

exports.put = function(entity) {
	if (!entity.collection) {
		throw 'The entity doesnt have property with name "collection". Entity constructor: ' + entity.constructor.toString();
	}
	
	return {
		done: function(callback) {
			var set = {};
			var properties = DomainUtil.listProperties(entity);
			properties.forEach(function(property) {
				set[property] = entity[property];
			});
			
			require('./MongoHelper').connect(function(db) {
				var collection = db.collection(entity.collection);
				collection.update({
					id : entity.id
				}, {
					$set :set
				}, {
					upsert : true,
					w : 1
				}, function() {
					db.close();
					
					// FIXME(Andrei) - Jesus Christ! Look at this mess! (why this work?)
					require('./MongoHelper').connect(function(db2) {
						var setWords = {words: entity.words};
						var collection = db.collection(entity.collection);
						collection.update({
							id : entity.id
						}, {
							$set :setWords
						}, {
							upsert : true,
							w : 1
						}, function() {
							db2.close();
							callback();
						});
					});
				});
			});
		}
	}
}


exports.query = function(entityClass){
    return {
        find : function(query){
            return {
                done : function(callback){
                    require('./MongoHelper').connect(function(db) {
                        var collectionName = entity(entityClass);
                        var c = db.collection(collectionName);
                        c.find(query).toArray(function(err, result) {
                            var array = convertArrayToEntity(result, entityClass);
                            callback(array); 
                            db.close();
                        });
                    });
                }
            }
        }
    }
}

exports.findById = function(entityClass, id) {
	
    var collectionName = entity(entityClass);
	
	return {
		done: function(callback) {
			var mongoHelper = require('./MongoHelper');
			mongoHelper.connect(function(db) {
				var collection = db.collection(collectionName);
				var params = {};
				params.id = id;
				collection.find(params).sort({id:1}).toArray(function(err, result) {
                    var array = convertArrayToEntity(result, entityClass);
					callback(array[0]);
					db.close();
				});
			});
		}
	}
}