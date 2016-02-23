var environments = {
  openshift: {
    host: '1.1.1.1',
    port: 12345,
    database: 'improveyourvocabulary'
  }, test: {
    host: '127.0.0.1',
    port: 27017,
    database: 'improveyourvocabulary-test'
  }, development: {
    host: '127.0.0.1',
    port: 27017,
    database: 'improveyourvocabulary'
  }
}

function environment() {
  if (process.env.OPENSHIFT_MONGODB_DB_HOST) return 'openshift';
  if (process.env.ENVIRONMENT == 'test') return 'test';
  return 'development';
}

exports.mongoURL = function() {
  var env = environments[environment()];

  var host = env.host;
  var port = env.port;
  var database = env.database;

  return 'mongodb://' + host + ':' + port + '/' + database;
};