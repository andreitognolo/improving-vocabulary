
exports.import = function(t){
	var test = [];

	test.push("./simple/simpleTest.js");
	test.push("./domain/DomainUtilTest.js");
	test.push("./util/WordsUtilTest.js");
	
	// MongoDB required
	test.push("./service/EpisodeServiceTest.js");
	test.push("./service/StorageTest.js");

	return test;
}