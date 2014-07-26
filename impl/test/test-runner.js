var t = require( "qunitjs" );

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
  console.log( "Now running: ", details.name );
});

t.moduleDone(function( details ) {
  console.log("");
  console.log("Finished running: "  + details.name); 
  console.log("Failed: " + details.failed); 
  console.log("Total: " + details.total );
  console.log("");
});


t.testStart(function(details){
   console.log("");
   console.log("Test starting: ", details.name );
   console.log(""); 
});

var test = [];
test.push(require("./simple/simpleTest.js"));
test.push(require("./service/episodeServiceTest.js"));


for(var i = 0; i < test.length; i++){
    test[i].stack(t);
}


t.load();