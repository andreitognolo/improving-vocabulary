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
        $.wf('pages/' + page + '.html', function(p){
            p.open();
        });
	});
	
    $('.navbar-nav li a').click(function(){
        $('.navbar-nav li').removeClass('active');
        $(this).closest('li').addClass('active'); 
    });
    
	$(window).hashchange();
	
})(jQuery);