var HOME = './../';
var t = require( "qunitjs" );
var tests = require( "./import-tests.js" );
var MongoHelper = require(HOME + '/server/MongoHelper');

var colors = require('colors');


t.log(function( details ) {
    if ( !details.result ) {
        var error = ("[TEST FAILED: " + details.module + " - " + details.name + " ] ").red;
        console.error(error, "EXPECTED:", details.expected);
        console.error(error, "ACTUAL:", details.actual);
        console.error(error, "STACK:", details.source);
        console.error(error, "MESSAGE:", details.message);
    }
});

t.done(function(result){
    var info = "[TEST] PASSED:" + result.passed + ", FAILED:" + result.failed + ", TOTAL:" + result.total + ", TIME:" + result.runtime + " ms"; 
    if(result.failed){
        console.log(info.red);
        console.log("[TEST] BUILD FAILED".red);
        process.exit(1);
    }
    console.log(info.green);
    console.log("[TEST] BUILD SUCCESS".green);
});

t.testStart(function(details){
    t.stop();
    var testStart = ("[TEST STARTED: " + details.module + " / " + details.name + "]").yellow
    console.log(testStart);
    MongoHelper.reset(function(){
        MongoHelper.init(function() {
            t.start();
        });
    });
});

t.testDone(function(details){
    var res = "[TEST PASSED]".green;
    if(details.failed){
       res = "[TEST FAILED]".red;
    }
    console.log(res, ": ASSERTIONS:", details.total, ",FAILED:", details.failed, ",PASSED:", details.passed, "TIME: ", details.duration, " ms");
    MongoHelper.db.close(); 
});

if (process.argv.length == 3) {
	console.log('[EXECUTING TEST]:'.green, process.argv[2]);
	require(process.argv[2]).stack(t);
} else {
	var test = tests.import(t);
	for(var i = 0; i < test.length; i++){
		require(test[i]).stack(t);
	}
}

t.load();