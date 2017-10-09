var db = require('./dbhandler');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var evaluate = require('../JSModules/Rule_Items_Evaluate');
var mySensorio = require('socket.io-client');
//var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);
var myconsole = require('./myconsole.js');



exports.logger = function(type,event) {
    //myconsole.log(event);
    var data = {Type: type, Event: event, Time: Date().toString()  };
    
   
	db.insert('Event_Log',data);
	
	
	return null;
};


exports.ownDb = function(type,data) {
   // myconsole.log(data);
   
    
   
 	db.update(type,data);
	
	
	/* getID(data.Name,function(ID){
	     
	  //   rules.updateRuleStates(ID, Curren_State);
                 
      /*  evaluate.evaluateChange(ID,data.Current_State,function(node,port,state){
                 
             if(node && port && state){
              mySensorsocket.emit('deviceSwitch',node,port,state);
             }
         //myconsole.log(data_receive[0]);
        });*/
    
   // });
	
    return null;
	

};


/*function getID(name,callback){
    
    db.getdata('Alarm_Items', {
        Select: 'Id',
        whereClause: "Name = '" + name + "'"
    }, function(err, data_receive) {

        if (err) {
            myconsole.log(err);
        }
        else if (data_receive[0]['Id']) {
           //myconsole.log(data_receive[0]['Id']);
           callback(data_receive[0]['Id']);
        }
        
        
    });
                                
                                

}*/

