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
        this.paths = [];
        this.statics = [];

        function serverCallback(req, resp){
            var uri = url.parse(request.url).pathname;
        }

        this.server = http.createServer(serverCallback);
    }

    Server.prototype.dynamic = function(path, action){
        if(!action){
            return _findActionByPath(this.paths, path);
        }
        
        this.paths.push({
            path: path,
            action: action
        });
        
        this.paths= this.paths.sort().reverse();
    }

    Server.prototype.static = function(path, action){
        if(!action){
            return _findActionByPath(this.statics, path);
        }
        
        this.statics.push({
            path: path,
            action: action
        });
        
        console.log(this.statics);
        this.statics = this.statics.sort().reverse();
        console.log(this.statics);
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