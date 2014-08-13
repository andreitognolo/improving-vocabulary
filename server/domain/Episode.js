function Episode() {

    this.collection = 'episodes';
	
	this.id = undefined;
	
	this.transcripted = undefined;

	this.sentences = [];
	
}

Episode.prototype = {
	
	get words() {
		var words = [];
		var WordsUtil = require('../util/WordsUtil');
		
		this.sentences.forEach(function(sentence) {
			words = words.concat(WordsUtil.words(sentence.sentence));
		});
		
		return words;
	}
}

exports.newEpisode = function() {
	return new Episode();
};
