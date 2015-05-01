// Transitive Inference Task
// Brendon Villalobos


var port = 8000;
var serverUrl = "127.0.0.1";
 
var app = require('express');
var http = require("http");
var path = require("path"); 
var fs = require("fs");
var args = process.argv.slice(2);
var strainID, subjectID;

validation();
var dateString = makeDate();
var folder = "trialData";
var outputFile = folder + "/" + strainID + "-" + subjectID + "-" + dateString + ".csv"
console.log(outputFile);
         
console.log("Starting web server at " + serverUrl + ":" + port);
var fileList = fs.readdirSync("./pics");
//console.log(fileList);

//+ Shuffle Algorithm taken from Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
fileList = shuffle(fileList);
//console.log(fileList);
var picArray = Array();
var i = 0;
while(picArray.length < 5){
    if(fileList[i] != "green.png" && fileList[i].substring(0,1) != "."){
        picArray.push(fileList[i]);
    }
    i = i + 1;
}
//console.log(picArray);
 
var server = http.createServer( function(req, res) {
 
    var now = new Date();
 
    var filename = req.url || "index.html";

    var dataHeader = "subject_id,trial,correct_response,response_time,trial_timeout,timeout_time,interTrial_timeout,left_image,right_image\n";
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
            filename = tempName;
        }
    }
    console.log("./pics/" + picArray[filename.substring(6,7)]);
    if (isValidExt) {
        localPath += filename;
        fs.exists(localPath, function(exists) {
            if(exists) {
                console.log("Serving file: " + localPath);
                console.log('localPath: ' + localPath);
                
                getFile(localPath, res, ext); 
            } 
            else if(!isNaN(filename.substring(6,7))){
                //console.log("got here!")
                getFile("./pics/" + picArray[parseInt(filename.substring(6,7))], res, ext);
            }
            // delete this, and the other .opn stuff later
            else if(path.extname(filename) === ".opn"){
              fs.writeFile(outputFile, parseData(filename), function (err) {
                if (err) return console.log(err);
                //console.log( filename + ' > outputFile err:' + err);
                });
            }
            else if(path.extname(filename) === ".sav"){
              fs.writeFile(outputFile, dataHeader, function (err) {
                if (err) return console.log(err);
                //console.log( filename + ' > outputFile');
              });
              fs.appendFile(outputFile, parseData(filename), function (err) {
                if (err) return console.log(err);
                //console.log( filename + ' > outputFile');
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
        console.log("File not found: " + filename);
    }
 
}).listen(port, serverUrl);

function parseData(data){
  data = data.substring(1, data.length - 4);
  data = data.split(";").join("\n");
  //data = data + "\n"
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

function usage(){
    console.log("server_two.js usage:");
    console.log("node server_two.js [strain_id] [subject_id]");
    console.log("Starts server for TI task with subject");
}

function validation(){
    console.log(args);
    if(args.length != 2){
        console.log("Error: incorrect number of parameters");
        usage();
        process.exit();
    }
    else if(args[0].length != 4){
        console.log("Error: Strain ID is not 4 characters");
        process.exit();
    }
    else if(args[1].length != 8){
        console.log("Error: Subject ID is not 8 characters");
        process.exit();
    }
    else{
        strainID = args[0];
        console.log("Species Strain ID: " + args[0]);
        subjectID = args[1];
        console.log("Subject ID: " + args[1]);
    }
}

function makeDate(){
    fileDate = new Date();
    // add year
    returnString = fileDate.getFullYear().toString();
    // add month
    if((fileDate.getMonth() + 1).toString().length != 2){
        returnString = returnString + "-0" + (fileDate.getMonth() + 1).toString();
    }
    else{
        returnString = returnString + "-" + (fileDate.getMonth() + 1).toString();
    }
    // add date
    if(fileDate.getDate().toString().length != 2){
        returnString = returnString + "-0" + fileDate.getDate().toString();
    }
    else{
        returnString = returnString + "-" + fileDate.getDate().toString();
    }
    // add hours
    if(fileDate.getHours().toString().length != 2){
        returnString = returnString + "-0" + fileDate.getHours().toString();
    }
    else{
        returnString = returnString + "-" + fileDate.getHours().toString();
    }
    // add minutes
    if(fileDate.getMinutes().toString().length != 2){
        returnString = returnString + "0" + fileDate.getMinutes().toString();
    }
    else{
        returnString = returnString + fileDate.getMinutes().toString();
    }
    console.log("Timestamp: " + returnString);

    return returnString; 
}



