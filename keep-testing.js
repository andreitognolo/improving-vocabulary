var fs = require("fs");
var color = require("colors");
var Notification = require('node-notifier');

var test = process.argv[2];

if(!test){
    console.log("[SCRIPT USAGE]".yellow);
    console.log("nodejs keep-testing.js ./util/DomainUtilTest".yellow);
    console.log("[Test must be runned without ./test folder]".yellow);
    process.exit(0);
}

function header(){
 console.log('   ______    __  __    ___     _   __   ______    ______           ____     ______  ______    ______   ______  ______    ______    ____  '.yellow);
            console.log('  / ____/   / / / /   /   |   / | / /  / ____/   / ____/          / __ \\   / ____/ /_  __/   / ____/  / ____/ /_  __/   / ____/   / __ \\ '.yellow);
            console.log(' / /       / /_/ /   / /| |  /  |/ /  / / __    / __/            / / / /  / __/     / /     / __/    / /       / /     / __/     / / / /'.yellow);
            console.log('/ /___    / __  /   / ___ | / /|  /  / /_/ /   / /___           / /_/ /  / /___    / /     / /___   / /___    / /     / /___    / /_/ / '.yellow);
            console.log('\\____/   /_/ /_/   /_/  |_|/_/ |_/   \\____/   /_____/          /_____/  /_____/   /_/     /_____/   \\____/   /_/     /_____/   /_____/ '.yellow);
            console.log('');
}


function listener(path){
    return function(curr, prev){
            header();
            console.log('CHANGED FILE:', path.yellow);

            var exec = require('child_process').exec;
            exec('node ./test/test-runner.js ' + test, function (error, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);

                new Notification().notify({  message: error ? "FAILLLL" : "PASSED" });
            });
    }   
}


function addWatcherSingleFile(path){
    fs.stat(path, function(er, stats){
        if(er){
            throw er;    
        }
        if(stats.isDirectory()){
           addWatcherDirectory(path);
           return;
        }

        fs.watchFile(path, listener(path));
    });
}

function addWatcherDirectory(name){
    function readFiles(err, files){
        for(var i=0; i < files.length; i++){
            var path = name + "/" + files[i];
            addWatcherSingleFile(path, files);
        }
    }
    fs.readdir(name, readFiles);
}

addWatcherDirectory("./test");
addWatcherDirectory("./server");
addWatcherSingleFile("./keep-testing.js");
listener(test)();