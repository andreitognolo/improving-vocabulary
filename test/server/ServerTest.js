var HOME = './../..';
var Server = require(HOME + '/Server.js');

exports.stack = function(t){

	t.module("ServerTest");

	t.test('find path test', function() {
        var serv = Server.server();
        
        serv.dynamic('/s', function(){
           return {
                path : '/s'
           };
        });
        
        serv.dynamic('/s/test', function(){
           return {
                path : '/s/test'
           };
        });
        
        var obj = serv.dynamic('/s/test')();
        t.equal(obj.path, "/s/test");
        
        obj = serv.dynamic('/s/exec')();
        t.equal(obj.path, "/s");
        
        
        serv.static('/', function(){
           return {
                path : '/'
           };
        });
        
        serv.static('/static', function(){
           return {
                path : '/static'
           };
        });
        
        obj = serv.static('/exec')();
        t.equal(obj.path, "/");
        
        obj = serv.static('/static/img')();
        t.equal(obj.path, "/static");
        
	});
    
//    t.test('find path test', function() {
//        var serv = Server.server();
//        
//        serv.static('/', function(){
//           return {
//                path : '/'
//           };
//        });
//        
//        serv.dynamic('/s', function(){
//           return {
//                path : '/s'
//           };
//        });
//        
//        var obj = serv.action('/s/test')();
//        t.equal(obj.path, "/s");
//        
//        obj = serv.action('/page')();
//        t.equal(obj.path, "/");
//        
//    });
}