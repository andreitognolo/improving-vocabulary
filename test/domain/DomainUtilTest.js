var HOME = './../..';
var DomainUtil = require(HOME + '/server/domain/DomainUtil');
var Episode = require(HOME + '/server/domain/Episode');

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
}