var db = require('./dbhandler');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var evaluate = require('../JSModules/Rule_Items_Evaluate');
var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);




exports.logger = function(type,event) {
    //console.log(event);
    var data = {Type: type, Event: event, Time: Date().toString()  };
    
   
	db.insert('Event_Log',data);
	
	
	return null;
}


exports.ownDb = function(type,data) {
   // console.log(data);
   
    
   
 	db.update(type,data);
	
	
	 getID(data.Name,function(ID){
        evaluate.evaluateChange(ID,data.Current_State,function(node,port,state){
                 
             if(node && port && state){
              mySensorsocket.emit('deviceSwitch',node,port,state);
             }
         //console.log(data_receive[0]);
        });
    
    });
	
    return null;
	

}


function getID(name,callback){
    
    db.getdata('Alarm_Items', {
        Select: 'Id',
        whereClause: "Name = '" + name + "'"
    }, function(err, data_receive) {

        if (err) {
            console.log(err);
        }
        else if (data_receive[0]['Id']) {
           //console.log(data_receive[0]['Id']);
           callback(data_receive[0]['Id']);
        }
        
        
    });
                                
                                

}

