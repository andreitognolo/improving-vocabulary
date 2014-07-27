var DOMAIN_DIR = './domain/';
var entitiesMap = {
	'EntityTest': 'EntityTest'
}

exports.put = function(entity) {
	if (!entity.collection) {
		throw 'The entity doesnt have property with name "collection". Entity constructor: ' + entity.constructor.toString();
	}
	
	return {
		done: function(callback) {
			require('./MongoHelper').connect(function(db) {
				var collection = db.collection(entity.collection);
				collection.update({
					id : entity.id
				}, {
					$set : {
						transcripted : entity.transcripted
					}
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

exports.findById = function(collectionName, id) {
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
					
					var entityClass = entitiesMap[collectionName];
					var newEntity	 = require(DOMAIN_DIR + entityClass)['new' + entityClass]();

					newEntity.id = resultFromMongo.id;
					
					callback(newEntity);
					db.close();
				});
			});
		}
	}
}