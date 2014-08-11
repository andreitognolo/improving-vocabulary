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
	connect(function(db) {
        db.dropDatabase(function(){
            cb();
            db.close();
        });
	});
}

exports.connect = connect;
exports.reset = reset;