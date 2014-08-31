function EntityTest() {

	this.collection = 'entity-test';
	this.id = undefined;
	this.a = undefined;
	this.b = undefined;
	this.list = [];
}

EntityTest.prototype = {
	get c() {
		return this.a + this.b;
	}
}

exports.newEntityTest = function() {
	return new EntityTest();
};
