

var myconsole = require('../myconsole.js');

 const ipc = require('node-ipc');
ipc.config.id = 'Server';
ipc.config.retry= 1500;
//ipc.config.silent = true;





ipc.connectTo(
    'MQTTParse',
    function(){
        ipc.of.MQTTParse.on(
            'connect',
            function(){
                
                console.log('## connected to MQTT Parser with IPC ##');
                
                
                ipc.of.MQTTParse.on(
                    'deviceConnected',
                    function(data){
                       
                        console.log('vvvvvvvvvvvvvvvvvvvvv   ' + data['NodeID']);
                       
                    }
                );
                
                
            }
        );
        ipc.of.MQTTParse.on(
            'disconnect',
            function(){
               
            }
        );
        
        
        
        ipc.of.MQTTParse.on('deviceStatusChange',function(nodeData){
            
            
           
           
       });    //devicestatuschange
    }
);

