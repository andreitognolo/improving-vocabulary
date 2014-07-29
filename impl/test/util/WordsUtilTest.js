var HOME = './../..';
var WordsUtil = require(HOME + '/server/util/WordsUtil');

exports.stack = function(t) {
	
	t.module('WordsUtilTest');
	
	t.test('Split', function() {
		var words = WordsUtil.words('a bb ccc');
		t.equal(3, words.length);
	});
}