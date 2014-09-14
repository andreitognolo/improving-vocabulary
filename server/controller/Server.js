var http = require("http");
var url = require("url");
var Result = require('./Result');

function Server(){
    this.filters = [];
    this.actions = [];

    var _me = this;
    function _serverCallback(req, resp){
        var uri = url.parse(req.url).pathname;
        var action = _me.action(uri);
        action(Result.result(req, resp));
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

function _startsWith(uri, starts){
    function _clean(arr){
        arr = arr.filter(function(el){
            if(el){
                return true;
            }
            return false;
        })
        return arr;
    }

    uri = uri.split('/');
    starts = starts.split('/');
    uri = _clean(uri);
    starts = _clean(starts);

    if(uri.length < starts.length){
        return false;
    }

    for(var i=0; i<starts.length; i++){
        if(starts[i] != uri[i]){
            return false;
        }
    }

    return true;
}


function _findActionByPath(list, path){

    for(var i=0; i < list.length; i++){
        var obj = list[i];
        if(_startsWith(path, obj.path)){
            return obj.action;
        }
    }

    throw "Ops, no action found";
}

exports.server = function(){
    return new Server();   
}
