function EntityTest() {

	this.collection = 'EntityTest';
	this.id = undefined;
	this.a = undefined;
	this.b = undefined;
}

exports.newEntityTest = function() {
	return new EntityTest();
};
