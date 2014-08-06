(function($) {

	$.opand = function() {
		for (var i = 0; i < arguments.length; i++) {
			if (!arguments[i]) {
				return false;
			}
		}
		return true;
	}

	$.opge = function(a, b) {
		return (a >= b);
	}

	$.oplt = function(a, b) {
		return (a < b);
	}

	$.fn.serializeObject = function() {
		var form = $(this);
		var arrayForm = form.serializeArray();
		var json = {};
		for (var idx = 0; idx < arrayForm.length; idx++) {
			var value = $.trim(arrayForm[idx].value);
			if (value) {
				json[arrayForm[idx].name] = value;
			}
		}
		return json;
	}

})(jQuery);