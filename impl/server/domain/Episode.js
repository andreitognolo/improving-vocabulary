function Episode() {

	this.collection = 'episodes';
	
	this.id = undefined;
	
	this.transcripted = undefined;
	
}

exports.newEpisode = function() {
	return new Episode();
};
