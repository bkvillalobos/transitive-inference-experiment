// A very basic web server in node.js
// Heavily borrowed from: Node.js for Front-End Developers by Garann Means (p. 9-10) 
 
var port = 8000;
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
        ".php": "application/php",
        ".css": "text/css",
        ".txt": "text/plain",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".png": "image/png",
        ".ico": "image/ico",
        ".opn": "text/open",
        ".sav": "text/sav"

    };
    var isValidExt = validExtensions[ext];
    //console.log(filename)
    //console.log(path.extname(filename))
    if(!isValidExt){
        tempName = filename.substring(0, filename.length - now.getTime().toString().length);
        var isValidExt = validExtensions[path.extname(tempName)];
        if(isValidExt){
            filename =tempName;
        }

    }
 
    if (isValidExt) {
        
        localPath += filename;
        fs.exists(localPath, function(exists) {
            if(exists) {
                console.log("Serving file: " + localPath);
                console.log('localPath: ' + localPath)
                getFile(localPath, res, ext);
                
            } 
            else if(path.extname(filename) === ".opn"){
              fs.writeFile('output.txt', parseData(filename), function (err) {
                if (err) return console.log(err);
                //console.log( filename + ' > output.txt err:' + err);
                });
            }
            else if(path.extname(filename) === ".sav"){
              fs.appendFile('output.txt', parseData(filename), function (err) {
                if (err) return console.log(err);
                //console.log( filename + ' > output.txt');
              });
            }
            else {
              console.log("File not found: " + localPath);
              res.writeHead(404);
              res.end();
            }
        });
 
    }
    else {
        console.log("File not found: " + filename)
    }
 
}).listen(port, serverUrl);

function parseData(data){
  data = data.substring(1, data.length - 4)
  data = data + "\n"
  return data;
}



function getFile(localPath, res, mimeType) {
    
    fs.readFile(localPath, function(err, contents) {
        if(!err) {
            
            res.setHeader("Content-Length", contents.length);
            res.setHeader("Content-Type", mimeType);
            res.statusCode = 200;
            res.end(contents);
            //console.log("happening!")
        } else {
            res.writeHead(500);
            res.end();
        }
    });
}