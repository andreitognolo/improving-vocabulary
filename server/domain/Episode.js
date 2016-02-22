function Episode() {

    this.collection = 'episode';
	
	this.id = undefined;

	this.year = undefined;

	this.group = undefined;
	
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
