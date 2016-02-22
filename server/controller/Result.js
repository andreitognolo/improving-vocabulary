var url = require("url");

function Result(req, resp) {
  this.req = req;
  this.resp = resp;

  var urlParsed = url.parse(req.url);
  this.uri = urlParsed.pathname;
  this.urisArgs = this.uri.split('/');
  this.urisParams = require('querystring').parse(urlParsed.query);
}

Result.prototype.sendTextError = function (errorCode, error) {
  this.resp.statusCode = errorCode;
  this.resp.setHeader("Content-Type", "text/plain");
  this.resp.write(error);
  this.resp.end();
}

Result.prototype.header = function (filename) {
  if (filename.indexOf('.html') >= 0) {
    return "text/html";
  }
}

Result.prototype.sendSuccess = function (body, contentType) {
  this.resp.statusCode = 200;
  if (contentType) {
    this.resp.setHeader("Content-Type", contentType);
  }
  this.resp.write(body, "binary");
  this.resp.end();
}

Result.prototype.urlArg = function (index) {
  return this.urisArgs[index];
}

Result.prototype.onReceivedData = function (cb) {
  var body = "";
  if (this.req.method === "POST") {
    this.req.on('data', function (data) {
      body += data;
    });

    this.req.on('end', function () {
      cb(body);
    });
  } else if (this.req.method === "GET") {
    if (this.urisParams.data) {
      body = this.urisParams.data;
    }
    cb(body);
  }
}

exports.result = function (uri, req, res) {
  return new Result(uri, req, res);
}