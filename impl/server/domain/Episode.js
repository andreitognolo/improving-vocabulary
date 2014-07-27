function Episode() {
	
	this.id = undefined;
	
	this.transcripted = undefined;
	
}

exports.newEpisode = function() {
	return new Episode();
};
