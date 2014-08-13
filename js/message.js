(function($){
	
	$.success = function(text, time) {
		var msg = $('<div class="alert alert-success">' + text + '</div>');
		$('.message').append(msg);
		
		console.log('time', time || 15000);
		
		setTimeout(function() {
			msg.fadeOut(1000);
		}, time || 5000);
	}
	$.warning = function(text, time) {
		var msg = $('<div class="alert alert-warning">' + text + '</div>');
		$('.message').append(msg);
		
		setTimeout(function() {
			msg.fadeOut(1000);
		}, time || 5000);
	}
	
})(jQuery);