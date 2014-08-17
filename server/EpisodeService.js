exports.next = function(data) {
	return {
		done : function(callback) {
            var Storage = require('./Storage');
            Storage.query('Episode').find({id:{$gt:parseInt(data.previousEpisodeId)}}).done(function(results){
                callback(results[0]);
            });
		}
	}
}

exports.nextTranscription = function() {
	return {
		done : function(callback) {
            var Storage = require('./Storage');
            Storage.query('Episode').find({transcripted: {$ne: true}}).done(function(results){
                callback(results[0].id);
            });
		}
	}
}

exports.saveTranscription = function(episode) {
	return {
		done: function(callback) {
            var Episode = require('./domain/Episode');
            var obj = new Episode.newEpisode();
            obj.id = parseInt(episode.id);
            obj.transcripted = true;
            obj.sentences = episode.sentences;
            exports.save(obj).done(callback);
		}
	}
}

exports.sync = function(episodeId) {
	var fs = require("fs");
	
	return {
		done : function(callback) {
			fs.readdir('img/calvin-hobbes', function(err, files) {
				if (err) {
					throw 'Error: ' + err;
				}

				console.log('episodeId', episodeId);
				if (episodeId) {
					files = [episodeId];
				} else {
					files = files.map(function(value) {
						return parseInt(value.replace('.gif', ''));
					});
				}

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
            var Storage = require('./Storage');
            var query = {};
            if (params.year) {
				query.year = parseInt(params.year);
			}
			if (params.id) {
				query.id = parseInt(params.id);
			}
            Storage.query('Episode').find(query).done(callback);
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

