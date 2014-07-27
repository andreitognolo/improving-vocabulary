var HOME = './../..';
var Storage = require(HOME + '/server/Storage');
var Episode = require(HOME + '/server/domain/Episode');

exports.stack = function(t){

	t.module("StorageTest");

	t.test('Put - Check collection property', function() {
		var episode = {};
		
		try {
			Storage.put(episode);
			t.ok(false, 'We should send an error');
		} catch (e) {
			t.ok(true);
		}
		
		episode = Episode.newEpisode();
		try {
			Storage.put(episode);
			t.ok(true);
		} catch (e) {
			t.ok(false, 'We should not send an error');
		}
	});
}