exports.words = function(sentence) {
	var words = sentence.split(' ');
	words = words.map(function(word) {
		return word.replace(/[^a-zA-Z]*/g, '');
	});
	return words;
}

exports.intersection = function(l1, l2){
    var intersection = [];
    if(l1 && l2){
        for (var i=0; i < l2.length; i++){
           if(l1.indexOf(l2[i]) >= 0){
               intersection.push(l2[i]);
           }
        }
    }
    return intersection;
}