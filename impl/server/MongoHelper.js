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


function connect(cb) {
	var MongoClient = require('mongodb').MongoClient
	var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';
	var mongoIp = process.env.OPENSHIFT_MONGODB_DB_PORT || '27017';
	var mongoUser = 'admin';
	var mongoPassword = '4nVL27YyApru';
	var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoIp + '/improveyourvocabulary';
	
	MongoClient.connect(mongoURL, function(err, db) {
		if (err)
			throw err;
		
		cb(db);
	});
}

function reset(cb) {
    var col = [];
    for(var i in entityToCollectionMap){
        col.push(entityToCollectionMap[i]);
    }
	connect(function(db) {
        function removeDb(i, db){
            return function(){
               if( i >= col.length){
                   cb();
                   db.close();
                   return;
               }
               db.collection(col[i]).remove(removeDb(i + 1, db));
            }
        }
        removeDb(0, db)();
	});
}

exports.connect = connect;
exports.reset = reset;
exports.entityCollection = entityCollection;