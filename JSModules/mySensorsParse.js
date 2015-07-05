var net = require('net');
//var log = require('./logger.js');

var gatewayip = '10.0.0.22';
var gatewayport = '5003';
var actual = new net.Socket();
var retrytimer;
var db = require('./dbhandler');

var Access_Type = 5;
var Irrigation_Type = 6; 
var Motion_Type = 7;

//var alarmio = require('socket.io-client');
//var actual = alarmio.connect(gatewayip + gatewayport);


function start() {
	var io = require('socket.io').listen(44606);
	if(io)
	{ console.log('MySensor Module Listening on ' + '44606');}
	
	
	io.sockets.on('connection', function(socket){
	  console.log('Client connected to mysensor Parser');
	 
	connect();
	
		 socket.on('deviceSwitch',function(NodeId,NodePort,State){
		 	
		 	
		 	//console.log("sending data");
		 	sendData(NodeId,NodePort,State)	;
		 	
		 });
		 
		 
		 
		 
		function processData(data){
	    
	    	
	    	if(data[2] == 1){
	    		socket.emit("deviceStatusChange",data[0],data[1],data[5]);
	    		
	    		
	    	}
	    	
	    	if(data[2] == 3){
	    		if(data[4] == 3){  //id request
	    			
	    			console.log("Id Request received");
	    			sendNewId();
	    			
	    		}
	    	}
	    	
	    	
	    	
	    }       
	
			
		
	   
		  	function connect(){
		  		console.log('Mysensors: Trying to connect to Gateway @ ' + gatewayip + ':' + gatewayport);
		  	
					actual.connect({port: gatewayport, host:gatewayip}, function() {
					    console.log('Mysensors: Gateway connected');
				       
	                	if(retrytimer)clearInterval(retrytimer);                
					});
					
					
					
		  
		  	}
		
	
	   
	    
	    process.on('uncaughtException', function(err) {
	    if(err.code == 'EHOSTUNREACH'){
	        //retryconnect();
	        	if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
	    }
	    
	   
		});
			
			
		actual.on('error', function(e) {
				
				
			/*	if(e.code == 'ECONNREFUSED') {}  */
				
			console.log("Mysensors: Gateway connection error = " + e);	
			
				if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
	
			 
		});
			
		actual.on('close', function() {
				
			console.log("Mysensors: Gateway connection closed" );	
				if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
	
				
		});
			
		actual.on('timeout', function() {
				
			console.log("Mysensors: Gateway connection timeout" );	
				if(retrytimer)clearInterval(retrytimer);    
		  		retrytimer = setInterval(function() {connect()},5000);
		
				
		});
		
		
		actual.on('disconnect', function() {
			
		console.log("Mysensors: Gateway connection disconnected" );	
			if(retrytimer)clearInterval(retrytimer);    
		  	retrytimer = setInterval(function() {connect()},5000);
	
				
		});
		
		actual.on('data', function(data) {
	    	var dataslice = data.toString().replace(/[\n\r]/g, '').split(';');
	        console.log(dataslice);    
	        
	        processData(dataslice);
	  
		});
		
	    	
	    	
	    function sendData(NodeId,NodePort,State){		
	    	
	    		db.getdata('Items',{Select: 'Item_Type,Item_Is_Toggle,Item_Toggle_Delay',whereClause:'Node_Id = ' + NodeId.toString() + ' AND Node_Port = ' + NodePort.toString()},function(err,data_receive){
	    			 if(data_receive[0]){
	    			 	
	    			 	if(data_receive[0].Item_Type == Access_Type && data_receive[0].Item_Is_Toggle == 1 ){
				    	 	if(State == 0){
					    	 	actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;40;0\n',function(){
				       
				                       //console.log('data sent');
				                   });
					    	 	
					    	 }else{
				    	 		actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;40;' + data_receive[0].Item_Toggle_Delay + '\n',function(){
				       
				                       //console.log('data sent');
				                   });
					    	 }
		    			 }else 	if(data_receive[0].Item_Type == Irrigation_Type && data_receive[0].Item_Is_Toggle == 1 ){
					    	 
					    	 if(State == 0){
					    	 	actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;41;0\n',function(){
				       
				                       //console.log('data sent');
				                   });
					    	 	
					    	 }else{
						    	 actual.write(NodeId.toString() + ';' +  NodePort.toString() +';1;1;41;' + data_receive[0].Item_Toggle_Delay + '\n',function(){
						       
						                       //console.log('data sent');
						                   });
					    	 }
		    			  }else 
		    			 {
		    			 	
		    			 	actual.write(NodeId.toString() + ';' + NodePort.toString()+';1;1;2;' + State.toString() +'\n',function(){
					       
					                       //console.log('data sent');
					                   });	
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
	
	
	});
}


                   
exports.start = start;                   