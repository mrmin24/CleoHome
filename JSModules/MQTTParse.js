var mqtt = require('mqtt');
var db = require('./dbhandler');
var myconsole = require('./myconsole.js');

var rules = require('./Rule_UpdateStates.js');

var retrytimer;
var Access_Type = 5;
var Irrigation_Type = 6; 
var Motion_Type = 7;
var Power_Type = 10;
var offTimes = [];
var offTimesObjects = {};
var offTimeInterval = 1000;




 



function start() {
	
	
	// myconsole.log(debug);
	var io = require('socket.io').listen(44607);
	
	if(io)
	{ myconsole.log('MQTT Module Listening on ' + '44607');}
	
	io.sockets.on('connection', function(socket){
	 myconsole.log('Client connected to MQTT Parser');
	 var client  = mqtt.connect('mqtt://127.0.0.1',{ clientId: 'CleoHome',keepalive:120,will:{topic:'ctrlOut/status/0',payload:'offline',qos:2,retain:true}});

			
			
		client.on('connect', function () {
			myconsole.log('MQTT client connected to server');

			  MQTT_Subscribe('ctrlIn/#');
			  MQTT_Publish('ctrlOut/0/status', 'online');
			  
			 
		
		 
		
		client.on('message', function (topic, message) {
			myconsole.log('New MQTT message: ' + topic + " " + message);
		  // message is Buffer 
		 	var dataslice = topic.toString().replace(/[\n\r]/g, '').split('/');
	        myconsole.log(dataslice);
	        
	        processData(dataslice,message);
	        
		});	
	
		
		
		
	});  	
	
	
	function MQTT_Subscribe(topic){
		myconsole.log("Subscribing to: " + topic);
		client.subscribe(topic);
		
	}
	
	function MQTT_Publish(topic,message){
		myconsole.log("Publishing to: " + topic);
		 client.publish(topic, message);
		
	}
	
	function sendNewId(){
	    	
	    	
	    	
    	db.getdata('Items',{Select: 'Node_Id',whereClause:'Node_Id > 0 ORDER BY Node_Id DESC LIMIT 1'},function(err,data_receive){
        // myconsole.log(data_receive);
         	if(data_receive[0]){
                    //myconsole.log(data_receive);
                    ID = data_receive[0].Node_Id + 1;
                    // data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
                    
                    
                    actual.write('255;255;3;1;4;'+ ID.toString()+'\n',function(){
       
                       myconsole.log('Sent new ID ' +  ID.toString());
                   });
	        }else 
	        if(err)
	        {
	            myconsole.log(err);
	        }
    	
    	 
    	});
    
                   
                   
	}
	socket.on('deviceSwitch',function(NodeId,NodePort,State,rulereq){
		 	
		 	
		 	myconsole.log("MQTT switch: " + Array.isArray(NodeId));
		 	
		 	if(Array.isArray(NodeId))
			 	for(var i in NodeId)
			 	{
			 		myconsole.log("mysensMQTT " + NodeId[i] + " " + NodePort[i] + " " + State[i] + " " + rulereq[i] );
			 		setTimeout(function() {
					    sendData(NodeId[i],NodePort[i],State[i],rulereq[i])	;
					}, 250);
			 	}
		 	else
		 	{   myconsole.log("mysensMQTT2 " + NodeId + " " + NodePort + " " + State + " " + rulereq );
		 	
		 	
		 		sendData(NodeId,NodePort,State,rulereq)	;
		 	
		 			
		 	}
		 });
		 
		 
		  function sendData(NodeId,NodePort,State,rulereq){		
	    	//myconsole.log("mysens data: " + NodeId + " " + NodePort  );
	    		
	    		db.getdata('Items',{Select: 'Item_Type,Item_Is_Toggle,Item_Toggle_Delay,Item_Current_Value',whereClause:'Node_Id = ' + NodeId.toString() + ' AND Node_Port = ' + NodePort.toString()},function(err,data_receive){
	    			 if(data_receive[0]){
	    			 	if(data_receive[0].Item_Current_Value != State){
	    			 			var time = 0;
		    			 	//	myconsole.log("Mysensor state: " + State);
		    			 		if(rulereq == 1){
		    			 			time = State;
		    			 		}else{
		    			 			time = data_receive[0].Item_Toggle_Delay;
		    			 		}
		    			 	if(data_receive[0].Item_Type == Access_Type && data_receive[0].Item_Is_Toggle == 1 ){
		    			 	
					    	 	if(State == 0){
					    	 		client.publish('ctrlOut/'+NodeId.toString()+'/command', '{"cmd":"set","port":"'+NodePort.toString()+'","value":"0"}');
						    	 	
						    	 	
						    	 }else{
						    	 	client.publish('ctrlOut/'+NodeId.toString()+'/command', '{"cmd":"set","port":"'+NodePort.toString()+'","value":"' + time.toString() + '"}');
					    	 		
						    	 }
			    			 }else 	if(data_receive[0].Item_Type == Irrigation_Type && data_receive[0].Item_Is_Toggle == 1 ){
						    	 
						    	 if(State == 0){
						    	 	client.publish('ctrlOut/'+NodeId.toString()+'/command', '{"cmd":"set","port":"'+NodePort.toString()+'","value":"0"}');
						    	 	
						    	 }else{
							    	client.publish('ctrlOut/'+NodeId.toString()+'/command', '{"cmd":"set","port":"'+NodePort.toString()+'","value":"' + time.toString() + '"}');
						    	 }
			    			  }else 
			    			 {
			    			 		client.publish('ctrlOut/'+NodeId.toString()+'/command', '{"cmd":"set","port":"'+NodePort.toString()+'","value":"'+ State.toString() +'"}');
			    			 	
			    			 }
	    			 	}
				                   
		    	}else 
		        if(err)
		        {
		            myconsole.log(err);
		        }
		    	
		    	 
		    });
	    }
		 
		 
		function processData(topic,message){
		//	myconsole.log(topic[topic.length-1] );
		
			var jsonMessage = JSON.parse(message);     
			
			
			myconsole.log("JSON " + jsonMessage['status']);
		
			if(topic[topic.length-1] == "status" && (jsonMessage['status'] == 'online' || jsonMessage['status'] == 'offline')){
				myconsole.log("setting " + topic[topic.length-2] + " to " + jsonMessage['status']);
		    	socket.emit("nodeAlive",topic[topic.length-2],jsonMessage['status']);
		    	
			}
			
			
			if(topic[topic.length-1] == "cmd"){   //if command topic is received check the command
				
				
				var command = jsonMessage['cmd'];
				var port = jsonMessage['port'];
				var value = jsonMessage['value'];
				var type = jsonMessage['type'];
				var node = topic[topic.length-2];
				var IP = jsonMessage['IP'];
				
					myconsole.log("command = " + command + " value = " + value + " type = " + type + " port = " + port + " IP = " + IP );
				
				if(command == "set"){
				myconsole.log("setting " + node + "/" + port + " to " + value);
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		    	
				
		    	
		    	   myconsole.log("MQTT sensor: Device updated");
		    		
		    		
	    			db.getdata('Items',{Select:'Item_Current_Value',whereClause:'Node_Id = "' + node + '" AND Node_Port = "' + port.toString() +'"'},function(err,data_receive){
	    			
		    			if(data_receive){
		    				
		    				if(data_receive[0].Item_Current_Value - value > 0.3 || data_receive[0].Item_Current_Value - value < -0.3){
		    					//  myconsole.log("MQTT sensor: " + message);
		    					socket.emit("deviceStatusChange",node,port,value);
		    					//	log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
		    						log.logger('Device', '{"node":"' + node + '","port":"' + port + '","value":"' + value + '"}');	
		    				}
		    			}else if(err){
		    				
		    				myconsole.log(err);
		    			}
		    			
		    		
		    		});
		    	
		    	
				}else if(command == "reqId")
				
				{
				myconsole.log("requesting a new node ID for IP: " + IP);
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		    	
				
		    	
		    	   myconsole.log("MQTT sensor: New Id requested");
		    		
		    		
	    			db.getdata('Items',{Select:'Item_Current_Value',whereClause:'Node_Id = "' + topic[topic.length-3] + '"AND Node_Port = "' + topic[topic.length-1] +'"'},function(err,data_receive){
	    			
		    			if(data_receive){
		    				
		    				if(data_receive[0].Item_Current_Value - message > 0.3 || data_receive[0].Item_Current_Value - message < -0.3){
		    					//  myconsole.log("MQTT sensor: " + message);
		    					socket.emit("deviceStatusChange",topic[topic.length-3],topic[topic.length-1],parseInt(message));
		    					//	log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
		    						log.logger('Device', '{"node":"' + topic[topic.length-3] + '","port":"' + topic[topic.length-1] + '","value":"' + message + '"}');	
		    				}
		    			}
		    		
		    		});
		    	
		    		
		    	
	    	
			}
				
				
			}
			
			
			
	
	    
	    /*	if(data[2] == 3){
	    		if(data[4] == 3){  //id request
	    			
	    			myconsole.log("Id Request received");
	    			sendNewId();
	    			
	    		}
	    		if(data[4] == 18){  //id request
	    			
	    		//	myconsole.log("Alive received");
	    		
	    			
	    		}
	    		
	    	}*/
			
			
		    	
		 }  
		 
	});

		
}
	
                   
exports.start = start;       