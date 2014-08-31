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
        var e = EntityTest.newEntityTest();
        t.equal(DomainUtil.collectionsName(e), "Object");  
    })
}