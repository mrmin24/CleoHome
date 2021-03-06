var net = require('net');
var elink = require('./envisalink.js');
var events = require('events');
var log = require('./logger.js');
var myconsole = require('../JSModules/myconsole.js');
var eventEmitter = new events.EventEmitter();
//var config = require('./config.js');
var connections = [];
var alarmdata = {
	zone:{},
	partition:{},
	user:{}
};

var configure = require('../JSModules/GetConfig.js');
var configure2 = configure.data.xml;

//myconsole.log(configure2.alarm[0].password[0]);
var password = configure2.alarm[0].password[0];
	var actual = new net.Socket();

var server, config;
var ackReceived = null;
var nackReceived = null;
var ackStatus = null;
var acktimer1,connectTimer;
var config2;
var connected = 0;
var alarmip = '192.168.2.20';
var alarmport = '4025';

function checkAlarmConnected(){
		
		ping(function(err,answer){
			
			if(!answer){
				connected = 0;
				//myconsole.log('Alarm Module: Alarm unavailable');
				eventEmitter.emit('Alarms_connection_status',19,connected);
	 			//logdata('{"Status":"Alarm disconnected"}');
	 			connect();
				
			}else{
			//	myconsole.log('Alarm Module: Alarm available');
				eventEmitter.emit('Alarms_connection_status',18,connected);
	 			//logdata('{"Status":"Alarm connected"}');
	 			//getNewStatus();
			}
			
			
		})	;
		
	}	
	
exports.initConfig = function(initconfig) {
 
	
	config = initconfig;
	
	if (!config.actualport) {
		config.actualport = configure2.alarm[0].port[0];
	}
	if (!config.proxyenable) {
		config.proxyenable = configure2.alarm[0].proxyEnabled[0];
	}
	

		
	
	
	setInterval(checkAlarmConnected,5000);
		
	connect();
//	ping(function(err,answer){
  	//	if(answer){
  	function connect(){
		//	actual.connect({port: configure2.alarm[0].port[0], host:configure2.alarm[0].ip[0]}, function() {
		actual.connect({port: alarmport, host:alarmip}, function() {
		myconsole.log('Alarm Module: Alarm connected');
		connected = 1;
		eventEmitter.emit('Alarms_connection_status',18,1);
 		logdata('{"Status":"Alarm connected"}');

		});
  	}

  	//	}
//	});
   
    
    process.on('uncaughtException', function(err) {
    if(err.code == 'EHOSTUNREACH'){
        //retryconnect();
    }
    
    //eventEmitter.emit('Alarms_connection_status',0);
	//	 actual.destroy();
	});
		
		
	actual.on('error', function(e) {
			
			
		/*	if(e.code == 'ECONNREFUSED') {}  */
			
		myconsole.log("Alarm Module: Alarm connection error = " + e);	
	//	 eventEmitter.emit('Alarms_connection_status',0);
		 
	//	  client.setInterval(function() {
		  	
	//	  	ping(function(err,answer){
	//	  		if(answer){
	//	            client.connect(config.actualport, config.actualhost, function(){
	//	                myconsole.log('Alarm Module: Alarm connected2');
	//	                eventEmitter.emit('Alarms_connection_status',1);
	//		 			logdata('{"Status":"Alarm connected2"}');
	//	            });
	//	  		}
	//	  	});
	//	    },5000);
		 
	});
		
	actual.on('close', function() {
			
		myconsole.log("Alarm Module: Alarm connection closed" );	
	//	eventEmitter.emit('Alarms_connection_status',0);
		
	//	logdata('{"Status":"Alarm disconnected"}');
		// retryconnect();
			
	});
		
	actual.on('timeout', function() {
			
		myconsole.log("Alarm Module: Alarm connection timeout" );	
		// eventEmitter.emit('Alarms_connection_status',0);
		  //actual.destroy();
		 //retryconnect();
			
	});
		
		
		


	

	function loginresponse(data) {
		var loginStatus = data.substring(3, 4);
		//myconsole.log("Data " + data);
		if (loginStatus == '0') {
			//myconsole.log('Incorrect Password :(');
			 logdata('{"Status":"Incorrect Password :("}');
		} else if (loginStatus == '1') {
			//myconsole.log('successfully logged in!  getting current data...');
			 logdata('{"Status":"successfully logged in!  getting current data..."}');
			getNewStatus();
		} else if (loginStatus == '2') {
			//myconsole.log();
			 logdata('{"Status:"Request for Password Timed Out :("}');
		} else if (loginStatus == '3') {
			//myconsole.log('login requested... sending response...');
			 logdata('{"Status":"login requested... sending response..."}');
			sendcommand(actual,'005'+ configure2.alarm[0].envisPassword[0],function(){
			    
			});
		
		}
	}

	function updatezone(tpi,data) {
		var zone = parseInt(data.substring(3,6));
		
		var initialUpdate = alarmdata.zone[zone] === undefined;
		if (zone <= configure2.alarm[0].zones[0]) {
			alarmdata.zone[zone] = {'send':tpi.send,'name':tpi.name,'code':data};
			if (configure2.alarm[0].atomicEvents[0] == 'true' && !initialUpdate) {
				//eventEmitter.emit('zoneupdate', [zone, alarmdata.zone[zone]]);
				
				eventEmitter.emit('zoneupdate',{pre:tpi.pre,zone:data.substring(3,6),code:data.substring(0,3),post:tpi.post,send:tpi.send});
			} else {
				eventEmitter.emit('data',{pre:tpi.pre,zone:data.substring(3,6),code:data.substring(0,3),post:tpi.post,send:tpi.send});
				
			}
		}
	}
	function updatepartition(tpi,data) {
		var partition = parseInt(data.substring(3,4));
		var initialUpdate = alarmdata.partition[partition] === undefined;
		if (partition <= configure2.alarm[0].partitions[0]) {
			alarmdata.partition[partition] = {'send':tpi.send,'name':tpi.name,'code':data};
			if (configure2.alarm[0].atomicEvents[0] == 'true' && !initialUpdate) {
				//eventEmitter.emit('partitionupdate', [partition, alarmdata.partition[partition]]);
				if (data.substring(0,3) == "652") {
						eventEmitter.emit('partitionupdate',{pre:tpi.pre,partition:data.substring(3,4),code:data.substring(0,3),mode:data.substring(4,5),post:tpi.post,send:tpi.send});
				} 
				else {
					eventEmitter.emit('partitionupdate',{pre:tpi.pre,partition:data.substring(3,4),code:data.substring(0,3),post:tpi.post,send:tpi.send});
				}
			} else {
			    	if (data.substring(0,3) == "652") {
				        eventEmitter.emit('data',{pre:tpi.pre,partition:data.substring(3,4),mode:data.substring(4,5),code:data.substring(0,3),post:tpi.post,send:tpi.send});
			    	}
			    	
			   else
			   {
			       	eventEmitter.emit('data',{pre:tpi.pre,partition:data.substring(3,4),code:data.substring(0,3),post:tpi.post,send:tpi.send});
			   }
			}
		}
	}
	function updatepartitionuser(tpi,data) {
		var partition = parseInt(data.substring(3,4));
		var user = parseInt(data.substring(4,8));
		var initialUpdate = alarmdata.user[user] === undefined;
		if (partition <= configure2.alarm[0].partitions[0]) {
			alarmdata.user[user] = {'send':tpi.send,'name':tpi.name,'code':data};
			if (configure2.alarm[0].atomicEvents[0] == 'true' && !initialUpdate) {
				eventEmitter.emit('partitionuserupdate', [user, alarmdata.user[user]]);    ////////////////////update
			} else {
				eventEmitter.emit('data',alarmdata);
			}
		}
	}
	function updatepartitionpower(tpi,data) {
		var code = parseInt(data.substring(0,3));
		myconsole.log("The power code is " + code);
		eventEmitter.emit('power',code);
		
		
		
	}
	
	
	function updatepartitiontrouble(tpi,data) {
		var code = parseInt(data.substring(0,4));
		//myconsole.log("The trouble code is " + code);
		if(code == '8411' || code == '8401'){
		    eventEmitter.emit('trouble',code);
		}
		
		
	}
	
	
	function updatesystem(tpi,data) {
		var partition = parseInt(data.substring(3,4));
		var initialUpdate = alarmdata.system === undefined;
		if (partition <= configure2.alarm[0].partitions[0]) {
			alarmdata.system = {'send':tpi.send,'name':tpi.name,'code':data};
			if (configure2.alarm[0].atomicEvents[0] == 'true' && !initialUpdate) {
				eventEmitter.emit('systemupdate', alarmdata.system);                    ///////////////////update
			} else {
				eventEmitter.emit('data',alarmdata);
			}
		}
	}
	/*function generalresponse(tpi,data) {
		var partition = parseInt(data.substring(3,4));
		var initialUpdate = alarmdata.system === undefined;
		if (partition <= config.partitions) {
			alarmdata.system = {'send':tpi.send,'name':tpi.name,'code':data};
			if (config.atomicEvents && !initialUpdate) {
				eventEmitter.emit('other', alarmdata.system);                    ///////////////////update
			} else {
				eventEmitter.emit('data',alarmdata);
			}
		}
	}*/

	actual.on('data', function(data) {
		var dataslice = data.toString().replace(/[\n\r]/g, ',').split(',');
       // myconsole.log(dataslice);                                                       ////////////activate this for received data for debugging
        
		for (var i = 0; i<dataslice.length; i++) { 
		
			var datapacket = dataslice[i];
			
			if (datapacket !== '') {
				var tpi = elink.tpicommands[datapacket.substring(0,3)];
			//	myconsole.log(tpi);
				if (tpi) {
					if (tpi.bytes === '' || tpi.bytes === 0) {
						myconsole.log(tpi.pre,tpi.post);
					} else {
					//	myconsole.log(tpi.pre,datapacket.substring(3,datapacket.length-2),tpi.post);     //currently logging debug data
						
						if (tpi.action === 'updatezone') {
							updatezone(tpi,datapacket);
						}
						else if (tpi.action === 'updatepartition') {
							updatepartition(tpi,datapacket);
						}
						else if (tpi.action === 'updatepartitionuser') {
							updatepartitionuser(tpi,datapacket);
						}
						else if (tpi.action === 'updatesystem') {
							updatepartitionuser(tpi,datapacket);
						}
						else if (tpi.action === 'loginresponse') {
							loginresponse(datapacket);
						}
						else if (tpi.action === 'coderequired') {
						    manualCommand('200'+ password);
						}else if (tpi.action === 'ack'){
						   
						    ackReceived = datapacket.substring(3,6);
						    ackStatus = true;
						    
						}
						else if (tpi.action === 'nack'){
						   
						    nackReceived = datapacket.substring(3,6);
						    ackStatus = false;
						    
						}else if(tpi.action === 'keypadLedState'){
						    
						    updateLedState(tpi,datapacket.substring(4,5));
						    
						}else if(tpi.action === 'power'){
						    
							updatepartitionpower(tpi,datapacket);
						    
						}else if(tpi.action === 'trouble'){
						    
							updatepartitiontrouble(tpi,datapacket);
						    
						}
						
						
					/*	else{
						     if(tpi.action === '') {
						    generalresponse(tpi,datapacket);
						}*/
					}
					//if (configure2.alarm[0].proxyEnabled[0]) {
					//	broadcastresponse(datapacket.substring(0,datapacket.length-2));
					//}
				}
			}
		}
		//actual.end();
	});
	

	return eventEmitter;
    	
};

function sendcommand(addressee,command,callback) {
	var checksum = 0;
	for (var i = 0; i<command.length; i++) {
		checksum += command.charCodeAt(i);
	}
	
	checksum = checksum.toString(16).slice(-2).toUpperCase();
	
	actual.write(command+checksum+'\r\n');
	if(acktimer1){clearInterval(acktimer1);} 
	
    acktimer1 =  setInterval(function() {
   //myconsole.log("Debug:Current Ack is " + ackReceived );
    if(ackReceived == command.substring(0,3)){
        ackReceived = null;
	
    	if(ackStatus){
    	   // myconsole.log("Debug: Ack received for " + command.substring(0,3) );
    	    clearInterval(acktimer1);
    	    callback(true,false,false);
    	    
    	}else
    	{
    	    //myconsole.log("Debug: NAck received for " + command.substring(0,3) );
    	    clearInterval(acktimer1);
    	    callback(false,true,true);
    	   
    	}
    }else if(nackReceived == '010'){
       // myconsole.log("Debug: Retry request received for " + command.substring(0,3) );
        nackReceived = null;
        clearInterval(acktimer1);
        callback(false,false,true);
        
    }
    	
    },500);
	
	
}

exports.manualCommand = function(command,passwordRequired,callback) {
	if (actual) {
	    if(passwordRequired){
		    sendcommand(actual,command+password,function(ack,nack,retry){
		        if(acktimer1){clearInterval(acktimer1);} 
		        callback(ack,nack,retry);
		        
		        
		    });
	    }
	    else{
	      sendcommand(actual,command,function(ack,nack,retry){
	          if(acktimer1){clearInterval(acktimer1);} 
	          callback(ack,nack,retry);
	          
	      });
	        
	    }
	} else {
	    
	     callback(false,false,false);
		//not initialized
	}
};

exports.getCurrent = function() {
	eventEmitter.emit('data',alarmdata);
};


function logdata(data) {
   
           log.logger('Alarm', data);
      
      
		
} 

function getNewStatus(){
		sendcommand(actual,'001',function(){
			    
			});
}
    
//function getPass(){
    
  //  return config.alarmpassword;
//}

function updateLedState(tpi,datapacket){
    
    //myconsole.log(datapacket);
    eventEmitter.emit('keypadLedState',{code:'510',partition:'1',ledState:datapacket});
    
    
}


function ping(callback) {

        var exec = require('child_process').exec;
        exec("ping -c 3 " + configure2.alarm[0].ip[0], function(error, stdout, stderr) {

            if (stdout.indexOf("3 received") > -1) {
                // myconsole.log("Ping to Alarm Module successful " );
                callback(false,true);
            }
            else if (error) {
               // myconsole.log("Ping to Alarm Module: " + error);
                callback(true,false);
               
            }
            else if (stderr) {
                //myconsole.log("Ping to Alarm Module: " + stderr);
                callback(true,false);
            }else{
                callback(false,false);
            }
        });
        // myconsole.log('test');
    }
   
