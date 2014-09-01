var HOME = './../..';
var episodeService = require(HOME + '/server/EpisodeService');
var Episode = require(HOME + '/server/domain/Episode');
var Storage = require(HOME + '/server/Storage');
var MongoHelper = require(HOME + '/server/MongoHelper');
var DomainUtil = require(HOME + '/server/util/DomainUtil');

exports.stack = function(t){

	t.module("EpisodeServiceTest");
    
    function saveEpisode(assert) {
		var episode = new Episode.newEpisode();
		episode.id = 1;
		episode.transcripted = true;
        episode.sentences = [ { character : "CALVIN", sentence : "HI DAD!" }, { character : "PAI", sentence : "HI! CALVIN" } ];
        
		episodeService.save(episode).done(function() {
			episodeService.find({id: episode.id}).done(function(json) {
				var episodeRecorded = json[0];
				assert.equal(1, episodeRecorded.id);
				assert.equal(true, episodeRecorded.transcripted);
                assert.deepEqual([ 'HI', 'DAD', 'HI', 'CALVIN' ], episodeRecorded.words);
                assert.deepEqual([ { character : "CALVIN", sentence : "HI DAD!" }, { character : "PAI", sentence : "HI! CALVIN" } ], episodeRecorded.sentences);
				t.start();
			});
		});
	}
	
    function saveTranscription(assert) {
        
        var callbackFind = function(json) {
            var episodeRecorded = json[0];

            assert.equal(1, episodeRecorded.id);
            assert.equal(true, episodeRecorded.transcripted);
            assert.deepEqual([ 'HI', 'DAD', 'HI', 'CALVIN' ], episodeRecorded.words);
            assert.deepEqual([ { character : "CALVIN", sentence : "HI DAD!" }, { character : "PAI", sentence : "HI! CALVIN" } ], episodeRecorded.sentences);
            t.start();
        }
        
        var callbackSaveTranscription = function(){
               episodeService.find({id: episode.id}).done(callbackFind); 
        };
        
		var callbackSave = function() {
            var e = {};
            e.id = "1";
            e.sentences = [ { character : "CALVIN", sentence : "HI DAD!" }, { character : "PAI", sentence : "HI! CALVIN" } ];
            episodeService.saveTranscription(e).done(callbackSaveTranscription);
		}
        
        
        var episode = new Episode.newEpisode();
		episode.id = 1;
		episode.transcripted = false;
		episodeService.save(episode).done(callbackSave);
	}
    
    function reprocessWords(assert) {
       var createEpisodeWithoutWords = function() {
            MongoHelper.connect(function(db) {
                var collection = db.collection(DomainUtil.collectionsName("Episode"));
                collection.update({
                    id: 1,
                }, {
                    $set :{sentences: [{'character': 'Calvin', 'sentence': 'aaaa bbbb ccc'}]}
                }, {
                    upsert : true,
                    w : 1
                }, function() {
                    db.close();
                    thenThereAreNoWords();
                });
            });
        }();
        
       var thenThereAreNoWords = function() {
            MongoHelper.connect(function(db) {
                var collection = db.collection(DomainUtil.collectionsName("Episode"));
                collection.find({'words': {$in : ['aaaa']}}).toArray(function(err, result) {
                    db.close();
                    assert.ok(!result.length, "result length empty");
                    thenReprocess();
                });
            });
        }
        
        var thenReprocess = function() {
            episodeService.reprocessWords(1).done(function(result) {
                assert.ok(1, result, 'Id 1 reprocessed');
                thenThereAreWords();
            });
        }
        
        var thenThereAreWords = function() {
            MongoHelper.connect(function(db) {
                var collection = db.collection("episodes");
                collection.find({'words': {$in : ['aaaa']}}).toArray(function(err, result) {
                    db.close();
                    assert.ok(result.length, "result length not empty");
                    t.start();
                });
            });
        }
	}
    
    function nextTranscription(assert){
        var callbackNextTranscription = function(id){
               assert.equal(id, 2);
               Storage.findById('Episode', 2).done(function(e){
                    assert.equal(e.id, 2);
                    assert.equal(e.transcripted, false);
                    assert.equal(e.sentences.length, 0);
                    t.start();
               });
        }
        
        var callbackSaveTranscription = function(){
           saveEpisode(2, function(){
                episodeService.nextTranscription().done(callbackNextTranscription);
           }); 
        }
        
        var saveTranscription = function() {
            var e = {};
            e.id = "1";
            e.sentences = [ { character : "CALVIN", sentence : "HI DAD!" }, { character : "PAI", sentence : "HI! CALVIN" } ];
            episodeService.saveTranscription(e).done(callbackSaveTranscription);
		}
        
        var saveEpisode = function(id , callback){
            var episode = new Episode.newEpisode();
            episode.id = id;
            episode.transcripted = false;
            episodeService.save(episode).done(callback);
        }
        
        saveEpisode(1, saveTranscription);
    }
    
    function nextEpisode(assert){
        var nextEpisode = function(){
            var data = { previousEpisodeId : 1 , array : [ "HI" ] }
            episodeService.next(data).done(function(result){
                assert.equal(result.id, 3);
                t.start();
            });
        }
  
        var transcription4 = function(){
           var s = [ { character : "CALVIN", sentence : "MY" }, { character : "PAI", sentence : "NOP" } ];
           saveEpisode(4, saveTranscription(4, s, nextEpisode)); 
        }
        
        var transcription3 = function(){
           var s = [ { character : "CALVIN", sentence : "HI" }, { character : "PAI", sentence : "YUP" } ];
           saveEpisode(3, saveTranscription(3, s, transcription4)); 
        }
        
        var transcription2 = function(){
           var s = [ { character : "CALVIN", sentence : "YEAH!" }, { character : "PAI", sentence : "WOW" } ];
           saveEpisode(2, saveTranscription(2, s, transcription3)); 
        }
        
        var saveTranscription = function(id, sentences, cb) {
            return function() { 
                var e = {};
                e.id = id;
                e.sentences = sentences;
                episodeService.saveTranscription(e).done(cb);
            }
		}
        
        var saveEpisode = function(id , callback){
            var episode = new Episode.newEpisode();
            episode.id = id;
            episode.transcripted = false;
            episodeService.save(episode).done(callback);
        }
        
        var s = [ { character : "CALVIN", sentence : "HI POP!" }, { character : "PAI", sentence : "HI! CALVIN" } ];
        saveEpisode(1, saveTranscription(1, s, transcription2));
    }
    
	t.asyncTest('Save Episode', saveEpisode);
    t.asyncTest('Next Episode', nextEpisode);
    t.asyncTest('Save Transcription', saveTranscription);
    t.asyncTest('Next Transcription', nextTranscription);
	t.asyncTest('Reprocess Words', reprocessWords);
}
