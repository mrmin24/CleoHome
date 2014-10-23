var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var routes = require('./routes');
var router = express.Router();

var db = require('./dbhandler');

var eventio = require('socket.io-client');
var eventsocket = eventio.connect('http://localhost:44602');

var alarmio = require('socket.io-client');
var alarmsocket = alarmio.connect('http://localhost:44601');

var port = 80;
var path = require('path'); 



function start() {
    
setupexpress();    





io.on('connection', function(socket){
  console.log('Client Connected');
  getAlarmStatus();
  
 
  
  socket.on('disconnect',function(){
     
     
     
     console.log('Client Disconnected');
     
      if(this.server.sockets.sockets.length ==0)
     {
         
         console.log('All clients disconnected');
        
     }
  });
  
  
  socket.on('AlarmDisconnect',function(){
      console.log('disconnect requested');
     alarmsocket.disconnect(); 
      
  });
  /*
  socket.on('AlarmConnect',function(){
       console.log('connect requested');
     alarmsocket = alarmio.connect('http://localhost:44601',{'forceNew':true }); 
     
     alarmsocket.on('connect', function() { 
    console.log('Connected to Alarm Module');
    
    alarmsocket.emit('register',{type:'Alarm',client:'Server'});
    
    
    
    alarmsocket.on('AlarmEvent',function(data){
       
       if(data['Partition'])
       {
           getState(data['Current_State'],function(realState){
               
           io.emit('AlarmEvent', {Partition: '1', Current_State: realState});   
               
           });
           
       }else
       {
            io.emit('AlarmEvent', data);
        
       }
        
        });
       });
      
  });
  
   socket.on('EventDisconnect',function(){
      console.log('disconnect requested');
     eventsocket.disconnect(); 
      
  });
  
  socket.on('EventConnect',function(){
       console.log('connect requested');
     eventsocket = eventio.connect('http://localhost:44602',{'forceNew':true }); 
    
    
     eventsocket.on('connect', function() { 
        console.log('Connected to Event Handler');
        // io.emit('ConnectionStatus',{item: 'Event_Handler',status:'connected'});
    
         eventsocket.emit('register',{type:'Alarm',client:'Server'});
    
        eventsocket.on('Event',function(data){
        
        io.emit('Event', data);
        });
    });
  });
  
  */
  
  
});
  


 

eventsocket.on('connect', function() { 
    console.log('Connected to Event Handler');
   // io.emit('ConnectionStatus',{item: 'Event_Handler',status:'connected'});
    
    eventsocket.emit('register',{type:'Alarm',client:'Server'});
    
    eventsocket.on('Event',function(data){
        
        if(data['Event'].indexOf('Partition') > -1) {

        io.emit('AlarmPartitionEventHandler', data);
    }
    else{
        
       io.emit('AlarmZoneEventHandler', data);
    }
    });
});

eventsocket.on('connectstatus', function() { 
    
    io.emit('ConnectionStatus',{item: 'Event_Handler',status:'Connected'});
    
    
});

eventsocket.on('disconnect', function() { 
     io.emit('ConnectionStatus',{item: 'Event_Handler',status:'Disconnected'});
    
});

alarmsocket.on('connect', function() { 
    console.log('Connected to Alarm Module');
    
    alarmsocket.emit('register',{type:'Alarm',client:'Server'});
    
    
    
    alarmsocket.on('AlarmEvent',function(data){
       
       if(data['Partition'])
       {
           getState(data['Current_State'],function(realState){
               
           io.emit('AlarmPartitionEvent', {Partition: '1', Current_State: realState});   
               
           });
           
       }else
       {
            io.emit('AlarmZoneEvent', data);
        
       }
        
    });
});

}
function getState(requiredState,callback){
    
    db.getdata('Alarm_States',{Select: 'State',whereClause:'Id = ' + requiredState},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                          callback(data_receive[0]['State']);
                        }
                       
                   });

    
    
}

function getAlarmStatus(){
    
    db.getdata('Alarm_Items',{Select: 'Name,Current_State,Description,Alarm_Event',whereClause:"'Id' LIKE '%'"},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                           for(var i in data_receive){
                            if(data_receive[i]['Name'].substring(0,4) =="Zone"){
                             
                             
                                var data = {Zone: data_receive[i]['Name'].substring(5),Current_State: data_receive[i]['Current_State'],Description:data_receive[i]['Description'],Alarm_Event:data_receive[i]['Alarm_Event']};
                               
                                io.emit('AlarmZoneEvent',data);
                                
                            }else if(data_receive[i]['Name'].substring(0,9) =="Partition")
                            {
                                  getState(data_receive[i]['Current_State'],function(realState){
                                var data = {Partition: data_receive[i]['Name'].substring(0,8)+'1',Current_State:realState };
                                io.emit('AlarmPartitionEvent',data);
                                  });
                                
                                
                            }
                               
                           }
                            
                            
                            return;
                        }
                       
                   });
                   
               
    
}

function setupexpress(){
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
     
   
    
    
    http.listen(port, function(){
      console.log('listening on port:'+ port.toString());
    });
    
    
    
    
    // home page route (http://localhost:8080)
    router.get('/', routes.index);
    
    app.use(express.static(path.join(__dirname, 'public')));
    // apply the routes to our application
    app.use('/', router);
    
    
    
    app.use(function(req, res){
    res.send(404);
  });
}


exports.start = start;