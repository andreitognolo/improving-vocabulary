function EntityTest() {

	this.collection = 'EntityTest';
	this.id = undefined;
	this.a = undefined;
	this.b = undefined;
}

EntityTest.prototype = {
	get c() {
		return this.a + this.b;
	}
}

exports.newEntityTest = function() {
	return new EntityTest();
};
