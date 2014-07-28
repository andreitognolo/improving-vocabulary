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
		
		episodeService.save(episode).done(function() {
			episodeService.find({id: episode.id}).done(function(json) {
				var episodeRecorded = JSON.parse(json)[0];
				
				assert.equal(1, episodeRecorded.id);
				assert.equal(true, episodeRecorded.transcripted);
				t.start();
			});
		});
	});
	
	t.asyncTest('Sync Episodes', function(assert) {
		var episode = Episode.newEpisode();
		episode.id = 19850102;
		// FIXME(Andrei) - addSentence method?
		episode.sentences = [{'character': 'Calvin', 'sentence': 'teste'}];
		Storage.findById('Episode', 19850102).done(function(episodeNotFound) {
			ok(!episodeNotFound.id);
			episodeService.save(episode).done(function() {
				var files = [19850101, 19850102];
				episodeService.syncFiles(files, function() {
					Storage.findById('Episode', 19850102).done(function(episodeFromDB) {
						assert.equal(19850102, episodeFromDB.id);
						assert.equal(1, episodeFromDB.sentences.length);
						t.start();
					});
				});
			});
		});
	});
}