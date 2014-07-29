var HOME = './../..';
var WordsUtil = require(HOME + '/server/util/WordsUtil');

exports.stack = function(t) {
	
	t.module('WordsUtilTest');
	
	t.test('Split', function() {
		var words = WordsUtil.words('a bb ccc');
		t.deepEqual(['a', 'bb', 'ccc'], words);
		
		//words = WordsUtil.words('a! bb? cc\'c DD,');
		//t.deepEqual(['a', 'bb', 'ccc', 'DD'], words);
	});
}