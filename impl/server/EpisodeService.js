exports.next = function(data) {
	return {
		done : function(callback) {
			require('./MongoHelper').connect(function(db) {
				var episodes = db.collection('episodes');
				episodes.find({id:{$gt:parseInt(data.previousEpisodeId)}}).sort({id:1}).toArray(function(err, result) {
					callback(JSON.stringify(result[0]));
					db.close();
				});
			});
		}
	}
}

exports.nextTranscription = function() {
	return {
		done : function(callback) {
			require('./MongoHelper').connect(function(db) {
				var collection = db.collection('episodes');
				collection.find({transcription: {$ne: true}}).toArray(function(err, results) {
					console.log('nextTranscription', results[0].id.toString());
					callback(results[0].id.toString());
					db.close();
				});
			});
		}
	}
}

exports.saveTranscription = function(episode) {
	return {
		done: function(callback) {
			console.log('saveTranscription', episode.id);
			require('./MongoHelper').connect(function(db) {
				var episodes = db.collection('episodes');
				episodes.update({id: episode.id}, {$set:{transcripted: true, sentences: episode.sentences}}, function() {
					callback();
				});
			});
		}
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