var HOME = './../..';
var DomainUtil = require(HOME + '/server/util/DomainUtil');
var EntityTest = require(HOME + '/server/domain/EntityTest');

exports.stack = function(t) {

	t.module('DomainUtilTest');

	t.test('listProperties', function() {
		var e = {};
		t.equal(0, DomainUtil.listProperties(e).length);

		e = new function() {
			this.a = '';
			this.b = undefined;
		}
        

		t.equal(2, DomainUtil.listProperties(e).length);
		
		e = new function() {
			this.a = '';
			this.b = undefined;
			this.collection = 'collection-test';
		}
		
		t.equal(2, DomainUtil.listProperties(e).length);
	});
    
    t.test('collectionName', function(){
        t.equal(DomainUtil.collectionsName("EntityTest"), "entity-test");
        t.equal(DomainUtil.collectionsName("Entity"), "entity");
        t.equal(DomainUtil.collectionsName("EntityTestT"), "entity-test-t");
        t.equal(DomainUtil.collectionsName("EEntityTestT"), "e-entity-test-t");
    })
}