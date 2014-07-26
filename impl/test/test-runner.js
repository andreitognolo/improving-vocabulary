var t = require( "qunitjs" );
var tests = require( "./import-tests.js" );

t.log(function( details ) {
    if ( !details.result ) {
        var output = "FAILED: " + ( details.message ? details.message + ", " : "" );
        if ( details.actual ) {
            output += "expected: " + details.expected + ", actual: " + details.actual;
        }
        if ( details.source ) {
            output += ", " + details.source;
        }
        console.log( output );
    }
});

t.done(function(result){
    if(result.failed){
        console.log("");
        console.log("All failed test: " + result.failed);
        console.log("");
        process.exit(1);
    }
});

t.moduleStart(function( details ) {
  console.log( "Now running module: ", details.name );
});

t.testStart(function(details){
   console.log("");
   console.log("Test starting: ", details.name );
   console.log(""); 
});

var test = tests.import(t);
for(var i = 0; i < test.length; i++){
    test[i].stack(t);
}
t.load();