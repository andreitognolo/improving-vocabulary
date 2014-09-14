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
    resp.onReceivedData(function(body){
        var serviceName = resp.urlArg(2);
	    var funcName = resp.urlArg(3);
        
        console.log('callservice - ', serviceName , "Service." + funcName);
        
        var func = eval(serviceName + "Service." + funcName);
        (function(){
            if(body){
                body = JSON.parse(body);
            }
            
            var ret = func.apply(this, [ body ]);
            ret.done(function(result){
                result = JSON.stringify(result);
                resp.sendSuccess(result || 'void', 'text/json');
            });
        })();
    });
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

