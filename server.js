var path = require("path");
var fs = require("fs");

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var EpisodeService = require('./server/EpisodeService.js');


function processStatic(resp) {
	var filename = path.join(process.cwd(), resp.uri);
	fs.exists(filename, function(exists) {
		if (!exists) {
            resp.sendTextError(404, "404 - Not Found");
			return;
		}

		if (fs.statSync(filename).isDirectory())
            filename = path.join(filename, 'index.html');
        
		fs.readFile(filename, "binary", function(err, file) {
			if (err) {
                resp.sendTextError(500, err);
			}
            var contentType = resp.header(filename);
            resp.sendSuccess(file, contentType);
		});
	});
}

function processService(resp) {
    var uri = resp.uri, req = resp.req, response = resp.resp;
    
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
    console.log('callservice - ', service , "Service." + func);
	if (body) {
    	var ret = eval(service + "Service." + func).call(null, JSON.parse(body));
    	ret.done(function(result) {
            result = JSON.stringify(result);
    		response.end(result || 'void');
    	});
    } else {
    	var ret = eval(service + "Service." + func + "()");
    	ret.done(function(result) {
            result = JSON.stringify(result);
    		response.end(result || 'void');
    	});
    }
}

require('./server/MongoHelper').init(function() {
    
    var mongoHelper = require('./server/MongoHelper');
    if (mongoHelper.db) {
        console.log('database is not undefined');
    } else {
        console.log('ixi... it is undefined');
    }
    
    
    var serv = require('./Server').server();
    serv.action('/s', processService);
    serv.action('/', processStatic);
    serv.listen(parseInt(port, 10), ip_address);
});

