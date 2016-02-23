var HOME = './../..';
var DatabaseConfiguration = require(HOME + '/server/util/DatabaseConfiguration');

exports.stack = function (t) {

  t.module('DatabaseConfiguration');

  t.test('should return 127.0.0.1 when on development', function () {
    var envBefore = process.env.ENVIRONMENT;
    process.env.ENVIRONMENT = 'development';
    t.strictEqual(DatabaseConfiguration.mongoURL(), 'mongodb://127.0.0.1:27017/improveyourvocabulary');
    process.env.ENVIRONMENT = envBefore;
  })

  t.test('should return test database when on test', function () {
    process.env.ENVIRONMENT = 'test';
    t.strictEqual(DatabaseConfiguration.mongoURL(), 'mongodb://127.0.0.1:27017/improveyourvocabulary-test');
  })

  t.test('should return openshift connections when on openshift', function () {
    process.env.OPENSHIFT_MONGODB_DB_HOST = '1.1.1.1';
    process.env.OPENSHIFT_MONGODB_DB_PORT = '12345';

    t.strictEqual(DatabaseConfiguration.mongoURL(), 'mongodb://1.1.1.1:12345/improveyourvocabulary');
  })
}