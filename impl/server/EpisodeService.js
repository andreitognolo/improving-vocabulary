exports.nextTranscription = function() {
	return {
		done : function(callback) {
			require('./MongoHelper').connect(function(db) {
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

exports.sync = function() {
	var fs = require("fs");
	
	return {
		done : function(callback) {
			fs.readdir('img/calvin-hobbes', function(err, files) {
				if (err) {
					console.log('Erro: ' + err);
					throw 'Error: ' + err;
				}
				
				files = files.map(function(value) {
					return parseInt(value.replace('.gif', ''));
				});

				var mongoHelper=require('./MongoHelper');
				files.forEach(function(value) {
					mongoHelper.connect(function(db) {
						var episodes = db.collection('episodes');
						episodes.update({'id': value}, {$set:{'id': value}}, {upsert:true, w: 1}, function(err, result) {
							if (err) {
								throw err;
							}
							
							console.log('UPDATE: ' + value + ' - result: ' + result);
							db.close();
						});
					});
				});
				
				callback();
			});
		}
	}
}
