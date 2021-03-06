exports.next = function (data) {
  return {
    done: function (callback) {
      var WordsUtil = require('./util/WordsUtil');
      var Storage = require('./Storage');

      var userInfo = data.userInfo;

      var query = {
        id: {$nin: userInfo.historyEpisodes},
        transcripted: true
      }

      if (data.array && data.array.length) {
        var cleanedArray = [];
        for (var i = 0; i < data.array.length; i++) {
          cleanedArray.push(WordsUtil.clearWord(data.array[i]));
        }
        data.array = cleanedArray;
        query.words = {$in: data.array};
      }

      Storage.query('Episode').find(query).done(function (results) {
        function retriveResult(result) {
          result.words = result.words || [];
          data.array = data.array || [];
          result.wordsFound = WordsUtil.intersection(data.array, result.words);
          callback(result);
        }

        if (results.length) {
          retriveResult(results[0]);
          return;
        }

        delete query.words;
        Storage.query('Episode').find(query).done(function (res) {
          if (res.length) {
            retriveResult(res[0]);
            return;
          }
          retriveResult({});
        });
      });
    }
  }
}

exports.nextTranscription = function () {
  return {
    done: function (callback) {
      var Storage = require('./Storage');
      Storage.query('Episode').find({transcripted: {$ne: true}}).done(function (results) {
        callback(results[0].id);
      });
    }
  }
}

exports.saveTranscription = function (episode) {
  return {
    done: function (callback) {
      var Episode = require('./domain/Episode');
      var obj = new Episode.newEpisode();
      obj.id = parseInt(episode.id);
      obj.transcripted = true;
      obj.sentences = episode.sentences;
      exports.save(obj).done(function () {
        callback(obj.id);
      });
    }
  }
}

exports.sync = function (episodeId) {
  var fs = require("fs");

  return {
    done: function (callback) {
      fs.readdir('images/what-the-duck', function (err, files) {
        if (err) {
          throw 'Error: ' + err;
        }

        if (episodeId) {
          files = [episodeId];
        } else {
          files = files.map(function (value) {
            return parseInt(value.replace('.gif', ''));
          });
        }
        exports.syncFiles(files, callback);
      });
    }
  }
}

exports.syncFiles = function (files, callback) {
  var Storage = require('./Storage');
  var Episode = require('./domain/Episode');
  var count = 0;
  files.forEach(function (fileName) {
    Storage.findById('Episode', fileName).done(function (episode) {
      var year = parseInt(fileName.toString().substring(0, 4));

      if (!episode) {
        episode = Episode.newEpisode(fileName);
      }

      episode.id = fileName;
      episode.year = year;
      Storage.put(episode).done(function (result) {
        count++;
        if (count == files.length) {
          callback('UPDATING: ' + files.length);
        }
      });
    });
  });
}

// FIXME(Andrei) - exports, exports, exports...
exports.reprocessWordsAll = function () {
  return {
    done: function (callback) {
      exports.all().done(function (episodes) {
        var count = 0;
        console.log('Reprocessing: ' + episodes.length);
        episodes.forEach(function (episode) {
          exports.reprocessWords(episode.id).done(function () {
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

exports.reprocessWords = function (episodeId) {
  var WordsUtil = require('./util/WordsUtil');

  return {
    done: function (callback) {
      var MongoHelper = require('./MongoHelper');
      var db = MongoHelper.db;
      var collectionName = require('./util/DomainUtil').collectionsName("Episode");
      //RENATO - We need do this in here? Why not Storage?
      var collection = db.collection(collectionName);
      collection.find({id: episodeId}).toArray(function (err, episodesFromDB) {
        var episode = episodesFromDB[0];
        if (!episode.sentences) {
          callback(episode.id);
          return;
        }

        var sentences = episode.sentences.map(function (obj) {
          return obj.sentence;
        });

        var allSentences = '';
        sentences.forEach(function (el) {
          allSentences += ' ' + el;
        });

        collection.update({
          id: episode.id
        }, {
          $set: {words: WordsUtil.words(allSentences)}
        }, {
          upsert: true,
          w: 1
        }, function () {
          callback(episode.id);
        });
      });
    }
  }
}

exports.all = function () {
  return {
    done: function (callback) {
      exports.find({}).done(callback);
    }
  }
}

exports.find = function (params) {
  return {
    done: function (callback) {
      var Storage = require('./Storage');
      var query = {};
      if (params.group) {
        query.group = params.year;
      }
      if (params.id) {
        query.id = parseInt(params.id);
      }
      Storage.query('Episode').find(query).sort({'id': 1}).done(callback);
    }
  }
}

exports.save = function (episode) {
  return {
    done: function (callback) {
      var Storage = require('./Storage');
      Storage.put(episode).done(callback);
    }
  }
}

