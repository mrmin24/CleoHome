//var PlexAPI = require("plex-api");
//var server = new PlexAPI("10.0.0.5");
var PlexControl = require("plex-control").PlexControl;

var serverIP = "10.0.0.5";
var clientIP = "10.0.0.6";
 
/*server.query("/clients").then(function (result) {
    console.log("%s running Plex Media Server v%s",
        result.friendlyName,
        result.version);
 
    // array of children, such as Directory or Server items 
    // will have the .uri-property attached 
    console.log(result._children);
}, function (err) {
    throw new Error("Could not connect to server");
});*/




 

 
// ..or assigning client by IP address 
control = new PlexControl("10.0.0.5", "10.0.0.6");

control.playback.pause();


control.currently.playing().then(function(result){
    if (!result) {
        console.log("Nothing is currently playing");
    } else {
        console.log("Currently playing a %s titled: %s",
            result.attributes.type,
            result.attributes.title);
    }
});