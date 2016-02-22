exports.import = function (t) {
  var test = [];

  test.push("./simple/simpleTest.js");
  test.push("./util/DomainUtilTest.js");
  test.push("./util/WordsUtilTest.js");
  test.push("./controller/ServerTest.js");

  // MongoDB required
  test.push("./service/EpisodeServiceTest.js");
  test.push("./service/StorageTest.js");

  return test;
}
