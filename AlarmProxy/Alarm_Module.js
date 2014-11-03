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
    
    	setInterval(function() {nap.manualCommand('000')},60000);
    
    
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




exports.start = start;