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
        var params = require('../util/querystring').params(this.req.url);
        if (params.data) {
            body = params.data[0];
        }
        cb(body); 
    }
}

exports.result = function(uri, req, res){
    return new Result(uri, req, res);
}