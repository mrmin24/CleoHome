var net = require('net');

var gatewayip = '10.0.0.22';
var gatewayport = '5003';
var actual = new net.Socket();
//var alarmio = require('socket.io-client');
//var actual = alarmio.connect(gatewayip + gatewayport);


function start() {
var io = require('socket.io').listen(44606);
if(io)
{ console.log('MySensor Module Listening on ' + '44606');}


io.sockets.on('connection', function(socket){
  console.log('Client connected to mysensor Parser');
 // var data = 'Alarm';
	
	 socket.on('deviceSwitch',function(NodeId,NodePort,State){
	 	
	 	
	 	//console.log("sending data");
	 	sendData(NodeId,NodePort,State)	;
	 	
	 });
	 
	 
	 
	 
	function processData(data){
    
    	
    	if(data[2] == 1){
    		socket.emit("deviceStatusChange",data[0],data[1],data[5]);
    	}
    	
    }       

		
	
   // actual.on('connect', function() {
	  //  console.log('Mysensors: Gateway connected');

     //   actual.emit('data','20;1;1;0;2;0');
//	});	

		
		connect();
	//	ping(function(err,answer){
	  	//	if(answer){
	  	function connect(){
			//	actual.connect({port: configure2.alarm[0].port[0], host:configure2.alarm[0].ip[0]}, function() {
				actual.connect({port: gatewayport, host:gatewayip}, function() {
				    //console.log('Mysensors: Gateway connected');
			        
                	                
				});
				
				
				var gatewayinterval = setInterval(function() {
								
								clearInterval(gatewayinterval);
								connect();
				        
				    } ,10000);
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
			
		console.log("Mysensors: Gateway connection error = " + e);	
	//	 eventEmitter.emit('Alarms_connection_status',0);
		 
	//	  client.setInterval(function() {
		  	
	//	  	ping(function(err,answer){
	//	  		if(answer){
	//	            client.connect(config.actualport, config.actualhost, function(){
	//	                console.log('Alarm Module: Alarm connected2');
	//	                eventEmitter.emit('Alarms_connection_status',1);
	//		 			logdata('{"Status":"Alarm connected2"}');
	//	            });
	//	  		}
	//	  	});
	//	    },5000);
		 
	});
		
	actual.on('close', function() {
			
		console.log("Mysensors: Gateway connection closed" );	
	//	eventEmitter.emit('Alarms_connection_status',0);
		
	//	logdata('{"Status":"Alarm disconnected"}');
		// retryconnect();
			
	});
		
	actual.on('timeout', function() {
			
		console.log("Mysensors: Gateway connection timeout" );	
		// eventEmitter.emit('Alarms_connection_status',0);
		  //actual.destroy();
		 //retryconnect();
			
	});
	
	
	actual.on('disconnect', function() {
		
	console.log("Mysensors: Gateway connection disconnected" );	
	// eventEmitter.emit('Alarms_connection_status',0);
	  //actual.destroy();
	 //retryconnect();
			
	});
	
	actual.on('data', function(data) {
    	var dataslice = data.toString().replace(/[\n\r]/g, '').split(';');
       // console.log(dataslice);    
        
        processData(dataslice);
  
	});
	
    	
    	
    function sendData(NodeId,NodePort,State){		
    	 actual.write(NodeId.toString()+';'+NodePort.toString()+';1;1;2;'+State.toString()+'\n',function(){
       
                       //console.log('data sent');
                   });
    }
                   
                   
});

}
                   
exports.start = start;                   