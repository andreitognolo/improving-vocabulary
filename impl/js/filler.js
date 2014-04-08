(function($) {
	
	function fill() {
		$('.character').val('CALVIN');
		$('.sentence').val('So long, pop!');
	}
	
	$(window).ready(function() {
		$(window).dblclick(function() {
			fill();
		});
	});
	
})(jQuery);