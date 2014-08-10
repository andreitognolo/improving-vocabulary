var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var qs = require('querystring');

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var EpisodeService = require('./server/EpisodeService.js');

function processStatic(uri, request, response) {
	var filename = path.join(process.cwd(), uri);

	fs.exists(filename, function(exists) {
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

            if (filename.indexOf('.html') >= 0) {
			    response.writeHead(200, {
                    "Content-Type" : "text/html"
                });
            } else {
			    response.writeHead(200);
            }

			response.write(file, "binary");
			response.end();
		});
	});
}

function processService(uri, req, response) {
	response.writeHead(200, {
		"Content-Type" : "text/json"
	});
	var service = uri.split('/')[2];
	var func = uri.split('/')[3];
	
	var body = '';
	if (req.method == 'POST') {
	    req.on('data', function (data) {
	        body += data;
	    });
	    
	    req.on('end', function () {
	    	callservice(body, service, func, response);
	    });
	} else {
		var params = require('./server/util/querystring').params(req.url);
		if (params.data) {
			body = params.data[0];
		}
		callservice(body, service, func, response);
	}
}

function callservice(body, service, func, response) {
	if (body) {
    	var ret = eval(service + "Service." + func).call(null, JSON.parse(body));
    	ret.done(function(result) {
    		response.end(result || 'void');
    	});
    } else {
    	var ret = eval(service + "Service." + func + "()");
    	ret.done(function(result) {
    		response.end(result || 'void');
    	});
    }
}

http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname;
	if (uri.indexOf('/s/') == 0) {
		processService(uri, request, response);
	} else {
		processStatic(uri, request, response);
	}

}).listen(parseInt(port, 10), ip_address);

console.log("Static file server running at\n  => http://localhost:" + port
		+ "/\nCTRL + C to shutdown");
