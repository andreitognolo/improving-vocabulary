var entityToCollectionMap = {
	'EntityTest': 'EntityTest',
	'Episode': 'episodes'
}

function entityCollection(entityClass){
    // FIXME(Andrei) - We dont need this map
    var collectionName = entityToCollectionMap[entityClass];
	if (!collectionName || typeof collectionName != 'string') {
		throw "Collection must be a valid string: '" + collectionName + "'";
	}
    return collectionName;
}

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
    return entity.constructor.name;
}


exports.listProperties = listProperties;
exports.collectionsName = collectionsName;
exports.entityCollection = entityCollection;