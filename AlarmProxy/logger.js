var db = require('./dbhandler');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);






exports.logger = function(type,event) {
    console.log(event);
    var data = {Type: type, Event: event, Time: Date().toString()  };
    
   
	db.insert('Event_Log',data);
	
	
	return null;
}


exports.ownDb = function(type,data) {
   // console.log(data);
   
    
   
 	db.update(type,data);
	
	
    return null;
	

}




