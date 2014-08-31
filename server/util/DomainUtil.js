function listProperties (entity) {
	var result = [];
	
	for (i in entity) {
		if (i != 'collection') {
			result.push(i);
		}
	}
	return result;
}


function collectionsName(entity){
    var converted = "";
    for(var i=0; i<entity.length; i++){
        var char = entity.charAt(i);
        if(char === entity.charAt(i).toUpperCase()){
            char = entity.charAt(i).toLowerCase(); 
            if(i > 0){
                char = "-" + char;   
            }
        }
        converted += char;
    }
    return converted;
}


exports.listProperties = listProperties;
exports.collectionsName = collectionsName;