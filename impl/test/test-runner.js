var HOME = './../';
var t = require( "qunitjs" );
var tests = require( "./import-tests.js" );
var MongoHelper = require(HOME + '/server/MongoHelper');

t.log(function( details ) {
    if ( !details.result ) {
        var output = "TEST FAILED: " + details.name;
        if ( details.actual ) {
            output += "\nexpected: " + details.expected + ", actual: " + details.actual;
        }
        if ( details.source ) {
            output += "\n" + details.source;
        }
        console.error( output );
    }
});

t.done(function(result){
    console.log("Failed test: " + result.failed);
    console.log("Passed test: " + result.passed);
    console.log("Total: " + result.total);
    if(result.failed){
        process.exit(1);
    }
});

t.testStart(function(){
    t.stop();
    MongoHelper.reset(function(){
        t.start();
    })
})

if (process.argv.length == 3) {
	console.log('Executing test: ' + process.argv[2]);
	require(process.argv[2]).stack(t);
} else {
	var test = tests.import(t);
	for(var i = 0; i < test.length; i++){
		require(test[i]).stack(t);
	}
}

t.load();