var HOME = './../..';
var Server = require(HOME + '/server/Server.js');

exports.stack = function(t){

	t.module("ServerTest");

	t.test('find path test', function() {
        var serv = Server.server();
                
        serv.action('/s/test', function(){
           return {
                path : '/s/test'
           };
        });
        
        serv.action('/s', function(){
           return {
                path : '/s'
           };
        });
        
        serv.action('/static', function(){
           return {
                path : '/static'
           };
        });
        
        serv.action('/', function(){
           return {
                path : '/'
           };
        });
        
        var obj = serv.action('/s/test')();
        t.equal(obj.path, "/s/test");
        
        obj = serv.action('/s/exec')();
        t.equal(obj.path, "/s");
        
        obj = serv.action('/exec')();
        t.equal(obj.path, "/");
        
        obj = serv.action('/static/img')();
        t.equal(obj.path, "/static");
        
	});
    
}