//var app = require('express')();
//var http = require('http').Server(app);
//var io = require('socket.io')();
//var io = require('socket.io')();
//var server = http.createServer();
//server.listen(port, ipAddress);


//http.listen(44602, function(){
//  console.log('listening on *:44602');
//});
var configure = require('./GetConfig.js');
var configure2 = configure.data.xml;

var port = configure2.eventmodule[0].port[0];
var db = require('./dbhandler');

var lastId = 0;
var timer1;

function start() {

var io = require('socket.io').listen(port);
if(io)
{ console.log('Event Module Listening on ' + port.toString());}










io.sockets.on('connection', function(socket){
  console.log('Event Handler: Client connected');
 // var data = 'Alarm';
  
  socket.on('register',function(data,callback){
      console.log(data.client + ' registered for ' + data.type + ' events');
      
    getLast("'"+data.type+"'",function(result){
        
        if(result.length > 0)
        {  // console.log(result[0]['Id']);
            lastId = result[0]['Id']; 
            socket.emit('Event', result[0]);
         //   console.log(result[0]);
        }
       
        setListen("'"+data.type+"'",lastId,function(result){
        for(var i in result){
         // lastId = result[i]['Id'];
         socket.emit('Event', result[i]);
        //console.log(result[i]);
        }
       socket.emit('connectstatus');
        
        });
        callback();
    });
    
    });
    
 socket.on('disconnect',function(){
     
     
     
     console.log('Client Disconnected');
     
     if(this.server.sockets.sockets.length ==0)
     {
         
         console.log('All clients disconnected');
         clearInterval(timer1);
     }
     
 });   
    
});
  
}
  
/*
 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
*/




function setListen(type,lastId,callback){
    
  //console.log(type);
  if(type === "'Alarm'"){
     
   if(timer1){clearInterval(timer1);}
   
   timer1 =  setInterval(function() {
       
        db.getdata('Event_Log',{Select: 'Id,Type, Event, Time',whereClause:'Type = ' + type + ' AND Id > '+ lastId},function(err,data_receive){
            if (err) {
            // error handling code goes here
                console.log("ERROR : ",err);            
            } else {            
            // code to execute on data retrieval
              if(data_receive.length > 0){
                lastId = data_receive[data_receive.length-1]['Id'];
              }
             // console.log(data_receive[0]);
              callback(data_receive);
              
            }
           
       });
        
     
        
    } ,1000);
    
    
  }else if(type === "'Motion'"){
      // console.log(type + " " + lastId);
    
    // if(timer2){clearInterval(timer2);}
   
   timer2 =  setInterval(function() {
       
       // console.log(type + " " + lastId);
       
        db.getdata('Event_Log',{Select: 'Id,Type, Event, Time',whereClause:'Type = ' + type + ' AND Id > '+ lastId},function(err2,data_receive2){
                        if (err2) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {  
                           // console.log(data_receive2);
                        // code to execute on data retrieval
                          if(data_receive2.length > 0){
                            lastId = data_receive2[data_receive2.length-1]['Id'];
                          }
                         // console.log(data_receive[0]);
                          callback(data_receive2);
                          
                        }
                       
                   });
        
     
        
    } ,1000);
  }
    
}

function getLast(type,callback){
    
    db.getLast('Event_Log',{Select: 'Id,Type,Event,Time',whereClause:'Type = ' + type},function(err,result){
        if (err) 
        {
         // error handling code goes here
            console.log("ERROR : ",err);            
            }
            else {            
        // code to execute on data retrieval
                callback(result);
        }
        
    });
    
    
}





exports.start = start;