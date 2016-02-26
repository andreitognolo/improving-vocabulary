exports.mongoURL = function() {
  var url;

  if (process.env.MONGOLAB_URI) {
    url = process.env.MONGOLAB_URI;
  } else if (process.env.ENVIRONMENT == 'test') {
    url = 'mongodb://127.0.0.1:27017/improveyourvocabulary-test';
  } else {
    url = 'mongodb://127.0.0.1:27017/improveyourvocabulary';
  }

  return url;
}