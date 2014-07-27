
exports.import = function(t){
	var test = [];

	test.push(require("./simple/simpleTest.js"));
	test.push(require("./service/EpisodeServiceTest.js"));

	return test;
}
