var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

http.createServer(function(request, response) {
 
  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10), ip_address);
 
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");