exports = (function (exports){
    var http = require("http");
    var url = require("url");
    var path = require("path");
    var fs = require("fs");
    var qs = require('querystring');

    var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
    var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

    function Server(){
        this.filters = [];
        this.actions = [];

        function serverCallback(req, resp){
            var uri = url.parse(request.url).pathname;
        }

        this.server = http.createServer(serverCallback);
    }

    Server.prototype.action = function(path, action){
        if(!action){
            return _findActionByPath(this.actions, path);
        }
        
        this.actions.push({
            path: path,
            action: action
        });
        
        function _sort(a, b){
          if (a.path < b.path)
             return -1;
          if (a.path > b.path)
            return 1;
          return 0;
        }
        
        this.actions = this.actions.sort(_sort).reverse();
    }
    

    Server.prototype.filter = function(filt){
        this.filters.push(filt);
    }

    Server.prototype.listen = function(port){
        this.server.listen(parseInt(port, 10), ip_address);
    }
    
    function _findActionByPath(list, path){

        for(var i=0; i < list.length; i++){
            var obj = list[i];
            if(path.indexOf(obj.path) === 0){
                return obj.action;
            }
        }

        throw "Ops, no action found";
    }
    
    exports.server = function(){
        return new Server();   
    }
    
    return exports;
})(exports);