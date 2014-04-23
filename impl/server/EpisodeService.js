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

				var mongoHelper=require('./MongoHelper');
				files.forEach(function(value) {
					mongoHelper.connect(function(db) {
						var episodes = db.collection('episodes');
						var year = parseInt(value.toString().substring(0, 4));	
						episodes.update({'id': value}, {$set:{'id': value, 'year': year}}, {upsert:true, w: 1}, function(err, result) {
							if (err) {
								throw err;
							}
							
							console.log('UPDATE: ' + value + ' - result: ' + result);
							db.close();
						});
					});
				});
				
				callback('UPDATING: ' + files.length);
			});
		}
	}
}

exports.find = function(params) {
	return {
		done: function(callback) {
			console.log(params);
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
					callback(JSON.stringify(result));
					db.close();
				});
			});
		}
	}
}
