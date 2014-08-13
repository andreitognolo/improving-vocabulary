// @BadSmell - DuplicatedCode

exports.params = function(l) {
	var Params = function() {

	}
	Params.prototype.get = function(name) {
		var ret = this[name];
		if (ret && ret.length) {
			return ret[0];
		}
		return null;
	}

	Params.prototype.hasParams = function() {
		var url = ('' + (l));
		if (url.indexOf('?') < 0) {
			return false;
		}
		return true;
	}

	var re = /([^&=]+)=?([^&]*)/g;
	function decode(str) {
		return decodeURIComponent(str.replace(/\+/g, ' '));
	}

	var url = ('' + (l));
	var idx = url.indexOf('?');
	if (idx < 0) {
		return new Params();
	}
	var query = url.substring(idx);
	
	var params = new Params();
	var e;
	if (query) {
		if (query.substr(0, 1) == '?') {
			query = query.substr(1);
		}

		while (e = re.exec(query)) {
			var k = decode(e[1]);
			var v = decode(e[2]);
			params[k] = params[k] || [];
			params[k].push(v);
		}
	}
	return params;
}