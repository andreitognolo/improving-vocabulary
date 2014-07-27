var HOME = './../..';
var episodeService = require(HOME + '/server/EpisodeService');
var Episode = require(HOME + '/server/domain/Episode');
var MongoHelper = require(HOME + '/server/MongoHelper');
var Storage = require(HOME + '/server/Storage');

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
		// FIXME(Andrei) - Use QUnit.testStart() when travis install mongodb
		MongoHelper.reset(function() {
			var files = [19850101, 19850102];
			episodeService.syncFiles(files, function() {
				Storage.findById('Episode', 19850102).done(function(episode) {
					assert.equal(19850102, episode.id);
					t.start();
				});
			});
		});
	});
}