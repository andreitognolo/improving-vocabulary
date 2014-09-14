function startServer(){
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
                var contentType = resp.header(filename);
                resp.sendSuccess(file, contentType);
            });
        });
    }

    function processService(resp) {
        resp.onReceivedData(function(body){
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

    var serv = require('./server/Server').server();
    serv.action('/s', processService);
    serv.action('/', processStatic);
    serv.listen(parseInt(port, 10), ip_address);
}

require('./server/MongoHelper').init(function() {
    
    var mongoHelper = require('./server/MongoHelper');
    if (mongoHelper.db) {
        console.log('database is not undefined');
    } else {
        console.log('ixi... it is undefined');
    }
    
    startServer();
});

