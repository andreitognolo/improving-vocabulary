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

t.test( "fail twice with stacktrace", function( assert ) {
    assert.equal( true, false );
});

t.load();