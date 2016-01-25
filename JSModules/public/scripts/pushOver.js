var getconfig = require('../../GetConfig.js');
var configure = getconfig.data;
var configure2 = configure.xml;


exports.push = function(message){
        
        console.log('pushing message');
        var user = configure2.pushOver[0].user[0];
        var token = configure2.pushOver[0].token[0];
       // var message = 'test';
        var device = 'Z5Marius';
        
        
        ////////////////
        
        var Pushover = require('node-pushover');
        var push = new Pushover({
            token: token
        });
        
       
        
        // A callback function is defined:
        push.send(user, "Cleopatra", message, function (err, res){
            if(err){
                console.log("We have an error:");
                console.log(err);
                console.log(err.stack);
            }else{
                console.log("Message send successfully");
               // console.log(res);
            }
        });
        
        
        
        
    }