var HOME = './../..';
var Storage = require(HOME + '/server/Storage');
var Episode = require(HOME + '/server/domain/Episode');
var EntityTest = require(HOME + '/server/domain/EntityTest');

exports.stack = function(t){

	t.module("StorageTest");

	t.test('Put - Check collection property', function() {
		var obj = {};
		
		try {
			Storage.put(obj);
			t.ok(false, 'We should send an error');
		} catch (e) {
			t.ok(true);
		}
	});
	
	t.asyncTest('Put - Save and find', function(assert) {
		var id = new Date().getTime();
		var e = EntityTest.newEntityTest();
		e.id = id;
		e.a = 10;
		e.b = 20;
		assert.equal(30, e.c);
		
		Storage.put(e).done(function() {
			Storage.findById('EntityTest', id).done(function(entityFromDatabase) {
				assert.equal(id, entityFromDatabase.id);
				assert.equal(30, entityFromDatabase.c);
				assert.equal('EntityTest', entityFromDatabase.collection);
				t.start();
			});
		});
	});
}