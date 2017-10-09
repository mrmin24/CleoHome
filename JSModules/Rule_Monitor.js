
var db = require('./dbhandler');
var evaluate = require('../JSModules/Rule_Items_Evaluate');
var rules = require('../JSModules/Rule_UpdateStates');
//var calcTime = require('../JSModules/compareTime');
var pushOver = require('../JSModules/public/scripts/pushOver.js');
var myconsole = require('../JSModules/myconsole.js');

var intervaltime = 1000;

//var timezone = 2;

var latestId = 0;
//var mySensorio = require('socket.io-client');
//var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


//var MQTTio = require('socket.io-client');
//var MQTTsocket = MQTTio.connect('http://localhost:'+ 44607, {'force new connection': true});


var getconfig = require('../JSModules/GetConfig.js');
var writeXML = require('../JSModules/WriteConfig.js');
var configure = getconfig.data;
var configure2 = configure.xml;

//var alarmio = require('socket.io-client');
//var alarmsocket = alarmio.connect('http://localhost:'+ configure2.alarmmodule[0].port[0]);    ////////// add back



var io = require('socket.io').listen(44603);
//function getDate(){
//var hour = '00';
//var date;
//process.env.TZ = 'Africa/Johannesburg' 
//'Africa/Johannesburg'
//date =  new Date();
//date.toLocaleTimeString();
//myconsole.log(date);




const ipc = require('node-ipc');
   

ipc.config.id = 'RuleMonitor';
ipc.config.retry= 1500;
//ipc.config.silent = true;



ipc.connectTo(
    'MQTTParse',
    function(){
        ipc.of.MQTTParse.on(
            'connect',
            function(){
                
                myconsole.log('RuleMon connected to MQTT Parser with IPC ##');
                
            }
        );
        ipc.of.MQTTParse.on(
            'disconnect',
            function(){
               
            }
        );
        
        ipc.of.MQTTParse.on(
            'deviceConnected',
            function(){
               
                myconsole.log('rrrrrrrrrrrrrrrrrrrrrrr   ');
               
            }
        );
        
  });   // end MQTT Parse


ipc.connectTo(
    'mySensParse',
    function(){
        ipc.of.mySensParse.on(
            'connect',
            function(){
                
                myconsole.log('RuleMon connected to mySensParse  with IPC ##');
                
            }
        );
        ipc.of.mySensParse.on(
            'disconnect',
            function(){
               
            }
        );
        
        ipc.of.mySensParse.on(
            'deviceConnected',
            function(){
               
                myconsole.log('qqqqqqqqqqqqqqqqqqqqqqqqq   ');
               
            }
        );
        
    });   // end Mysens Pars










//date = date.getUTCFullYear() + '-' +
 //  ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
  // ('00' + date.getUTCDate()).slice(-2) + ' ' + 
//   ('00' + date.getUTCHours()).slice(-2) + ':' + 
 //  ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
  //  ('00' + date.getUTCSeconds()).slice(-2);
  //  return date;
//}   
    
//var last_check;
// myconsole.log(last_check);
 var socket2;
 
function start() {
    //myconsole.log(debug);
    myconsole.log("Rule Monitor started");
   
    
  

 
 
 clearRules();
	
	if(io)
	{ 
	    myconsole.log('RuleMonitor Module Listening on ' + '44603');
	
	
	    io.sockets.on('connection', function(socket){
	        
	        myconsole.log('Client connected to ruleMonitor');
	  
            socket2 = socket;	  
        	      	  
	  
	    });
	    
	    
	   
	
    
    ruleMonitor();
    
    var timerRules = setInterval(function(){


        ruleMonitor();
        
        
     
    }, intervaltime);
    
	}
    
}

function ruleMonitor(){
    //    myconsole.log('test1'); 
    
     db.getdata('Rules_toCheck',{Select: 'Id,Item_Id,State',whereClause:'Id > ' + latestId },function(err,data_receive){
                   
         if(data_receive[0]){
               
             // myconsole.log("ruleMONxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: " + data_receive[0].Id + " " + data_receive.length);
               
              var j = 0;
               for(var i = 0;i < data_receive.length;i++){
                    
                 
                   // deviceSendUpdate(data_receive[i].Item_Id);   
                    latestId = data_receive[data_receive.length-1].Id;
                    
                     myconsole.log("ruleMONxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx222: " + latestId );
                   
                    evaluate.evaluateChange(data_receive[i].Item_Id,data_receive[i].State,function(node,nodePort,state,virtual,cancelTime,func){
                        
                          j++;
                        eval(func);             
                       //  myconsole.log("rule items are: " + node + "   " + nodePort + "    " + state );
                         if(node && nodePort && state){
                        //  myconsole.log("rule items are2: " + node + "   " + nodePort + "    " + state );
                         	  //  mySensorsocket.emit('deviceSwitch',node,port,state,1,0);
                         	  
                         	  myconsole.log("ruleMONxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv222: ");
                         	  myconsole.log( node + "    " + nodePort + "    " + state);
                         	    
                         	    
                         	     ipc.of.mySensParse.emit('deviceSwitch',
                                 {
                                  "NodeID":node,
                                  "NodePort":nodePort,
                                  "State":state,
                                  "RuleReq":1,
                                  "NodeTimeOn":0
                                  
                                 }
                                );
                         	
                         	
                         	
                         	
                         	      ipc.of.MQTTParse.emit('deviceSwitch',
                                 {
                                  "NodeID":node,
                                  "NodePort":nodePort,
                                  "State":state,
                                  "RuleReq":1,
                                  "NodeTimeOn":0
                                  
                                 }
                                );

                         
                         }
                        //myconsole.log(cancelTime);
                         if(cancelTime != null){
                                     
                           //  mySensorsocket.emit('switchOff',node,nodePort,0,virtual,cancelTime);
                             
                              ipc.of.mySensParse.emit('switchOff',
                                 {
                                  "NodeID":node,
                                  "NodePort":nodePort,
                                  "State":0,
                                  "virtual":virtual,
                                  "offTime":cancelTime
                                  
                                 }
                                );
                         }
                         
                         
                         if(virtual == 1){
                           var  data = {Set:'Item_Current_Value',Where:'Id',Current_State:state,Name:node};
                            
                            db.update('Items',data,function(){});  
                            rules.updateRuleStates(node, state);
                           
                             
                         }
                         
                         
                         
                         
                        
                         if(j == data_receive.length){
                             myconsole.log("Clear2");
                             latestId = data_receive[data_receive.length-1].Id;
                             myconsole.log(latestId);
                       
                               db.deletedata('Rules_toCheck',{whereClause:'Id <= ' + latestId },function(err,result){
                                   
                                   
                                  if(err){
                                      myconsole.log(err);
                                  }else{
                                      
                                     // myconsole.log("rules cleared: " + result);
                                      
                                  } 
                               });
                               
                         }
                         
                         
                         
                         
                        
                     });
                 
                        
                 
                 
               
               }
               
               
               
               
               
               
               
               
               
            }else{
                if (err) {
                    // error handling code goes here
                    myconsole.log("ERROR (GetRules) : ",err);            
                }
            
                
            }
	
   
        });
    
       
}
                   
function clearRules(){
    
     myconsole.log("clearing old rules");
     db.deletedata('Rules_toCheck',{whereClause:'Id > 0' },function(err,result){
                   
                   
      if(err){
          myconsole.log(err);
      } 
   });
     
}

function sendPanic(){
    alarmsocket.emit('panic',function(){
         myconsole.log('Panic');
        
       
     });
    
}


function armDisarm(type){
    
    alarmsocket.emit('armDisarmAlarm',type);
}
                   
         


function speak(msg){
           myconsole.log('speak');
      
       socket2.emit("speak",msg);
        
    
}
    
    
function deviceSendUpdate(Id){
          
      
       socket2.emit("deviceUpdate",Id);
        
}    
    

    
exports.start = start;                   