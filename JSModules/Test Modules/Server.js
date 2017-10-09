
const ipc = require('node-ipc');

var myconsole = require('../myconsole.js');


ipc.config.id = 'MQTTParse';
ipc.config.retry= 1500;
//ipc.config.silent = true;
//ipc.config.rawBuffer=true;

//ipc.config.maxConnections=1;

ipc.serve(
    function(){
        
        ipc.server.on(
            'socket.disconnected',
            function(data,socket){
                console.log("Client disconnected");
                //console.log('DISCONNECTED\n\n',arguments);
            }
        );
        
        
        ipc.server.on(
            'connect',
            function(socket){
                
                console.log(socket);
            	console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
                ipc.server.broadcast(
                     'deviceConnected',
                    {
                      "NodeID":1,
                      "NodePort":2,
                      "State":0,
                      "RuleReq":0,
                      "NodeTimeOn":3
                      
                     }
                );
            }
        );
        
    }
);


ipc.server.start();
