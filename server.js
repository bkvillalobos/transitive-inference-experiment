// A very basic web server in node.js
// Heavily borrowed from: Node.js for Front-End Developers by Garann Means (p. 9-10) 
 
var port = 8080;
var serverUrl = "127.0.0.1";
 
var app = require('express');
var http = require("http");
var path = require("path"); 
var fs = require("fs");
         
 
console.log("Starting web server at " + serverUrl + ":" + port);
 
var server = http.createServer( function(req, res) {
 
    var now = new Date();
 
    var filename = req.url || "index.html";

    var ext = path.extname(filename);
    var localPath = __dirname;
    var validExtensions = {
        ".html" : "text/html",          
        ".js": "application/javascript", 
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png",
        ".ico": "image/ico"
    };
    var isValidExt = validExtensions[ext];
    if(!isValidExt){
        console.log(filename)
        console.log(now.getTime())
        tempName = filename.substring(0, filename.length - now.getTime().toString().length);
        var isValidExt = validExtensions[path.extname(tempName)];
        if(isValidExt){
            filename =tempName;
        }
        console.log(filename)
    }
 
    if (isValidExt) {
        
        localPath += filename;
        path.exists(localPath, function(exists) {
            if(exists) {
                console.log("Serving file: " + localPath);
                console.log('localPath: ' + localPath)
                if(filename === "/pics/green.png"){
                    console.log("file true!");
                    goArduino();
                };
                getFile(localPath, res, ext);
            } else {
                console.log("File not found: " + localPath);
                res.writeHead(404);
                res.end();
            }
        });
 
    } else {
        console.log("Invalid file extension detected: " + ext)
    }
 
}).listen(port, serverUrl);

server.on('request', function(req, res){console.log("yes!")});
 
function getFile(localPath, res, mimeType) {
    console.log("happening!")
    fs.readFile(localPath, function(err, contents) {
        if(!err) {
            res.setHeader("Content-Length", contents.length);
            res.setHeader("Content-Type", mimeType);
            res.statusCode = 200;
            res.end(contents);
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}

var j5 = require("johnny-five");
var board = new j5.Board();
var LEDPIN = 13;
var OUTPUT = 1;
var val = 0;
board.on("ready", function(){
      // Set pin 13 to OUTPUT mode

      this.pinMode(LEDPIN, OUTPUT);

    });

    

function goArduino(){
    console.log('got here')
    if(board){
        console.log('and here?')
        board.digitalWrite(LEDPIN, 1);
        setTimeout(function(){board.digitalWrite(LEDPIN, 0)}, 2000);
    }
}
