(function($) {

    $.iyvc = {};
    
    function callbackSuccess(success){
        return function(){
            if(success){
                success.apply(window.this, arguments);
            }   
        }
    }
    
    function callbackError(error){
        return function(){
            if(error){
                error.apply(window.this, arguments);
            }   
        }
    }
    
    function ajax(type, url, data, success, error){
        var opts = {
            url : url,
            success : callbackSuccess(success),
            error : callbackError,
            data : JSON.stringify(data),
            type: type,
            dataType: "json",
            contentType : "application/json"
        }
        return $.ajax(opts);   
    }
    
    
    
    function mount(desc, name, type, url){
        $.iyvc[name] = function(data, success, error){
           return ajax(type, url, data, success, error);
        }
    }
    
    mount("Procurando Episodios", "findEpisodes", "POST", "/s/Episode/find");
})(jQuery);