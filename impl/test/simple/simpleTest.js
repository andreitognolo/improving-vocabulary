exports.stack = function(t){

	t.module("simple/simpleTest");

	t.test('two should equal two', function() {
		t.equal(2, 2);
	});

	t.asyncTest( "asynchronous test: one second later!", function( assert ) {
		expect( 1 );

		setTimeout(function() {
			assert.ok( true, "Passed and ready to resume!" );
			QUnit.start();
		}, 500);
	});
}


