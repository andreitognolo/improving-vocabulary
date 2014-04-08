var http = require("http"), url = require("url"), path = require("path"), fs = require("fs")
port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

function processStatic(uri, request, response) {
	var filename = path.join(process.cwd(), uri);

	path.exists(filename, function(exists) {
		if (!exists) {
			response.writeHead(404, {
				"Content-Type" : "text/plain"
			});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory())
			filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if (err) {
				response.writeHead(500, {
					"Content-Type" : "text/plain"
				});
				response.write(err + "\n");
				response.end();
				return;
			}

			response.writeHead(200);
			response.write(file, "binary");
			response.end();
		});
	});
}

function processService(request, response) {
	response.writeHead(200, {
		"Content-Type" : "text/json"
	});
	response.end('19851118');
}

http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname;
	if (uri.indexOf('/s/') == 0) {
		processService(request, response);
	} else {
		processStatic(uri, request, response);
	}

}).listen(parseInt(port, 10), ip_address);

console.log("Static file server running at\n  => http://localhost:" + port
		+ "/\nCTRL + C to shutdown");