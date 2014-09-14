exports = (function (exports){
    var http = require("http");
    var url = require("url");
    
    function Result(uri, req, resp){
        this.req = req;
        this.resp = resp;
        this.uri = uri;
    }

    Result.prototype.sendTextError = function(errorCode, error){
        this.resp.statusCode = errorCode;
        this.resp.setHeader("Content-Type", "text/plain");
        this.resp.write(error);
		this.resp.end();
    }    
    
    Result.prototype.header = function(filename){
         if(filename.indexOf('.html') >= 0){
            return "text/html";   
        }
    }   
    
    Result.prototype.sendSuccess = function(body, contentType){
        this.resp.statusCode = 200;
        if(contentType){
            this.resp.setHeader("Content-Type", "text/html");
        }
        this.resp.write(body, "binary");
        this.resp.end();
    }
    
    Result.prototype.urlArg = function(index){
        return this.uri.split('/')[index];
    }
    
    Result.prototype.onReceivedData = function(cb){
        var body = "";
        if(this.req.method === "POST"){
              this.req.on('data', function(data){
                body+=data;
              });

              this.req.on('end', function(){
                 cb(body); 
              });
        } else if(this.req.method === "GET"){
              var params = require('./util/querystring').params(this.req.url);
              if (params.data) {
                  body = params.data[0];
              }
              cb(body); 
        }
    }

    function Server(){
        this.filters = [];
        this.actions = [];

        var _me = this;
        function _serverCallback(req, resp){
            var uri = url.parse(req.url).pathname;
            var action = _me.action(uri);
            action(new Result(uri, req, resp));
        }

        this.server = http.createServer(_serverCallback);
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

    Server.prototype.listen = function(port, ip){
        this.server.listen(port, ip);
        console.log("Static file server running at");
        console.log("http://localhost:", port);
        console.log("CTRL + C to Shutdown");
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