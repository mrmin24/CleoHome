var mqttcommand = require('./MQTTSonoffCommands.js'); 



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
var nodeReqActive = 0;






function start() {
	
	
	// myconsole.log(debug);
	var io = require('socket.io').listen(44607);
	
	if(io)
	{ myconsole.log('MQTT Module Listening on ' + '44607');}
	
		io.sockets.on('connection', function(socket){
	
	 	myconsole.log('Client connected to MQTT Parser');
	 
		try{
			var client  = mqtt.connect('mqtt://127.0.0.1',{ clientId: 'CleoHome',keepalive:120,will:{topic:'ctrlOut/status/0',payload:'offline',qos:2,retain:true}});
		}catch(e){
			
			myconsole.log(e);
		}
		
		
		if(client){
			function MQTT_Subscribe(topic){
				myconsole.log("Subscribing to: " + topic);
				client.subscribe(topic);
				
			}
			
			function MQTT_Publish(topic,message,qos,retain){
				myconsole.log("Publishing to: " + topic);
				 client.publish(topic, message,[qos,retain]);
				
			}
			
		client.on('connect', function () {
			myconsole.log('MQTT client connected to server');

			  MQTT_Subscribe('ctrlIn/#');
			  MQTT_Subscribe('tele/#');
			  MQTT_Publish('ctrlOut/0/status', 'online',1,true);
			  MQTT_Publish('ctrlOut/sonoffs/status', '11',1,false);
		
		 	client.on('message', function (topic, message) {
				myconsole.log('New MQTT message: ' );
			  // message is Buffer 
			 	var dataslice = topic.toString().replace(/[\n\r]/g, '').split('/');
		        myconsole.log(dataslice);
		         myconsole.log(message.toString());
		      try{	 processData(dataslice,message.toString());} catch(e){myconsole.log(e);}
		        
			
			}); 
		
			
			
		function processData(topic,message){
			function isJson(message2) {
			    try {
			    
			        JSON.parse(message2);
			        
			    } catch (e) {
			    	myconsole.log("not json");
			        return false;//return message2;
			    }
			    	myconsole.log(" json");
			    return true; //JSON.parse(message2);
			}
			myconsole.log("xxxxxxxxxxxxxxxxxxx " +  message + " " + topic);
			
			var jsonMessage;
			if(isJson(message)){
				 jsonMessage = JSON.parse(message);
			//	myconsole.log(obj['Wifi'].SSID);
			//	var keysArray = Object.keys(obj);
			//	for (var i = 0; i < keysArray.length; i++) {
			//	   var key = keysArray[i]; // here is "name" of object property
			//	   var value = obj[key]; // here get value "by name" as it expected with objects
			//	   myconsole.log(key + " " + value);
			//	}
			}else
			{
			   jsonMessage = message;
			   
			}     
			
			
			if(topic[topic.length-1] == "LWT" && (jsonMessage == 'Online' || jsonMessage == 'Offline')){
				myconsole.log("setting " + topic[topic.length-2] + " to " + jsonMessage);
				if(jsonMessage == 'Online'){
					MQTT_Publish('ctrlOut/'+topic[topic.length-2]+'/status', '11',1,false);
					
				}
				
				
				//	myconsole.log(socket);
		    		socket.emit("nodeAlive",topic[topic.length-2],jsonMessage);
			
			}
			
			
			if(topic[topic.length-2] != null){
				var node = topic[topic.length-2];
				//myconsole.log("JSON node " + node);
			}
		/*	if(jsonMessage['port'] != null){
				var port = jsonMessage['port'];
			    //myconsole.log("JSON port " + jsonMessage['port']);
				
			}*/
			/*if(jsonMessage['value'] != null){
				var value = jsonMessage['value'];
				myconsole.log("JSON value " + jsonMessage['value']);
				
			}*/
			
			if(node == "sonoff" && nodeReqActive == 0){
				nodeReqActive = 1;
				myconsole.log("requesting a new node ID for IP: ");
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		      idReq = "sonoff";
				
		    	
	    	   myconsole.log("MQTT sensor: New Id requested");
	    		
	    		
	    		db.getdata('Nodes',{Select: 'Node_Port',whereClause:'Id > 0 ORDER BY Node_Port DESC LIMIT 1'},function(err,data_receive){
			        // myconsole.log(data_receive);
			         if(data_receive[0]){
			                    //myconsole.log(data_receive);
			                  var   ID = data_receive[0].Node_Port + 1;
			                    // data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
			                    
			                    
			                    
			                    
			                    
			                    
			                  //  MQTT_Publish('ctrlOut/'+idReq+'/TOPIC', ID);
			       
			                    myconsole.log('Sent new ID ' +  ID.toString());
			                  //  myconsole.log('IP ' +  IP);
			                    
			                    socket.emit("newNode",ID,"",idReq);
			                    nodeReqActive = 0;
			                   
			        }else 
			        if(err)
			        {
			            myconsole.log(err);
			        }
			    	
			    	 
			    });
				
			}
			
			
			
			if(topic[topic.length-1].indexOf("POWER") > -1 ){
				
			myconsole.log(jsonMessage);	
				
			var trimmedStr = topic[topic.length-1].split("POWER").pop();
		    	
		    if(!trimmedStr) { trimmedStr = 1}
			    	if(jsonMessage == "ON"){
			    		
			    		myconsole.log("MQTT sensor: Device updated " + node + " " + trimmedStr + " " + message);
			    		socket.emit("deviceStatusChange",node,trimmedStr,1);
			    	}else if(jsonMessage == "OFF"){
			    		myconsole.log("MQTT sensor: Device updated " + node + " " + trimmedStr + " " + message);
			    		socket.emit("deviceStatusChange",node,trimmedStr,0);
			    	}
		    	
		    	 
		    	 
		    	
				
			}
			
			
			if(topic[topic.length-1].indexOf("STATUS11") > -1){
				
				for(var i = 0;i<9;i++){
					
				
					//var trimmedStr = topic[topic.length-1].split("POWER").pop();
					if(i == 0){
						if(jsonMessage['StatusSTS']['POWER']){
							
							//	myconsole.log("Status receivedxxyyyyyyyyyyyyyyy1 " + jsonMessage['StatusSTS']['POWER']);
							
							
						
							if(jsonMessage['StatusSTS']['POWER'] == "ON"){
				    		
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + message);
					    		socket.emit("deviceStatusChange",node,1,1);
					    	}else if(jsonMessage['StatusSTS']['POWER'] == "OFF"){
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + message);
					    		socket.emit("deviceStatusChange",node,1,0);
					    	}
					    	
					    	i = 10;
							
						}
					}else{
					
					if(jsonMessage['StatusSTS']['POWER'+i.toString()]){
					//	myconsole.log("Status receivedxxxxxxxxxxxxxxxxxxxxxx " + i + jsonMessage['StatusSTS']['POWER'+i.toString()]);
							
							
						
							if(jsonMessage['StatusSTS']['POWER'+ i.toString() ] == "ON"){
				    		
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + i + " " + message);
					    		socket.emit("deviceStatusChange",node,i,1);
					    	}else if(jsonMessage['StatusSTS']['POWER'+i.toString()] == "OFF"){
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + i + " " + message);
					    		socket.emit("deviceStatusChange",node,i,0);
					    	}
			    	
						
						
						
					}else{
						i = 10;
					}
				}
				
				}
			
		    	
		    }
			
			
			if(topic[topic.length-1].indexOf("INFO2") > -1){
				
				
			//	myconsole.log(Object.keys(jsonMessage)[2]);
				myconsole.log(jsonMessage['IPaddress'] + " " + node);
			
		    	
		    	if(Object.keys(jsonMessage)[2] == "IPaddress"){
		    		myconsole.log("IP update");
		    		
		    		var  data = {Set:'IPAddress',Current_State:jsonMessage['IPaddress'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                       //  myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
			    	socket.emit("updateNodeStatus",node);
		    	}
		    	
		    	
		  	if(topic[topic.length-1].indexOf("IPAddress1") > -1){
				
				
			//	myconsole.log(Object.keys(jsonMessage)[2]);
				myconsole.log(jsonMessage['IPaddress'] + " " + node);
			
		    	
		    	if(jsonMessage.IPAddress1){
		    		myconsole.log("IP update");
		    		
		    		 var data = {Set:'IPAddress',Current_State:jsonMessage['IPaddress'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                      //   myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
			    	socket.emit("updateNodeStatus",node);
		    	}
		    	
		    	
		    if(topic[topic.length-1].indexOf("SENSOR") > -1){
				
				
				myconsole.log("Sensor date received - node: " + node );
				
			     
			//	myconsole.log(jsonMessage)	;
					
				
				if(jsonMessage.Temperature){
		    	
		    		myconsole.log("Temp: " + jsonMessage.Temperature.toString());
		    	
		    		
                    
                    socket.emit("sensorStatusChange",node,0,jsonMessage.Temperature,'Temp');   //update nodes
                   
                  
				}
				
				if(jsonMessage.Humidity){
		    	
		    	
		    		myconsole.log("Humidity: " + jsonMessage.Humidity.toString());
		    		
		    		
                    socket.emit("sensorStatusChange",node,1,jsonMessage.Humidity,'Humidity');
                    
                    
    		
				}
				
				
				if(jsonMessage.Light){
		    	
		    	
		    		myconsole.log("Light: " + jsonMessage.Light.toString());
		    		
		    		
                  
                    socket.emit("sensorStatusChange",node,2,jsonMessage.Light,'Light');
                    
                    
                   
    		
				}
				
				
				if(jsonMessage.Noise){
		    	
		    		
		    		myconsole.log("Noise: " + jsonMessage.Noise.toString());
		    		
		    
                    socket.emit("sensorStatusChange",node,3,jsonMessage.Noise,'Noise');
                  
    		
				}
				
				
				if(jsonMessage.AirQuality){
		    	
		    	
		    		myconsole.log("Air: " + jsonMessage.AirQuality.toString());
		    
                    socket.emit("sensorStatusChange",node,4,jsonMessage.AirQuality,'AirQual');
                
    		
				}
				
				if(jsonMessage.Counter1 >= 0){
		    	
		    		myconsole.log("Counter: " + jsonMessage.Counter1.toString());
		    		
					data = {'Select':'Node_Id,Node_Port,Item_Current_Value','whereClause':'Item_Name = ' + '"LocalRainCurrent"'};   // can only be one LocalRainCurrent in system
        
			        db.getdata('Items',data,function(err,result){
			           
			           if(err){
			               
			               myconsole.log(err);
			           }else if(result){
			           	
			           		if(result[0].Node_Id == node){
			               
			                	myconsole.log("Rain now is: " + result[0].Item_Current_Value);
			                	
			                	MQTT_Publish('ctrlOut/'+node+'/Counter1','0',1,false);
			                	
			                	
			                	 socket.emit("sensorStatusChange",node,1,jsonMessage.Counter1,'RainRate');    //update node
			                
			           		}
			                
			                
			           }
			           
			           
			        });
			    
		                    
		          
		        }
		        
		        
				if(jsonMessage.DS18x20.DS1.Temperature){
		    	
		    		myconsole.log("Temp: " + jsonMessage.DS18x20.DS1.Temperature.toString());
		    		
				
			    
		                    
		           socket.emit("sensorStatusChange",node,99,jsonMessage.DS18x20.DS1.Temperature,'Temp');    //update node
		        }
		        
		        	
				
				     
			    
		    	
		    }	
		    
		     if(topic[topic.length-1].indexOf("ENERGY") > -1){
				
				
				myconsole.log("Sensor energy data received - node: " + node );
				
			     	if(jsonMessage){
					
					 socket.emit("sensorStatusChange",node,99,jsonMessage.Power,'Power');
				
				
			     	}
			
			    
		    	
		    }
		    	
		   if(topic[topic.length-1].indexOf("STATE") > -1){
				
				
			
			
			
		    	
		    	if(jsonMessage['Uptime'] >= 0){
		    	//	myconsole.log("Uptime update " + jsonMessage['Uptime']);
		    		
		    		var  data = {Set:'UpTime',Current_State:jsonMessage['Uptime'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                       // myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
	              
	              if(jsonMessage['Vcc'] >= 0){
		    	//	myconsole.log("Vcc update " + jsonMessage['Vcc']);
		    		
		    		var data = {Set:'Vcc',Current_State:jsonMessage['Vcc'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                        // myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
	              
	              if(jsonMessage['Wifi']['RSSI'] >= 0){
		    	//	myconsole.log(jsonMessage);
		    		
		    		var  data = {Set:'RSSI',Current_State:jsonMessage['Wifi']['RSSI'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                       //  myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	                    socket.emit("sensorStatusChange",node,98,jsonMessage['Wifi']['RSSI'],'RSSI');
	              }
	              
	              socket.emit("updateNodeStatus",node);
	              
			    	
		    	}
		    	 
				
			
			
			
			
			
			
			
			
			
			
			if(topic[topic.length-1] == "cmd"){   //if command topic is received check the command
				
				if(jsonMessage['cmd'] != null){
				var command = jsonMessage['cmd'];
					myconsole.log("JSON cmd " + jsonMessage['cmd']);}
				if(jsonMessage['port'] != null){
				var port = jsonMessage['port'];
					myconsole.log("JSON port " + jsonMessage['port']);}
				if(jsonMessage['value'] != null){
				var value = jsonMessage['value'];
					myconsole.log("JSON value " + jsonMessage['value']);}
				if(jsonMessage['type'] != null){
				var type = jsonMessage['type'];
					myconsole.log("JSON type " + jsonMessage['type']);}
				
				if( topic[topic.length-2] != null){
					var node = topic[topic.length-2];
					myconsole.log("JSON node " + node);
				}
				if(jsonMessage['ip'] != null){
				var IP = jsonMessage['ip'];
					myconsole.log("JSON IP " + jsonMessage['ip']);}
				if(jsonMessage['id'] != null){
				var idReq = jsonMessage['id'];
					myconsole.log("JSON ID " + jsonMessage['id']);}
				
			//	myconsole.log("command = " + command + " value = " + value.toString() + " type = " + type + " port = " + port );
				
				if(command == "set"){
			//	myconsole.log("setting " + node + "/" + port + " to " + value);
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		    	
				
		    	
		    	   myconsole.log("MQTT sensor: Device updated " + node + ' ' + port + " " + value);
		    		socket.emit("deviceStatusChange",node,port,value);
		    		
	    		/*	db.getdata('Items',{Select:'Item_Current_Value',whereClause:'Node_Id = "' + parseInt(node) + '" AND Node_Port = "' + parseInt(port) +'"'},function(err,data_receive){
	    			
		    			if(data_receive){
		    				 myconsole.log("MQTT sensor db: " + message);
		    				if(data_receive[0].Item_Current_Value - value > 0.3 || data_receive[0].Item_Current_Value - value < -0.3){
		    					 
		    					socket.emit("deviceStatusChange",node,port,value);
		    					//	log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
		    						log.logger('Device', '{"node":"' + node + '","port":"' + port + '","value":"' + value.toString() + '"}');	
		    				}else{
		    					
		    					
		    					
		    				}
		    			}else if(err){
		    				
		    				myconsole.log(err);
		    			}
		    			
		    		
		    		});*/
		    	
		    	
				}else if(command == "reqId")
				
				{
				myconsole.log("requesting a new node ID for IP: " + IP);
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		    	
				
		    	
		    	   myconsole.log("MQTT sensor: New Id requested");
		    		
		    		
		    		db.getdata('Items',{Select: 'Node_Id',whereClause:'Node_Id > 0 ORDER BY Node_Id DESC LIMIT 1'},function(err,data_receive){
				        // myconsole.log(data_receive);
				         if(data_receive[0]){
				                    //myconsole.log(data_receive);
				                  var   ID = data_receive[0].Node_Id + 1;
				                    // data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
				                    
				                    
				                    
				                    
				                    
				                    
				                   // MQTT_Publish('ctrlOut/'+idReq+'/command', '{"cmd":"newId","value":'+ID+'}');
				       
				                    myconsole.log('Sent new ID ' +  ID.toString());
				                    myconsole.log('IP ' +  IP);
				                    
				                    socket.emit("newNode",ID,IP,idReq);
				                   
				        }else 
				        if(err)
				        {
				            myconsole.log(err);
				        }
				    	
				    	 
				    });
		    	
		    		
		    	
	    	
			}
				
				
			}
			
			
			
			
		 }
	
		});
		
		 
	
	
	
	
	
	 	
	
	
	socket.on('newNode',function(data){
		
		myconsole.log('MQTT new node: ' + data['Node_Id']);
		
		MQTT_Publish('ctrlOut/'+data['Node_Old_Id'].toString()+'/TOPIC', data['Node_Id'].toString(),1,false);
		
		for (var i = 0;i<10;i++){
			
		//	MQTT_Publish('ctrlOut/'+data['Node_Id']+'/command', '{"cmd":"setPins","child":'+i+',"port":'+data['Node_Port'+i]+',"type":'+data['Item_Port_Type'+i]+',"defVal":'+data['Item_Default'+i]+',"onVal":'+data['Item_On_Value'+i]+',"loadReset":'+data['Item_Remember'+i]+'      }');			
			
		}


		
		
		
		
		
	});
	
	
	
	socket.on('deviceSwitch',function(NodeId,NodePort,State,rulereq,timeOn){
		 	
		 	
		 	myconsole.log("MQTT switch: " + Array.isArray(NodeId));
		 	
		 	if(Array.isArray(NodeId))
			 	for(var i in NodeId)
			 	{
			 		myconsole.log("mysensMQTT " + NodeId[i] + " " + NodePort[i] + " " + State[i] + " " + rulereq[i] );
			 		setTimeout(function() {
					    sendData(NodeId[i],NodePort[i],State[i],rulereq[i],timeOn[i])	;
					}, 250);
			 	}
		 	else
		 	{   myconsole.log("mysensMQTT2 " + NodeId + " " + NodePort + " " + State + " " + rulereq );
		 	
		 	
		 		sendData(NodeId,NodePort,State,rulereq,timeOn)	;
		 	
		 			
		 	}
		 });
		 
		 
	  
		 
	

	
	
		  function sendData(NodeId,NodePort,State,rulereq,timeOn){		
	    	myconsole.log("mysens data: " + NodeId + " " + NodePort + " " + State  );
	    		
	    		db.getdata('Items',{Select: 'Item_Type,Item_Is_Toggle,Item_Toggle_Delay,Item_Current_Value,Node_Child',whereClause:'Node_Id = ' + NodeId.toString() + ' AND Node_Port = ' + NodePort.toString()},function(err,data_receive){
	    			 if(data_receive[0]){
	    			 		myconsole.log("child1: " + data_receive[0].Node_Child);
	    			 		
	    			 	
	    			 	if(data_receive[0].Item_Current_Value != State){
	    			 		
	    			 			var time = 0;
		    			 		//myconsole.log("Mysensor state" + State);
		    			 		if(rulereq == 1){
		    			 			if(data_receive[0].Item_Is_Toggle == 1)
		    			 			{
		    			 				time = data_receive[0].Item_Toggle_Delay;
		    			 			}else{
		    			 				time = State;	
		    			 			}
		    			 			
		    			 		}else{
		    			 			if(timeOn > 0){
		    			 				
		    			 				time = timeOn + 100;
		    			 				
		    			 			}else{
		    			 				time = data_receive[0].Item_Toggle_Delay;
		    			 			}
		    			 		}
		    			 		var NodeChild = data_receive[0].Node_Child;
		    			 		
		    			 		var sendDataOff = JSON.parse(mqttcommand.power(State,"off",NodePort));
		    			 		myconsole.log("senddata: " + sendDataOff['CMD'] + " " + sendDataOff['MSG']);
		    			 		
		    			 	if(data_receive[0].Item_Is_Toggle == 1 ){  //data_receive[0].Item_Type == Access_Type &&
		    			 	//	myconsole.log(data_receive[0].Node_Child);
		    			 	
		    			 	
		    			 		var sendDataToggle = JSON.parse(mqttcommand.power(time,"pulse",NodePort));
		    			 		var sendDataToggle2 = JSON.parse(mqttcommand.power(State,"on",NodePort));
					    	 	if(State == 0){
					    	 		client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataOff['CMD'], sendDataOff['MSG']);//'{"cmd":"set","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"0","type":1}');
						    	 	
						    	 	
						    	 }else{
						    	 	client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataToggle['CMD'], sendDataToggle['MSG']);//'{"cmd":"toggle","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"' + time.toString() + '","type":2}');
					    	 		client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataToggle2['CMD'], sendDataToggle2['MSG']);//'{"cmd":"toggle","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"' + time.toString() + '","type":2}');
					    	 	
						    	 }
			    			// }else 	if(data_receive[0].Item_Type == Irrigation_Type && data_receive[0].Item_Is_Toggle == 1 ){
			    			 	
			    			 	
						    //	 var sendDataToggle = JSON.parse(mqttcommand.power(data_receive[0].Item_Toggle_Delay,"pulse",NodePort));
						    //	 var sendDataToggle2 = JSON.parse(mqttcommand.power(State,"on",NodePort));
						    	 
						    //	 if(State == 0){
						    //	 	client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataOff['CMD'], sendDataOff['MSG']);//'{"cmd":"set","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"0","type":"1"}');
						    	 	
						    //	 }else{
							  //  	client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataToggle['CMD'], sendDataToggle['MSG']);//'{"cmd":"toggle","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"' + time.toString() + '","type":2}');
							    //	client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataToggle2['CMD'], sendDataToggle2['MSG']);//'{"cmd":"toggle","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"' + time.toString() + '","type":2}');
						    //	 }
			    			  }else 
			    			 {
			    			 	
			    			 		var sendDataOn = JSON.parse(mqttcommand.power(State,"on",NodePort));
			    			 		
			    			 		
			    			 		if(State == 0){
			    			 			client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataOff['CMD'], sendDataOff['MSG']);//'{"cmd":"set","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"'+ State.toString() +'","type":1}');
			    			 		}else{
			    			 			client.publish('ctrlOut/'+NodeId.toString()+'/'+sendDataOn['CMD'], sendDataOn['MSG']);//'{"cmd":"set","child":"'+NodeChild.toString()+'","port":"'+NodePort.toString()+'","value":"'+ State.toString() +'","type":1}');
			    			 		}
			    			 }
	    			 	}
				                   
		    	}else 
		        if(err)
		        {
		            myconsole.log(err);
		        }
		    	
		    	 
		    });
	    }
		 
		 function processData2(topic,message){
		 	
		 	myconsole.log(topic);
		//	myconsole.log(message);
			
			
		//	myconsole.log(isJson(message));
			
			function isJson(message2) {
			    try {
			        JSON.parse(message2);
			    } catch (e) {
			        return false;//return message2;
			    }
			    return true; //JSON.parse(message2);
			}
			
			if(isJson(message)){
				var obj = JSON.parse(message);
				myconsole.log(obj['Wifi'].SSID);
			//	var keysArray = Object.keys(obj);
			//	for (var i = 0; i < keysArray.length; i++) {
			//	   var key = keysArray[i]; // here is "name" of object property
			//	   var value = obj[key]; // here get value "by name" as it expected with objects
			//	   myconsole.log(key + " " + value);
			//	}
			}else
			{
				myconsole.log(message);
			}
			
			
			
		 	
		 }
		 
		
		 
		function processData3(topic,message){
			function isJson(message2) {
			    try {
			    
			        JSON.parse(message2);
			        
			    } catch (e) {
			    	myconsole.log("not json");
			        return false;//return message2;
			    }
			    	myconsole.log(" json");
			    return true; //JSON.parse(message2);
			}
			
			if(isJson(message)){
				var jsonMessage = JSON.parse(message);
			//	myconsole.log(obj['Wifi'].SSID);
			//	var keysArray = Object.keys(obj);
			//	for (var i = 0; i < keysArray.length; i++) {
			//	   var key = keysArray[i]; // here is "name" of object property
			//	   var value = obj[key]; // here get value "by name" as it expected with objects
			//	   myconsole.log(key + " " + value);
			//	}
			}else
			{
				var jsonMessage = message;
			}     
		
			
		//	myconsole.log(topic[topic.length-1]);
		
			if(topic[topic.length-1] == "LWT" && (jsonMessage == 'Online' || jsonMessage == 'Offline')){
				myconsole.log("setting " + topic[topic.length-2] + " to " + jsonMessage);
				if(jsonMessage == 'Online'){
					MQTT_Publish('ctrlOut/'+topic[topic.length-2]+'/status', '11',1,false);
					
				}
				
		    	socket.emit("nodeAlive",topic[topic.length-2],jsonMessage);
		    	
			}
			
			
			
			if(topic[topic.length-2] != null){
				var node = topic[topic.length-2];
				//myconsole.log("JSON node " + node);
			}
		/*	if(jsonMessage['port'] != null){
				var port = jsonMessage['port'];
			    //myconsole.log("JSON port " + jsonMessage['port']);
				
			}*/
			/*if(jsonMessage['value'] != null){
				var value = jsonMessage['value'];
				myconsole.log("JSON value " + jsonMessage['value']);
				
			}*/
			
			if(node == "sonoff" && nodeReqActive == 0){
				nodeReqActive = 1;
				myconsole.log("requesting a new node ID for IP: ");
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		    	idReq = "sonoff";
				
		    	
	    	   myconsole.log("MQTT sensor: New Id requested");
	    		
	    		
	    		db.getdata('Nodes',{Select: 'Node_Port',whereClause:'Id > 0 ORDER BY Node_Port DESC LIMIT 1'},function(err,data_receive){
			        // myconsole.log(data_receive);
			         if(data_receive[0]){
			                    //myconsole.log(data_receive);
			                  var   ID = data_receive[0].Node_Port + 1;
			                    // data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
			                    
			                    
			                    
			                    
			                    
			                    
			                  //  MQTT_Publish('ctrlOut/'+idReq+'/TOPIC', ID);
			       
			                    myconsole.log('Sent new ID ' +  ID.toString());
			                  //  myconsole.log('IP ' +  IP);
			                    
			                    socket.emit("newNode",ID,"",idReq);
			                    nodeReqActive = 0;
			                   
			        }else 
			        if(err)
			        {
			            myconsole.log(err);
			        }
			    	
			    	 
			    });
				
			}
			
			if(topic[topic.length-1].indexOf("POWER") > -1 ){
				
				
				
			var trimmedStr = topic[topic.length-1].split("POWER").pop();
		    	
		    if(!trimmedStr) { trimmedStr = 1}
			    	if(jsonMessage == "ON"){
			    		
			    		myconsole.log("MQTT sensor: Device updated " + node + " " + trimmedStr + " " + message);
			    		socket.emit("deviceStatusChange",node,trimmedStr,1);
			    	}else if(jsonMessage == "OFF"){
			    		myconsole.log("MQTT sensor: Device updated " + node + " " + trimmedStr + " " + message);
			    		socket.emit("deviceStatusChange",node,trimmedStr,0);
			    	}
		    	
		    	 
		    	 
		    	
				
			}
			
			
			if(topic[topic.length-1].indexOf("STATUS11") > -1){
				
				for(var i = 0;i<9;i++){
					
				
					//var trimmedStr = topic[topic.length-1].split("POWER").pop();
					if(i == 0){
						if(jsonMessage['StatusSTS']['POWER']){
							
							//	myconsole.log("Status receivedxxyyyyyyyyyyyyyyy1 " + jsonMessage['StatusSTS']['POWER']);
							
							
						
							if(jsonMessage['StatusSTS']['POWER'] == "ON"){
				    		
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + message);
					    		socket.emit("deviceStatusChange",node,1,1);
					    	}else if(jsonMessage['StatusSTS']['POWER'] == "OFF"){
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + message);
					    		socket.emit("deviceStatusChange",node,1,0);
					    	}
					    	
					    	i = 10;
							
						}
					}else{
					
					if(jsonMessage['StatusSTS']['POWER'+i.toString()]){
					//	myconsole.log("Status receivedxxxxxxxxxxxxxxxxxxxxxx " + i + jsonMessage['StatusSTS']['POWER'+i.toString()]);
							
							
						
							if(jsonMessage['StatusSTS']['POWER'+ i.toString() ] == "ON"){
				    		
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + i + " " + message);
					    		socket.emit("deviceStatusChange",node,i,1);
					    	}else if(jsonMessage['StatusSTS']['POWER'+i.toString()] == "OFF"){
					    	//	myconsole.log("MQTT sensor: Device updated " + node + " " + i + " " + message);
					    		socket.emit("deviceStatusChange",node,i,0);
					    	}
			    	
						
						
						
					}else{
						i = 10;
					}
				}
				
				}
			
		    	
		    }
			
			
			if(topic[topic.length-1].indexOf("INFO2") > -1){
				
				
			//	myconsole.log(Object.keys(jsonMessage)[2]);
				myconsole.log(jsonMessage['IPaddress'] + " " + node);
			
		    	
		    	if(Object.keys(jsonMessage)[2] == "IPaddress"){
		    		myconsole.log("IP update");
		    		
		    		var  data = {Set:'IPAddress',Current_State:jsonMessage['IPaddress'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                         myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
			    	socket.emit("updateNodeStatus",node);
		    	}
		    	
		    	
		    if(topic[topic.length-1].indexOf("SENSOR") > -1){
				
				
				myconsole.log("Sensor date received - node: " + node );
				
			
		    	
			    
			    	if(jsonMessage['DS18B20']['Temperature'] || jsonMessage['SC']['Temperature']){
			    	
			    		myconsole.log("Temp update for node: " + node);
			    		
			    	/*	 data = {Set:'Item_Current_Value',Current_State:jsonMessage['DS18B20']['Temperature'],Where:"Node_Id",Name:node};
		                    db.update("Items",data,function(err,data_receive){
		                          
		                          
		                        
		                     if(data_receive){
		                         myconsole.log(data_receive);
		                         
		                     }else
		                     {
		                         
		                      myconsole.log(err);
		                     }
		                     
		                    });*/
		              }
				    //	socket.emit("updateNodeStatus",node);
			    
		    	
		    }	
		    	
		   if(topic[topic.length-1].indexOf("STATE") > -1){
				
				
			
			
			
		    	
		    	if(jsonMessage['Uptime'] >= 0){
		    	//	myconsole.log("Uptime update " + jsonMessage['Uptime']);
		    		
		    	var data = {Set:'UpTime',Current_State:jsonMessage['Uptime'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                       // myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
	              
	              if(jsonMessage['Vcc'] >= 0){
		    	//	myconsole.log("Vcc update " + jsonMessage['Vcc']);
		    		
		    	var  data = {Set:'Vcc',Current_State:jsonMessage['Vcc'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                        // myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
	              
	              if(jsonMessage['Wifi']['RSSI'] >= 0){
		    	//	myconsole.log("RSSI update " + jsonMessage['Wifi']['RSSI']);
		    		
		    	var data = {Set:'RSSI',Current_State:jsonMessage['Wifi']['RSSI'],Where:"Node_Port",Name:node};
	                    db.update("Nodes",data,function(err,data_receive){
	                          
	                          
	                        
	                     if(data_receive){
	                       //  myconsole.log(data_receive);
	                         
	                     }else
	                     {
	                         
	                      myconsole.log(err);
	                     }
	                     
	                    });
	              }
	              
	              socket.emit("updateNodeStatus",node);
			    	
		    	}
		    	 
				
			
			
			
			
			
			
			
			
			
			
			if(topic[topic.length-1] == "cmd"){   //if command topic is received check the command
				
				if(jsonMessage['cmd'] != null){
				var command = jsonMessage['cmd'];
					myconsole.log("JSON cmd " + jsonMessage['cmd']);}
				if(jsonMessage['port'] != null){
				var port = jsonMessage['port'];
					myconsole.log("JSON port " + jsonMessage['port']);}
				if(jsonMessage['value'] != null){
				var value = jsonMessage['value'];
					myconsole.log("JSON value " + jsonMessage['value']);}
				if(jsonMessage['type'] != null){
				var type = jsonMessage['type'];
					myconsole.log("JSON type " + jsonMessage['type']);}
				
				if( topic[topic.length-2] != null){
					var node = topic[topic.length-2];
					myconsole.log("JSON node " + node);
				}
				if(jsonMessage['ip'] != null){
				var IP = jsonMessage['ip'];
					myconsole.log("JSON IP " + jsonMessage['ip']);}
				if(jsonMessage['id'] != null){
				var idReq = jsonMessage['id'];
					myconsole.log("JSON ID " + jsonMessage['id']);}
				
			//	myconsole.log("command = " + command + " value = " + value.toString() + " type = " + type + " port = " + port );
				
				if(command == "set"){
			//	myconsole.log("setting " + node + "/" + port + " to " + value);
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		    	
				
		    	
		    	   myconsole.log("MQTT sensor: Device updated " + node + ' ' + port + " " + value);
		    		socket.emit("deviceStatusChange",node,port,value);
		    		
	    		/*	db.getdata('Items',{Select:'Item_Current_Value',whereClause:'Node_Id = "' + parseInt(node) + '" AND Node_Port = "' + parseInt(port) +'"'},function(err,data_receive){
	    			
		    			if(data_receive){
		    				 myconsole.log("MQTT sensor db: " + message);
		    				if(data_receive[0].Item_Current_Value - value > 0.3 || data_receive[0].Item_Current_Value - value < -0.3){
		    					 
		    					socket.emit("deviceStatusChange",node,port,value);
		    					//	log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
		    						log.logger('Device', '{"node":"' + node + '","port":"' + port + '","value":"' + value.toString() + '"}');	
		    				}else{
		    					
		    					
		    					
		    				}
		    			}else if(err){
		    				
		    				myconsole.log(err);
		    			}
		    			
		    		
		    		});*/
		    	
		    	
				}else if(command == "reqId")
				
				{
				myconsole.log("requesting a new node ID for IP: " + IP);
		    	//socket.emit("nodeAlive",topic[topic.length-2],message);
		    	
				
		    	
		    	   myconsole.log("MQTT sensor: New Id requested");
		    		
		    		
		    		db.getdata('Items',{Select: 'Node_Id',whereClause:'Node_Id > 0 ORDER BY Node_Id DESC LIMIT 1'},function(err,data_receive){
				        // myconsole.log(data_receive);
				         if(data_receive[0]){
				                    //myconsole.log(data_receive);
				                   var  ID = data_receive[0].Node_Id + 1;
				                    // data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
				                    
				                    
				                    
				                    
				                    
				                    
				                   // MQTT_Publish('ctrlOut/'+idReq+'/command', '{"cmd":"newId","value":'+ID+'}');
				       
				                    myconsole.log('Sent new ID ' +  ID.toString());
				                    myconsole.log('IP ' +  IP);
				                    
				                    socket.emit("newNode",ID,IP,idReq);
				                   
				        }else 
				        if(err)
				        {
				            myconsole.log(err);
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
		 

	
	function sendNewId(){
	    	
	    	
	    	
    	db.getdata('Items',{Select: 'Node_Id',whereClause:'Node_Id > 0 ORDER BY Node_Id DESC LIMIT 1'},function(err,data_receive){
        // myconsole.log(data_receive);
         	if(data_receive[0]){
                    //myconsole.log(data_receive);
                   var  ID = data_receive[0].Node_Id + 1;
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
	
	
	
	
	
	
	
	}else{
		myconsole.log("error connecting to MQTT server");
	}
		});	
	
}
	
                   
exports.start = start;       