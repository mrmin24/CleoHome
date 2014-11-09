var nap = require('./nodealarmproxy.js');
var config = require('./config.js'); //comment this out
var log = require('./logger.js');
var db = require('./dbhandler');

var port = 44601;
var client = 0;
var sockets;


function start() {

var io = require('socket.io').listen(port);
if(io)
{ console.log('Listening on ' + port.toString());}


var https = require('https');
	pollAlarm();
	
var alarm = nap.initConfig({ 
    password:config.password, //replace config.* with appropriate items
	serverpassword:config.serverpassword,
	actualhost:config.host,
	actualport:config.port,
	serverhost:'0.0.0.0',
	serverport:config.port,
	zones:config.zones,
	partitions:config.partitions,
	proxyenable:config.proxyEnabled,
	atomicEvents:true
});




io.sockets.on('connection', function(socket){
  console.log('Client connected');
 // var data = 'Alarm';
    sockets = socket;
    socket.on('register',function(data){
     console.log(data.client + ' registered for ' + data.type + ' events');
     client = 1; 
    
    });
 
    
    socket.on('disconnect',function(){
     
     console.log('Client Disconnected');
     
     if(this.server.sockets.sockets.length ==0)
     {
         client = 0;
         console.log('All clients disconnected');
         
     }
    });   
    
    
    socket.on('armDisarm',function(type){
        
        
        
        if(type == 'Away'){
            
            nap.manualCommand('0301',false,function(ack,nack){
                
                if(ack){
                
                 console.log('Away mode');
                
                 
               }else if(nack)
                 {
                
                 console.log('Away mode failed');
                 
                 
                }
                
                
            });
            
        }else if(type == 'Stay' ){
            
            nap.manualCommand('0311',false,function(ack,nack){
                
                if(ack){
                
                 console.log('Stay mode');
                
                 
               }else if(nack)
                 {
                
                 console.log('Stay mode failed');
                 
                 
                }
                
                
            });
            
           
            
            
            // while(nap.ackReceived != '031') {}
            
            
        }else if(type == 'Disarm'){
            
          db.getdata('Alarm_Items',{Select: 'Current_State',whereClause:"Type LIKE '%6%' ORDER BY Id DESC LIMIT 1"},function(err,data_receive){
                
                if(err){
                    
                    
                }
                else if(data_receive){
                    
                
                    var currentState = data_receive[0]['Current_State'];
                    
                   
                        // console.log(currentState);
                    
                        if(currentState == 10)
                        {
                            nap.manualCommand('0711**',false,function(ack,nack){
                
                                if(ack){
                                
                                 console.log('Night mode cancelled');
                                 
                                    nap.manualCommand('0401',true,function(ack,nack){
                
                                    if(ack){
                                    
                                     console.log('Disarmed');
                                    
                                     
                                   }else if(nack)
                                     {
                                    
                                     console.log('Disarm Failed');
                                     
                                     
                                    }
                                    
                                    
                                });
                                
                                 
                               }else if(nack)
                                 {
                                
                                 console.log('Night mode cancell failed');
                                 
                                 
                                }
                                
                                
                            });
                                
                           
                        }
                        else 
                        {
                            
                            nap.manualCommand('0401',true,function(ack,nack){
                            
                          
                            
                                if(ack){
                                 console.log('Disarmed');
                                    
                                 
                                }else if(nack)
                                     {
                                    
                                     console.log('Disarm failed');
                                     
                                     
                                    }
                            });
                           
                          
                           
                            
                        } 
                    
                }
            });
        }
            
        else if(type == 'Night'){
            
            db.getdata('Alarm_Items',{Select: 'Current_State',whereClause:"Type LIKE '%6%' ORDER BY Id DESC LIMIT 1"},function(err,data_receive){
                
                if(err){
                    
                    
                }
                else if(data_receive){
                    
                
                    var currentState = data_receive[0]['Current_State'];
                    
                  
                        // console.log(currentState);
                    
                        if(currentState == 7)
                        {
                            nap.manualCommand('0711*1',false,function(ack,nack){
                
                                if(ack){
                                
                                 console.log('Night mode');
                                  log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + 1,Current_State: 10  });
                                 
                               }else if(nack)
                                 {
                                
                                 console.log('Night mode failed');
                                 
                                 
                                }
                                
                                
                            });
                                
                           
                        }
                        else if(currentState == 3 || currentState == 5 || currentState == 11 || currentState == 13)
                        {
                            
                            nap.manualCommand('0311',false,function(ack,nack){
                            
                          
                            
                                if(ack){
                                 console.log('Stay mode');
                                    
                                 nap.manualCommand('0711*1',false,function(ack,nack){
                
                                    if(ack){
                                    
                                     console.log('Night mode');
                                    log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + 1,Current_State: 10  });
                                     
                                   }else if(nack)
                                     {
                                    
                                     console.log('Night mode failed');
                                     
                                     
                                    }
                                    
                                    
                                });
                                }else if(nack)
                                     {
                                    
                                     console.log('Stay mode failed');
                                     
                                     
                                    }
                            });
                           
                          
                           
                            
                        } 
                    
                }
            });
        }else if(type == 'cancelNight'){
            
            
                    nap.manualCommand('0311',false,function(ack,nack){
        
                        if(ack){
                            
                            
                                 console.log('Night mode cancelled');
                                 // log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + 1,Current_State: 10  });
                                 
                               
                                
                                
                            
                        
                         // log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + 1,Current_State: 10  });
                         
                       }else if(nack)
                         {
                        
                         console.log('Night mode cancel failed');
                         
                         
                        }
                        
                        
                    });
                        
                           
                       
                    
                
            
        }
        
        
        
    });
    
    
     socket.on('bypassZones',function(zone,callback){
         
         
        
             
          nap.manualCommand('0711*1'+ zone +'#',false,function(ack,nack){
            
            if(ack){
            
           
            console.log("Zone "+ zone + " bypassed");
            callback(false,true);
             
           }else if(nack){
            
            callback(true,false);
             
            }
            
            
        });
         
         
         
          
          
     });
    
    alarm.on('keypadLedState', function(data) {
	     sockets.emit('keypadLedState', {state: data});
    });
    
});

//if (config.access_token && config.app_id) {
	//SmartThings is setup/enabled
	
//}




alarm.on('data', function(data) {
    logdata(data);
	 
});

alarm.on('zoneupdate', function(data) {
	 logdata(data);
});

alarm.on('partitionupdate', function(data) {
    logdata(data);
    

});

alarm.on('partitionuserupdate', function(data) {
	logdata(data);
});

alarm.on('systemupdate', function(data) {
	logdata(data);
});

alarm.on('other', function(data) {
	logdata(data);
});




}
var watchevents = ['500','601','602','609','610','650','651','653','625','626','652','654','655','656','657',/*'659'*/,'670','700','701','702','750','751','800','801','802','803','829'];
var alarmcode = ['601','605','620','621','625','654'];


function logdata(data) {
    
    var important = isImportant(data);
    //console.log(important);
    if(important)
    {
      log.logger('Alarm', '{"Important":"' + important +'"}'); 
    }
    
   if (watchevents.indexOf(data.code) != -1) {	
       //console.log(data.pre +' ' + data.zone + ' ' + data.post);
       if(data.pre == 'Zone')
       {
           if(alarmcode.indexOf(data.code) != -1) {
            log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Zone_' + data.zone,Current_State: data.send,Alarm_Event:Date()});
            
            sockets.emit('AlarmEvent', {Zone: data.zone, Current_State: data.send,Alarm_Event:Date()});
           }else{
                log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Zone_' + data.zone,Current_State: data.send });
            if(client)
            {
                sockets.emit('AlarmEvent', {Zone: data.zone, Current_State: data.send});
            }
           }
            
       }
       else if(data.pre == 'Partition')
       {
           if(data.code == '652')
           {
               var state;
               switch(data.mode){
                   case '0':   getState("'Armed in Away Mode'", function (result){
                       
                      if(result) {
                       log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + data.partition,Current_State: result  });
                       
                       if(client)
                        {
                            sockets.emit('AlarmEvent', {Partition: data.partition, Current_State: result});
                        }
                          
                      }
                       
                   });
                   break;
                   
                   
                   case '1':      getState("'Armed in Stay Mode'", function (result){
                       
                     if(result) {
                       log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + data.partition,Current_State: result  });
                       
                       if(client)
                        {
                            sockets.emit('AlarmEvent', {Partition: data.partition, Current_State: result});
                        }
                     }
                   });
                    
                   break;
                   
                   
                   case '2':  getState("'Armed in Zero_Entry_Away Mode'", function (result){
                       
                     if(result) {
                       log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + data.partition,Current_State: result  });
                       
                       if(client)
                         {
                            sockets.emit('AlarmEvent', {Partition: data.partition, Current_State: result});
                        }
                     }
                   });
                   break;
                   
                   
                   case '3':  getState("'Armed in Zero_Entry_Stay Mode'", function (result){
                       
                      if(result) {
                       log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + data.partition,Current_State: result  });
                       
                       if(client)
                         {
                            sockets.emit('AlarmEvent', {Partition: data.partition, Current_State: result});
                        }
                      }
                   });
                   break;
                   
                   default: {}
                   
               }
              
           }
           else{
               
               
            log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Name',Name: 'Partition_' + data.partition,Current_State: data.send });
           
             if(client)
            {
                sockets.emit('AlarmEvent', {Partition: data.partition, Current_State: data.send});
            }       
           }
       }
       else
		{
		    log.logger('Alarm', '{"Status":"' + data.pre + ' ' + data.post+'"}'); 
		}
		
	} 
    
}

function pollAlarm(){
    
    	setInterval(function() {nap.manualCommand('000',false,function(ack,nack){
    	    
    	    
    	    
    	    
    	})},60000);
    
    
}



function getState(requiredState,callback){
    
    db.getdata('Alarm_States',{Select: 'Id',whereClause:'State = ' + requiredState},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                          callback(data_receive[0]['Id']);
                        }
                       
                   });

    
    
}

function isImportant(data){
    
    var important = ['652','654','655','800','801','802','803'];
    var zoneAlarms = ['601','603','605'];
    var importantZones=['001','016'];
    var importantZoneEvents = ['609'];
    // console.log("Checking for important Event " + data.code + " " + data.zone);
    
    if (important.indexOf(data.code) != -1) {
        
     //console.log("Important Event " + data.code);
     if(zoneAlarms.indexOf(data.code) != -1) {
        var message = data.pre + "_" + data.zone + " " + data.post; 
     }
     else{
        var message = data.pre + " " + data.post;
     }
     
     return message;   
     
     
        
    }
    else
    {
        if(importantZones.indexOf(data.zone) != -1 && importantZoneEvents.indexOf(data.code) != -1 ) {
         
        // console.log("Important Event " + data.code);   
        var message = "Zone_" + data.zone + " " + data.post;
         return message;   
         
            
        }
        
        else
        {
            
            return null;
        }
        
    }
    
    
    
    
}


exports.start = start;