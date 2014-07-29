exports.words = function(sentence) {
	var words = sentence.split(' ');
	//words = words.map(function(word) {
		//return word.replace(/[^a-zA-Z]*/g, '');
	//});
	return words;
}