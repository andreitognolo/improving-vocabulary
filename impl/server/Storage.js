exports.put = function(entity) {
	if (!entity.collection) {
		throw 'The entity doesnt have property with name "collection". Entity constructor: ' + entity.constructor.toString();
	}
	
	return {
		done: function(callback) {
			/*require('./MongoHelper').connect(function(db) {
				var episodes = db.collection('episodes');
				episodes.update({id: episode.id}, {$set:{transcripted: episode.transcripted}}, {upsert:true, w: 1}, function() {
					callback();
					db.close();
				});
			});*/
		}
	}
}