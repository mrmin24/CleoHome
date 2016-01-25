var net = require('net');
var log = require('./logger.js');

var gatewayip = '10.0.0.22';
var gatewayport = '5003';
var actual = new net.Socket();
var retrytimer;
var db = require('./dbhandler');

var Access_Type = 5;
var Irrigation_Type = 6; 
var Motion_Type = 7;
var Power_Type = 10;
var offTimes = [];
var offTimesObjects = {};
var offTimeInterval = 1000;

//var alarmio = require('socket.io-client');
//var actual = alarmio.connect(gatewayip + gatewayport);


function start() {
	var io = require('socket.io').listen(44606);
	
	if(io)
	{ console.log('MySensor Module Listening on ' + '44606');}
	
	
	io.sockets.on('connection', function(socket){
	  console.log('Client connected to mysensor Parser');
	 
		connect();
		var offTimeTimer = setInterval(checkOffTimes,offTimeInterval);
		 socket.on('deviceSwitch',function(NodeId,NodePort,State){
		 	
		 	
		 //	console.log("is array " + Array.isArray(NodeId));
		 	if(Array.isArray(NodeId))
			 	for(var i in NodeId)
			 	{
			 		console.log(NodeId[i] + " " + NodePort[i] + " " + State[i] );
			 		setTimeout(function() {
					    sendData(NodeId[i],NodePort[i],State[i])	;
					}, 250);
			 	}
		 	else
		 	{console.log(NodeId + " " + NodePort + " " + State );
		 		sendData(NodeId,NodePort,State)	;
		 			
		 	}
		 });
		 
		 
		 socket.on('switchOff',function(NodeId,NodePort,State,offTime){
		 	
		 	var foudIndex = 0;
		 //	console.log(offTimes);
		 	for(var i = 0;i<offTimes.length;i++){
		 		
		 		if(offTimes[i]['data']['node'] == NodeId && offTimes[i]['data']['port'] == NodePort){
		 			
		 			offTimes[i]['data']['offTime'] = offTime;
		 			offTimes[i]['data']['state'] = State;
		 			foudIndex = 1;
		 			
		 		}
		 		
		 		
		 	}
		 	
		 	if(foudIndex == 0)
		 	{
			 	offTimesObjects.node = NodeId;
			 	offTimesObjects.port = NodePort;
			 	offTimesObjects.state = State;
			 	offTimesObjects.offTime = offTime;
			 	
			 	
			 	
			 	offTimes.push({data: offTimesObjects});
		 	}
		 	foundIndex = 0;
		 	offTimesObjects = {};
		 //	console.log(offTimes);
		 });
		 
		 
		 
		function processData(data){
	    	socket.emit("nodeAlive",data[0]);
	    	var sensorTypes = ['17','0','8','38','39'];// ['0','1','17','18','35','38','39'];
	    	if(data[2] == 1 && sensorTypes.indexOf(data[4]) == -1 ){
	    	   console.log("Mysensor: Device updated");
	    		
	    		
    			db.getdata('Items',{Select:'Item_Current_Value',whereClause:'Node_Id = "' + data[0] + '"AND Node_Port = "' + data[1] +'"'},function(err,data_receive){
    			
	    			if(data_receive){
	    				
	    				if(data_receive[0].Item_Current_Value - data[5] > 0.3 || data_receive[0].Item_Current_Value - data[5] < -0.3){
	    					socket.emit("deviceStatusChange",data[0],data[1],data[5]);
	    					//	log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
	    						log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');	
	    				}
	    			}else
	    			{
	    					socket.emit("sensorStatusChange",data[0],data[1],data[5],data[4]);
    					//log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
    					log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');
	    				console.log(err);
	    			}
	    		});
	    	
	    		
	    	}else if(data[2] == 1 && sensorTypes.indexOf(data[4]) != -1 ){
	    		console.log("Mysensor: Sensor updated");
	    		
	    		
	    		
	    		db.getdata('Items',{Select:'Item_Current_Value',whereClause:'Node_Id = "' + data[0] + '"AND Node_Port = "' + data[1] +'"'},function(err,data_receive){
	    			
	    			if(data_receive){
	    				
	    				if(data_receive[0].Item_Current_Value - data[5] > 0.3 || data_receive[0].Item_Current_Value - data[5] < -0.3){
	    					socket.emit("sensorStatusChange",data[0],data[1],data[5],data[4]);
	    					//log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
	    					log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');
	    				}
	    			}else{
	    				socket.emit("sensorStatusChange",data[0],data[1],data[5],data[4]);
    					//log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
    					log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');
	    			}
	    		});
	    		
	    		
	    	}
	    	
	    
	    	
	    	if(data[2] == 3){
	    		if(data[4] == 3){  //id request
	    			
	    			console.log("Id Request received");
	    			sendNewId();
	    			
	    		}
	    		if(data[4] == 18){  //id request
	    			
	    		//	console.log("Alive received");
	    		
	    			
	    		}
	    		
	    	}
	    	
	    	
	    	
	    	
	    }       
	
			
		
	   
		  	function connect(){
		  		console.log('Mysensors: Trying to connect to Gateway @ ' + gatewayip + ':' + gatewayport);
		  		
					actual.connect({port: gatewayport, host:gatewayip}, function() {
					    console.log('Mysensors: Gateway connected');
					    
				        socket.emit("gatewayConnected",1);
	                	if(retrytimer)clearInterval(retrytimer);      
	                	
	                	
					});
					
					
					
		  
		  	}
		
	
	   
	    
	    process.on('uncaughtException', function(err) {
	    if(err.code == 'EHOSTUNREACH'){
	        //retryconnect();
	        socket.emit("gatewayConnected",0);
	        	if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
	    }
	    
	   
		});
			
			
		actual.on('error', function(e) {
				
				
			/*	if(e.code == 'ECONNREFUSED') {}  */
				
			console.log("Mysensors: Gateway connection error = " + e);	
				socket.emit("gatewayConnected",0);
				if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
	
			 
		});
			
		actual.on('close', function() {
				
			console.log("Mysensors: Gateway connection closed" );
				socket.emit("gatewayConnected",0);
				if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
	
				
		});
			
		actual.on('timeout', function() {
				
			console.log("Mysensors: Gateway connection timeout" );
				socket.emit("gatewayConnected",0);
				if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
		
				
		});
		
		
		actual.on('disconnect', function() {
			
		console.log("Mysensors: Gateway connection disconnected" );	
			socket.emit("gatewayConnected",0);
			if(retrytimer)clearInterval(retrytimer);    
		  	retrytimer = setInterval(function() {connect()},5000);
	
				
		});
		
		actual.on('data', function(data) {
	    	var dataslice = data.toString().replace(/[\n\r]/g, '').split(';');
	        console.log(dataslice);    
	        
	        processData(dataslice);
	  
		});
		
		
		
		
	    	
	    	
	    function sendData(NodeId,NodePort,State){		
	    //	console.log("data: " + NodeId + " " +NodePort  );
	    		
	    		db.getdata('Items',{Select: 'Item_Type,Item_Is_Toggle,Item_Toggle_Delay,Item_Current_Value',whereClause:'Node_Id = ' + NodeId.toString() + ' AND Node_Port = ' + NodePort.toString()},function(err,data_receive){
	    			 if(data_receive[0]){
	    			 	if(data_receive[0].Item_Current_Value != State){
		    			 	if(data_receive[0].Item_Type == Access_Type && data_receive[0].Item_Is_Toggle == 1 ){
					    	 	if(State == 0){
						    	 	actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;47;0\n',function(){
					       
					                       //console.log('data sent');
					                   });
						    	 	
						    	 }else{
					    	 		actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;47;' + data_receive[0].Item_Toggle_Delay + '\n',function(){
					       
					                       //console.log('data sent');
					                   });
						    	 }
			    			 }else 	if(data_receive[0].Item_Type == Irrigation_Type && data_receive[0].Item_Is_Toggle == 1 ){
						    	 
						    	 if(State == 0){
						    	 	actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;48;0\n',function(){
					       
					                       //console.log('data sent');
					                   });
						    	 	
						    	 }else{
							    	 actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;48;' + data_receive[0].Item_Toggle_Delay + '\n',function(){
							       
							                      // console.log(NodeId.toString() + ';' +  NodePort.toString() +';1;1;48;' + data_receive[0].Item_Toggle_Delay);
							                   });
						    	 }
			    			  }else 
			    			 {
			    			 	
			    			 	actual.write(NodeId.toString() + ';' + NodePort.toString()+';1;1;2;' + State.toString() +'\n',function(){
						       
						                       //console.log('data sent');
						                   });	
			    			 }
	    			 	}
				                   
		    	}else 
		        if(err)
		        {
		            console.log(err);
		        }
		    	
		    	 
		    });
	    }
	    
	    function sendNewId(){
	    	
	    	
	    	
	    	db.getdata('Items',{Select: 'Node_Id',whereClause:'Node_Id > 0 ORDER BY Node_Id DESC LIMIT 1'},function(err,data_receive){
	        // console.log(data_receive);
	         if(data_receive[0]){
	                    //console.log(data_receive);
	                    ID = data_receive[0].Node_Id + 1;
	                    // data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
	                    
	                    
	                    actual.write('255;255;3;1;4;'+ ID.toString()+'\n',function(){
	       
	                       console.log('Sent new ID ' +  ID.toString());
	                   });
	        }else 
	        if(err)
	        {
	            console.log(err);
	        }
	    	
	    	 
	    });
	    
	                   
	                   
		}
		
		
	
		function checkOffTimes(){
		 var time = new Date().getTime()	
			//console.log(time);
			//console.log(offTimes);
        	//return t.setSeconds(t.getSeconds() + onTime);
			for(var i = 0;i < offTimes.length;i++){
				//console.log(offTimes[i]['data']['offTime']);
				if(time >= offTimes[i]['data']['offTime']){
					
					sendData(offTimes[i]['data']['node'],offTimes[i]['data']['port'],offTimes[i]['data']['state']);
					
					offTimes.splice(i, 1);
					console.log("Switch Off");
					i--;
				}
				
				
				
			}
		
		
		}
	
	});
	
	
}

	
                   
exports.start = start;                   