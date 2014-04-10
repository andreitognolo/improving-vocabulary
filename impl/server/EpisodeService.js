exports.nextTranscription = function() {
	return {
		done : function(callback) {
			var MongoClient = require('mongodb').MongoClient
			var format = require('util').format;

			MongoClient.connect('mongodb://127.0.0.1:27017/improving-vocabulary', function(err, db) {
				if (err)
					throw err;

				var collection = db.collection('episodes');
				collection.find().toArray(function(err, results) {
					callback(results[0].id);
					db.close();
				});
			});
		}
	}
}

exports.save = function(json) {
	for (i = 0; i < json.length; i++) {
		var el = json[i];
		console.log(el.character);
		console.log(el.sentence);
	}
}