(function($){
	$(window).hashchange(function() {
		var hash = this.location.hash || '#';
		hash = $.trim(hash);
		if (!hash || hash == '#') {
			this.location.hash = '#Main';
			return;
		}
		hash = hash.substring(1);
		var page = hash.split('?')[0];

		$.ajax({
		    url : 'pages/' + page + '.html',
		    dataType : 'html',
		    success : function(text) {
		    	$('.content').html($(text).html());
		    }
		});
	});
	
	$(window).hashchange();
	
})(jQuery);