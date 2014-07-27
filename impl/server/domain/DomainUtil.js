exports.listProperties = function(entity) {
	var result = [];
	
	for (i in entity) {
		if (i != 'collection') {
			result.push(i);
		}
	}
	
	return result;
}