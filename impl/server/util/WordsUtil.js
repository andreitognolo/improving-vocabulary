exports.words = function(sentence) {
	var words = sentence.split(' ');
	words = words.map(function(word) {
		return word.replace(/[^a-z]*/g, '');
	});
	return words;
}