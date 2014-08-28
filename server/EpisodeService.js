exports.next = function(data) {
	return {
		done : function(callback) {
            var Storage = require('./Storage');
            var query = {
                id : { $gt : parseInt(data.previousEpisodeId) },
                transcripted : true
            }
            
            if(data.array && data.array.length){
              query.words = { $in : data.array };
            }
            
            Storage.query('Episode').find(query).done(function(results){
                if(results.length){
                    callback(results[0]);
                    return;
                }
                
                if(query.words && query.words.$in.length){
                    delete query.words;
                    Storage.query('Episode').find(query).done(function(res){
                        callback(res[0]);
                    });
                }
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
            exports.save(obj).done(function() {
                callback(obj.id);   
            });
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
				count++;
				if (count == files.length) {
					callback('UPDATING: ' + files.length);
				}
			});
		});
	});
}

// FIXME(Andrei) - exports, exports, exports...
exports.reprocessWordsAll = function() {
    return {
        done : function(callback) {
            exports.all().done(function(episodes) {
                var count = 0;
                console.log('Reprocessing: ' + episodes.length);
                episodes.forEach(function(episode) {
                    exports.reprocessWords(episode.id).done(function() {
                        count++;
                        if (count == episodes.length) {
                            console.log('Reprocessed: ' + count);
                            callback();   
                        }
                    });
                });
            });
        }
    }
}

exports.reprocessWords = function(episodeId) {
    var WordsUtil = require('./util/WordsUtil');
    
    return {
        done : function(callback) {
            var MongoHelper = require('./MongoHelper');
            var db = MongoHelper.db;
            var collection = db.collection('episodes');
            collection.find({id: episodeId}).toArray(function(err, episodesFromDB) {
                var episode = episodesFromDB[0];
                if (!episode.sentences) {
                    callback(episode.id);
                    return;
                }
                
                var sentences = episode.sentences.map(function(obj) {
                    return obj.sentence;
                });

                var allSentences = '';
                sentences.forEach(function(el) {
                    allSentences += ' ' + el; 
                });

                collection.update({
                    id : episode.id
                }, {
                    $set : {words: WordsUtil.words(allSentences)}
                }, {
                    upsert : true,
                    w : 1
                }, function() {
                    callback(episode.id);
                });
            });
        }
    }
}

exports.all = function() {
    return {
        done : function(callback) {
            exports.find({}).done(callback);
        }
    }
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
            Storage.query('Episode').find(query).sort({'id': 1}).done(callback);
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

