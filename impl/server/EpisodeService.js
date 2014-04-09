exports.nextTranscription = function() {
	return '19851118';
}

exports.save = function(json) {
	for(i = 0;i < json.length;i++) {
		var el = json[i];
		console.log(el.character);
		console.log(el.sentence);
	}
}