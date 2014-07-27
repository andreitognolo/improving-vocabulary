var HOME = './../..';
var Storage = require(HOME + '/server/Storage');
var Episode = require(HOME + '/server/domain/Episode');
var EntityTest = require(HOME + '/server/domain/EntityTest');

exports.stack = function(t){

	t.module("StorageTest");

	// FIXME(Andrei) - We should not test Episode
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
	
	t.asyncTest('Put - Save and find', function(assert) {
		var id = new Date().getTime();
		var e = EntityTest.newEntityTest();
		e.id = id;
		
		Storage.put(e).done(function() {
			Storage.findById('EntityTest', id).done(function(entityFromDatabase) {
				assert.equal(id, entityFromDatabase.id);
				assert.equal('EntityTest', entityFromDatabase.collection);
				t.start();
			});
		});
	});
}