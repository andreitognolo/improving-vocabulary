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
				collection.find({transcripted: {$ne: true}}).toArray(function(err, results) {
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
			require('./MongoHelper').connect(function(db) {
				var episodes = db.collection('episodes');
				episodes.update({id: parseInt(episode.id)}, {$set:{transcripted: true, sentences: episode.sentences}}, function() {
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

				exports.syncFiles(files, callback);
			});
		}
	}
}

exports.syncFiles = function(files, callback) {
	var Storage = require('./Storage');
	var mongoHelper = require('./MongoHelper');
	var Episode = require('./domain/Episode');
	var count = 0;
	files.forEach(function(value) {
		Storage.findById('Episode', value).done(function(episode) {
			var year = parseInt(value.toString().substring(0, 4));	
			if (!episode) {
				episode = Episode.newEpisode();
			}
			
			episode.id = value;
			episode.year = year;
			Storage.put(episode).done(function(result) {
				console.log('UPDATE: ' + value + ' - result: ' + result);
				count++;
				
				if (count == files.length) {
					callback('UPDATING: ' + files.length);
				}
			});
		});
	});
}

exports.find = function(params) {
	return {
		done: function(callback) {
			var mongoHelper = require('./MongoHelper');
			mongoHelper.connect(function(db) {
				var episodes = db.collection('episodes');
				if (params.year) {
					params.year = parseInt(params.year);
				}
				if (params.id) {
					params.id = parseInt(params.id);
				}

				episodes.find(params).sort({id:1}).toArray(function(err, result) {
					db.close();
					callback(JSON.stringify(result));
				});
			});
		}
	}
}

exports.save = function(episode) {
	return {
		done: function(callback) {
			var Storage = require('./Storage');
			Storage.put(episode).done(callback);
		}
	}
}
