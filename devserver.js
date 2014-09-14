var path = require("path");
var fs = require("fs");
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

function processStatic(resp) {
    var filename = path.join(process.cwd(), resp.uri);
    fs.exists(filename, function(exists) {
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
        delete require.cache[require.resolve("./server/" + resp.urlArg(2) + "Service")];
        var service = require("./server/" + resp.urlArg(2) + "Service");
        var func = service[resp.urlArg(3)];

        if(body){
            body = JSON.parse(body);
        }

        var ret = func.apply(service, [ body ]);
        ret.done(function(result){
            result = JSON.stringify(result);
            resp.sendSuccess(result || 'void', 'text/json');
        });
    });
} 

function mongoReset (resp, chain){
    require('./server/MongoHelper').init(function() {
        var mongoHelper = require('./server/MongoHelper');
        chain.continue();
    });
}

function clearRequireCache(resp, chain){
    for(var i in require.cache){
        delete require.cache[i];   
    }
    chain.continue();
}

var serv = require('./server/controller/Server').server();
serv.action('/s', processService);
serv.before('/s', mongoReset);
serv.action('/', processStatic);
serv.before('/', clearRequireCache);
serv.listen(parseInt(port, 10), ip_address);


