var getconfig = require('../../GetConfig.js');
var configure = getconfig.data;
var configure2 = configure.xml;
var myconsole = require('../../myconsole.js');

var debug = 0;

process.argv.forEach(function (val, index, array) {
  if(index == 2){
     
     debug = val;
  }
});

exports.push = function(message){
        
        myconsole.log('pushing message');
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
      //  console.log("debug = " + debug);
        if(debug == 0)
        {
            push.send(user, "Cleopatra", message, function (err, res){
                if(err){
                    myconsole.log("We have an error:");
                    myconsole.log(err);
                    myconsole.log(err.stack);
                }else{
                    myconsole.log("Message sent successfully");
                   // myconsole.log(res);
                }
            });
        }
        
        
        
    }