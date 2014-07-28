var DOMAIN_DIR = './domain/';
var entityToCollectionMap = {
	'EntityTest': 'EntityTest',
	'Episode': 'episodes'
}

var DomainUtil = require('./domain/DomainUtil');

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
			})
			
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
					callback();
					db.close();
				});
			});
		}
	}
}

exports.findById = function(entityClass, id) {
	// FIXME(Andrei) - We dont need this map
	var collectionName = entityToCollectionMap[entityClass];
	if (!collectionName || typeof collectionName != 'string') {
		throw "Collection must be a valid string: '" + collectionName + "'";
	}
	
	return {
		done: function(callback) {
			var mongoHelper = require('./MongoHelper');
			mongoHelper.connect(function(db) {
				var collection = db.collection(collectionName);
				var params = {};
				params.id = id;
				
				collection.find(params).sort({id:1}).toArray(function(err, result) {
					// BadSmell - Is this transform really necessary?
					var resultFromMongo = JSON.parse(JSON.stringify(result))[0];
					
					var newEntity	 = require(DOMAIN_DIR + entityClass)['new' + entityClass]();

					for (property in resultFromMongo) {
						newEntity[property] = resultFromMongo[property];
					}
					
					callback(newEntity);
					db.close();
				});
			});
		}
	}
}