exports.stack = function(t){

	t.module("simple/simpleTest")
	
	t.test('one should equal one', function() {
		t.equal(2, 2);
	});

}


