var path = require("path");
var fs = require("fs");
var port = process.env.PORT || 8080;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

function processStatic(resp) {
    var filename = path.join(process.cwd(), resp.uri);
    fs.exists(filename, function(exists) {
        if (!exists) {
            resp.sendText(404, "404 - Not Found");
            return;
        }

        if (fs.statSync(filename).isDirectory())
            filename = path.join(filename, 'index.html');

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                resp.sendText(500, err);
            }
            var contentType = resp.header(filename);
            resp.sendSuccess(file, contentType);
        });
    });
}

function pong(result) {
    result.sendText(200, 'pong');
}

function processService(resp) {
    resp.onReceivedData(function(body){
        try{
            var service = require("./server/" + resp.urlArg(2) + "Service");

            var func = service[resp.urlArg(3)];
            if(!func){
                resp.sendText(500, "Method not found");
                return;
            }

            if(body){
                body = JSON.parse(body);
            }

            var ret = func.apply(service, [ body ]);
            ret.done(function(result){
                result = JSON.stringify(result);
                resp.sendSuccess(result || 'void', 'text/json');
            });
        }catch(e){
            console.log(e);   
            resp.sendText(500, "Service not found");
            return;
        }
    });
} 

function mongoReset (resp, chain){
    require('./server/MongoHelper').init(function() {
        var mongoHelper = require('./server/MongoHelper');
        if (!mongoHelper.db) {
            console.log("DB is undefined");
            resp.sendText(500, "Sorry!! Something went wrong!!!");
            return;
        }

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
if(process.argv[2] == "clearCache"){
    console.log("Clear Require Cache Active");
    serv.before('/', clearRequireCache);
}

serv.action('/ping', pong);
serv.action('/s', processService);
serv.before('/s', mongoReset);
serv.action('/', processStatic);
serv.listen(parseInt(port, 10), ip_address);