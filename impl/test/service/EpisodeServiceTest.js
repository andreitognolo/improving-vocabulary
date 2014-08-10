var HOME = './../..';
var episodeService = require(HOME + '/server/EpisodeService');
var Episode = require(HOME + '/server/domain/Episode');
var Storage = require(HOME + '/server/Storage');
var MongoHelper = require(HOME + '/server/MongoHelper');


exports.stack = function(t){

	t.module("EpisodeServiceTest");
	
	t.asyncTest('Save Episode', function(assert) {
		var episode = new Episode.newEpisode();
		episode.id = 1;
		episode.transcripted = true;
        episode.sentences = [ { character : "CALVIN", sentence : "HI DAD!" }, { character : "PAI", sentence : "HI! CALVIN" } ];
        
		episodeService.save(episode).done(function() {
			episodeService.find({id: episode.id}).done(function(json) {
				var episodeRecorded = JSON.parse(json)[0];
				
				assert.equal(1, episodeRecorded.id);
				assert.equal(true, episodeRecorded.transcripted);
                assert.deepEqual([ 'HI', 'DAD!', 'HI!', 'CALVIN' ], episodeRecorded.words);
                assert.deepEqual([ { character : "CALVIN", sentence : "HI DAD!" }, { character : "PAI", sentence : "HI! CALVIN" } ], episodeRecorded.sentences);
				t.start();
			});
		});
	});
	
    t.asyncTest('Save Transcription', function(assert) {
        
        var callbackFind = function(json) {
            var episodeRecorded = JSON.parse(json)[0];

            assert.equal(1, episodeRecorded.id);
            assert.equal(true, episodeRecorded.transcripted);
            assert.deepEqual([ 'HI', 'DAD!', 'HI!', 'CALVIN' ], episodeRecorded.words);
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
	});
    
	t.asyncTest('Sync Episodes', function(assert) {
		// FIXME(Andrei) - Use QUnit.testStart() when travis install mongodb
		var episode = Episode.newEpisode();
		episode.id = 19851119;
		// FIXME(Andrei) - addSentence method?
		episode.sentences = [{'character': 'Calvin', 'sentence': 'aaaa bbbb ccc'}];
		
		episodeService.save(episode).done(function() {
			var files = [19851118, 19851119];
			episodeService.syncFiles(files, function() {
				Storage.findById('Episode', 19851119).done(function(episodeFromDB) {
					assert.equal(19851119, episodeFromDB.id);
					assert.equal(1, episodeFromDB.sentences.length);
					assert.deepEqual(['aaaa', 'bbbb', 'ccc'], episodeFromDB.words);
					t.start();
				});
			});
		});
	});
}