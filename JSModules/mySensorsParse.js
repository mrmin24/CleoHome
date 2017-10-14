var net = require('net');
var log = require('./logger.js');

var gatewayip = '192.168.2.22';
var gatewayport = '5003';
var actual = new net.Socket();
var retrytimer;
var db = require('./dbhandler');
var myconsole = require('./myconsole.js');

var rules = require('./Rule_UpdateStates.js');
var Access_Type = 5;
var Irrigation_Type = 6; 
var Motion_Type = 7;
var Power_Type = 10;
var offTimes = [];
var offTimesObjects = {};
var offTimeInterval = 1000;

//var alarmio = require('socket.io-client');
//var actual = alarmio.connect(gatewayip + gatewayport);

	connect();

	function connect(){
  		myconsole.log('Mysensors: Trying to connect to Gateway @ ' + gatewayip + ':' + gatewayport);
  		
			actual.connect({port: gatewayport, host:gatewayip}, function() {
			    myconsole.log('Mysensors: Gateway connected');
			    
		      //  ipc.server.broadcast("gatewayConnected",1);
            	if(retrytimer)clearInterval(retrytimer);      
            	
            	
			});
			
			
			
  
  	}



const ipc = require('node-ipc');

//const ipc=require('../../../node-ipc');

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = 'mySensParse';
ipc.config.retry= 1500;
//ipc.config.silent = true;
//ipc.config.rawBuffer=true;

//ipc.config.maxConnections=1;

ipc.serve(
    function(){
        
        ipc.server.on(
            'socket.disconnected',
            function(data,socket){
                myconsole.log('DISCONNECTED\n\n',arguments);
            }
        );
        
        
        ipc.server.on(
            'connect',
            function(socket){
            	//myconsole.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
                
            }
        );
        
    }
);

ipc.server.on(
    'error',
    function(err){
       myconsole.log('Error occured' + err);
    }
);

ipc.server.start();




function start() {
   // myconsole.log(debug);
	//var io = require('socket.io').listen(44606);
	
//	if(io)
//	{ myconsole.log('MySensor Module Listening on ' + '44606');}
	

	
//	io.sockets.on('connection', function(socket){
	  myconsole.log('Client connected to mysensor Parser');

		
		checkOffTimes();
		var offTimeTimer = setInterval(checkOffTimes,offTimeInterval);
		
		 	ipc.server.on('deviceSwitch',function(nodeData){   //NodeId,NodePort,State,rulereq,timeOn
		 	
		 	
		 	myconsole.log("is array " + Array.isArray(nodeData['NodeID']));
		 	if(Array.isArray(nodeData['NodeID']))
			 	for(var i in nodeData['NodeID'])
			 	{
			 		myconsole.log("mysens1 " + nodeData['NodeID'][i] + " " + nodeData['NodePort'][i] + " " + nodeData['State'][i] + " " + nodeData['RuleReq'][i] );
			 		setTimeout(function() {
					    sendData(nodeData['NodeID'][i],nodeData['NodePort'][i],nodeData['State'][i],nodeData['RuleReq'][i],nodeData['NodeTimeOn'])	;
					}, 250);
			 	}
		 	else
		 	{   myconsole.log("mysens2 " + nodeData['NodeID'] + " " + nodeData['NodePort'] + " " + nodeData['State'] + " " + nodeData['RuleReq'] );
		 	
		 	
		 		sendData(nodeData['NodeID'],nodeData['NodePort'],nodeData['State'],nodeData['RuleReq'],nodeData['NodeTimeOn'])	;
		 	
		 			
		 	}
		 });
		 
		 
		 ipc.server.on('switchOff',function(nodeData){   //NodeId,NodePort,State,virtual,offTime
		 	
		 	var foundIndex = 0;

		 	//	myconsole.log("Switch off: " + NodeId + " " + NodePort + " " + virtual);
		 	if(nodeData['NodePort'] == null){nodeData['NodePort'] = 1;}
		 

		 //	myconsole.log(offTimes);

		 	for(var i = 0;i<offTimes.length;i++){
		 		
		 		if(offTimes[i]['data']['node'] == nodeData['NodeID'] && offTimes[i]['data']['port'] == nodeData['NodePort']  ){
		 			
		 			offTimes[i]['data']['offTime'] = nodeData['offTime'];
		 			offTimes[i]['data']['state'] = nodeData['State'];

		 	
		 			foundIndex = 1;
		 			
		 		}
		 		
		 		
		 	}
		 	
		 	if(foundIndex == 0)
		 	{
			 	offTimesObjects.node = parseInt(nodeData['NodeID']);
			 	offTimesObjects.port = nodeData['NodePort'];
			 	offTimesObjects.state = nodeData['State'];
			 	offTimesObjects.offTime = nodeData['offTime'];
			 	offTimesObjects.virtual = nodeData['virtual'];
			 	
			 	
			 	offTimes.push({data: offTimesObjects});
			 	
			 	
		 	}
		 	
		 	//	myconsole.log(offTimes);
		 	foundIndex = 0;
		 	offTimesObjects = {};
		 	
		 	
		 //	myconsole.log(offTimes);
		 });
		 
		 
		 
		function processData(data){
	    	ipc.server.broadcast("nodeAlive",{'NodeID':data[0]});
	    	var sensorTypes = ['17','0','8','38','39','7'];// ['0','1','17','18','35','38','39'];
	    	if(data[2] == 1 && sensorTypes.indexOf(data[4]) == -1 ){
	    	   myconsole.log("Mysensor: Device updated");
	    		
	    		
    			db.getdata('Items',{Select:'Item_Current_Value',whereClause:'Node_Id = "' + data[0] + '"AND Node_Port = "' + data[1] +'"'},function(err,data_receive){
    			
	    			if(data_receive){
	    				
	    				if(data_receive[0].Item_Current_Value - data[5] > 0.3 || data_receive[0].Item_Current_Value - data[5] < -0.3){
	    					ipc.server.broadcast("deviceStatusChange",{
	    						'NodeID':data[0],
	    						'NodePort':data[1],   //NodeID,NodePort,State
	    						'State':data[5]
	    						});
	    					//	log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
	    						log.logger('Device', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');	
	    				}
	    			}else
	    			{
	    					ipc.server.broadcast("sensorStatusChange",{
	    						'NodeID':data[0],
	    						'NodePort':data[1],   //NodeID,NodePort,State
	    						'State':data[5],
	    						'Type':data[4]
	    						});
	    						
	    					
    					//log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
    					log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');
	    				myconsole.log(err);
	    			}
	    		});
	    	
	    		
	    	}else if(data[2] == 1 && sensorTypes.indexOf(data[4]) != -1 ){
	    		myconsole.log("Mysensor: Sensor updated2");
	    		
	    		
	    		
	    		db.getdata('Items',{Select:'Item_Current_Value, Item_Type',whereClause:'Node_Id = "' + data[0] + '"AND Node_Port = "' + data[1] +'"'},function(err,data_receive){
	    			
	    			if(data_receive){
	    			//	myconsole.log(data_receive);
	    				db.getdata('Item_Types',{Select:'Type',whereClause:'Id = "' + data_receive[0].Item_Type +'"' },function(err,data_receive2){
	    				//	if(data_receive[0].Item_Current_Value - data[5] > 0.3 || data_receive[0].Item_Current_Value - data[5] < -0.3){
	    				
	    				if(data_receive2){
	    				//	myconsole.log(data_receive2);
			    			if(data_receive[0].Item_Current_Value - data[5] > 0.3 || data_receive[0].Item_Current_Value - data[5] < -0.3){
			    			ipc.server.broadcast("sensorStatusChange",{
			    				'NodeID':data[0],
	    						'NodePort':data[1],   //NodeID,NodePort,State
	    						'State':data[5],
	    						'Type':data[4]
			    			});
			    					//log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
			    					log.logger(data_receive2[0].Type, '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');
			    				}
	    				}else{
	    					myconsole.log(err);
	    				}
	    			
	    			//else{
	    			//	ipc.server.broadcast("sensorStatusChange",data[0],data[1],data[5],data[4]);
    					//log.logger('Sensor', '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data_receive[0].Item_Current_Value + '"}');
    				//	log.logger(data_receive2[0].Type, '{"node":"' + data[0] + '","port":"' + data[1] + '","value":"' + data[5] + '"}');
	    			//}
	    			
	    			
	    		});
	    		}else{
	    			myconsole.log(err);
	    		}
	    		
	    		
	    		});
	    	}
	    	
	    
	    	
	    	if(data[2] == 3){
	    		if(data[4] == 3){  //id request
	    			
	    			myconsole.log("Id Request received");
	    			sendNewId();
	    			
	    		}
	    		if(data[4] == 18){  //id request
	    			
	    		//	myconsole.log("Alive received");
	    		
	    			
	    		}
	    		
	    	}
	    	
	    	
	    	
	    	
	    }       
	
			
		
	   
		  
		
	
	   
	    
	    process.on('uncaughtException', function(err) {
	    if(err.code == 'EHOSTUNREACH'){
	        //retryconnect();
	        ipc.server.broadcast("gatewayConnected",{'gatewayState':0});
	        	if(retrytimer)clearInterval(retrytimer);    
		  	//	retrytimer = setInterval(function() {connect()},5000);
	    }
	    
	   
		});
			
			
		actual.on('error', function(e) {
				
				
			/*	if(e.code == 'ECONNREFUSED') {}  */
				
			myconsole.log("Mysensors: Gateway connection error = " + e);	
				ipc.server.broadcast("gatewayConnected",{'gatewayState':0});
				if(retrytimer)clearInterval(retrytimer);    
		  	//	retrytimer = setInterval(function() {connect()},5000);
	
			 
		});
			
		actual.on('close', function() {
				
			myconsole.log("Mysensors: Gateway connection closed" );
				ipc.server.broadcast("gatewayConnected",{'gatewayState':0});
				if(retrytimer)clearInterval(retrytimer);    
		  	//	retrytimer = setInterval(function() {connect()},5000);
	
				
		});
			
		actual.on('timeout', function() {
				
			myconsole.log("Mysensors: Gateway connection timeout" );
				ipc.server.broadcast("gatewayConnected",{'gatewayState':0});
				if(retrytimer)clearInterval(retrytimer);    
		  	//	retrytimer = setInterval(function() {connect()},5000);
		
				
		});
		
		
		actual.on('disconnect', function() {
			
		myconsole.log("Mysensors: Gateway connection disconnected" );	
			ipc.server.broadcast("gatewayConnected",{'gatewayState':0});
			if(retrytimer)clearInterval(retrytimer);    
		 // 	retrytimer = setInterval(function() {connect()},5000);
	
				
		});
		
		actual.on('data', function(data) {
	    	var dataslice = data.toString().replace(/[\n\r]/g, '').split(';');
	        myconsole.log(dataslice);    
	        
	        processData(dataslice);
	  
		});
		
		
		
		
	    	
	    	
	    function sendData(NodeId,NodePort,State,rulereq,timeOn){		
	    	//myconsole.log("mysens data: " + NodeId + " " + NodePort  );
	    		
	    		db.getdata('Items',{Select: 'Item_Type,Item_Is_Toggle,Item_Toggle_Delay,Item_Current_Value',whereClause:'Node_Id = ' + NodeId.toString() + ' AND Node_Port = ' + NodePort.toString()},function(err,data_receive){
	    			 if(data_receive[0]){
	    			 	if(data_receive[0].Item_Current_Value != State){
	    			 				var time = 0;
		    			 		//myconsole.log("Mysensor state" + State);
		    			 		if(rulereq == 1){
		    			 		//	if(data_receive[0].Item_Is_Toggle == 1)
		    			 		//	{
		    			 		//		time = data_receive[0].Item_Toggle_Delay;
		    			 		//	}else{
		    			 				time = State;	
		    			 		//	}
		    			 		}else{
		    			 			if(timeOn > 0){
		    			 				
		    			 				time = timeOn;
		    			 				
		    			 			}else{
		    			 				time = data_receive[0].Item_Toggle_Delay;
		    			 			}
		    			 		}
		    			 	if(data_receive[0].Item_Type == Access_Type && data_receive[0].Item_Is_Toggle == 1 ){
		    			 	
					    	 	if(State == 0){
						    	 	actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;47;0\n',function(){
					       
					                       //myconsole.log('data sent');
					                   });
						    	 	
						    	 }else{
						    	 	
					    	 		actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;47;' + time.toString() + '\n',function(){
					       
					                       //myconsole.log('data sent');
					                   });
						    	 }
			    			 }else 	if(data_receive[0].Item_Type == Irrigation_Type && data_receive[0].Item_Is_Toggle == 1 ){
						    	 
						    	 if(State == 0){
						    	 	actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;48;0\n',function(){
					       
					                       //myconsole.log('data sent');
					                   });
						    	 	
						    	 }else{
							    	 actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;48;' + time.toString() + '\n',function(){
							       
							                      // myconsole.log(NodeId.toString() + ';' +  NodePort.toString() +';1;1;48;' + data_receive[0].Item_Toggle_Delay);
							                   });
						    	 }
			    			  }else 
			    			 {
			    			 	
			    			 	actual.write(NodeId.toString() + ';' + NodePort.toString()+';1;1;2;' + State.toString() +'\n',function(){
						       
						                       //myconsole.log('data sent');
						                   });	
			    			 }
	    			 	}
				                   
		    	}else 
		        if(err)
		        {
		            myconsole.log(err);
		        }
		    	
		    	 
		    });
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
		
		function checkOffTimes(){
		 var time = new Date().getTime()	;
		//	myconsole.log(time);
		//	myconsole.log(offTimes);
        	//return t.setSeconds(t.getSeconds() + onTime);
			for(var i = 0;i < offTimes.length;i++){
				myconsole.log(offTimes[i]['data']['node'] + " " + offTimes[i]['data']['port'] + " " + offTimes[i]['data']['offTime']);
				if(time >= offTimes[i]['data']['offTime']){
					
					
					if(offTimes[i]['data']['virtual'] == 1){
					var 	data = {Set:'Item_Current_Value',Where:'Id',Current_State:0,Name:offTimes[i]['data']['node']};
                        
                        db.update('Items',data,function(){});
						 rules.updateRuleStates(offTimes[i]['data']['node'], 0);
						 
					}else{
						sendData(offTimes[i]['data']['node'],offTimes[i]['data']['port'],offTimes[i]['data']['state'],1,0);
					}
					offTimes.splice(i, 1);
					myconsole.log("Switch Off");
					i--;
				}
				
				
				
			}
		
		
		}
	
		
	
	//});
	

}

	
                   
exports.start = start;                   