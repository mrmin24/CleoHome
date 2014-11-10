var flash  = require('connect-flash');
var express = require('express');
var passport = require('passport');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var routes = require('./routes');
//var router = express.Router();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var logger = morgan('combined');
require('./public/scripts/passport.js')(passport); // pass passport for configuration

var path = require('path'); 
var db = require('./dbhandler');

var eventio = require('socket.io-client');
var eventsocket = eventio.connect('http://localhost:44602');

var alarmio = require('socket.io-client');
var alarmsocket = alarmio.connect('http://localhost:44601');

var port = 80;   

   //  var morgan = require('morgan');
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
     
    app.use(cookieParser('qwertyyui'));
    app.use(bodyParser());
    //app.use(logger('dev')); // log every request to the console
    app.use(session({ secret: 'qwertyuio' }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, 'public')));




require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

http.listen(port);






function start() {
    
//setupexpress(); 


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
  
  socket.on('getEvents',function(data){
    
    
   // console.log(data);
    
    getEvents(data['numEvents']);
    
    
    
});

 socket.on('getImportantEvents',function(data){
    
    
   // console.log(data);
    
    getImportantEvents(data['numEvents']);
    
    
    
});

 socket.on('getLastAlarm',function(data){
    
    
   // console.log(data);
    
    getLastAlarm();
    
    
    
});

    socket.on('armDisarmAlarm',function(type){
    
    
   
    
    alarmsocket.emit('armDisarm',type);
    
    
    
});

  
 socket.on('bypassZone',function(zone,callback){
    
    
   
     alarmsocket.emit('bypassZones',zone,function(err,acks){
         
        
       callback(err,acks);
         
         
         
     });
    
    
    
    
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
        
        if(data['Event'].indexOf('Partition') > -1) 
        {
    
           var eventdata = JSON.parse(data['Event']);
            
             constructEvent(eventdata,data['Time'],data['Type'],function(eventstring,alarm,time,type){
                if(eventstring)
                {
                    var datatosend = {Type: type,Event:eventstring,Time:time};
               
                    io.emit('AlarmPartitionEventHandler', datatosend);
                    
        
                }
            });
        }
        else if(data['Event'].indexOf('Important') > -1)
        {
            var eventdata = JSON.parse(data['Event']);
            
            constructEvent(eventdata,data['Time'],data['Type'],function(eventstring,alarm,time,type){
                if(eventstring)
                {
                    var datatosend = {Type: type,Event:eventstring,Time:time};
           
                    io.emit('ImportantEventHandler', datatosend);
                    
                }
            });
        }
        else if(data['Event'].indexOf('Zone') > -1)
        {
            var eventdata = JSON.parse(data['Event']);
            
            constructEvent(eventdata,data['Time'],data['Type'],function(eventstring,alarm,time,type){
                if(eventstring)
                {
                    var datatosend = {Type: type,Event:eventstring,Time:time};
           
                    io.emit('AlarmZoneEventHandler', datatosend);
                    
                }
            });
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
    
    
    alarmsocket.on('keypadLedState',function(data){
       
       var bypass,memory,armed,ready;
       var flag_bypass = 8,flag_memory = 4, flag_armed = 2,flag_ready = 1;
       
       
       if(toHex(data['state']) & flag_bypass)
       {
          bypass = true;
       }
       else{
           bypass = false;
       }
        
        
        if(toHex(data['state']) & flag_memory)
       {
          memory = true;
       }
       else{
           memory = false;
       }
       
       if(toHex(data['state']) & flag_armed)
       {
          armed = true;
       }
       else{
           armed = false;
       }
       
       if(toHex(data['state']) & flag_ready)
       {
          ready = true;
       }
       else{
           ready = false;
       }
        console.log(toHex(data['state']));
        
        
         io.emit("keypadLedState",{Bypass:bypass, Memory:memory,Armed:armed,Ready:ready});
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

function getAlarmStatus()
{
    
    db.getdata('Alarm_Items',{Select: 'Name,Current_State,Description,Alarm_Event',whereClause:"'Id' LIKE '%'"},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                           for(var i in data_receive){
                                if(data_receive[i]['Name'].substring(0,4) == "Zone")
                                {
                                    var data = {Zone: data_receive[i]['Name'].substring(5),Current_State: data_receive[i]['Current_State'],Description:data_receive[i]['Description'],Alarm_Event:data_receive[i]['Alarm_Event']};
                               
                                    io.emit('AlarmZoneStatusEvent',data);
                                
                                }
                                else if(data_receive[i]['Name'].substring(0,9) =="Partition")
                                {
                                    getState(data_receive[i]['Current_State'],function(realState){
                                        var data = {Partition: data_receive[i]['Name'].substring(0,8)+'1',Current_State:realState };
                                        io.emit('AlarmPartitionStatusEvent',data);
                                    });
                                
                                
                                }
                               
                           }
                            
                            
                            return;
                        }
                       
                   });
                   
               
    
}


function getEvents(numEvents){
    
    db.getdata('Event_Log',{Select: 'Id,Type,Event,Time',whereClause:"Id LIKE '%' ORDER BY Id DESC LIMIT " + numEvents},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                           for(var i = numEvents-1;i>=0;i--){
                                
                                var eventData = JSON.parse(data_receive[i]['Event']);
                                
                                    
                                    
                                    
                                    constructEvent(eventData,data_receive[i]['Time'],data_receive[i]['Type'],function(eventstring,alarm,time,type){
                                        if(eventstring)
                                        {  
                                           var  data = {Event_Type: type,Event:eventstring,Time:time,Alarm:alarm};
                                      
                                            if(data)
                                            {
                                                io.emit('sendEvents',data);
                                            }
                                        }
                                    
                                    });
                                
                            }
                               
                           }
                            
                            return;
                        
                        });
    

    
    
}

function getImportantEvents(numEvents){
    
    db.getdata('Event_Log',{Select: 'Id,Type,Event,Time',whereClause:"Event LIKE '%Important%' ORDER BY Id DESC LIMIT " + numEvents},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        }
                        else 
                        {            
                            
                        if(data_receive[0])
                        {   
                        // code to execute on data retrieval
                           for(var i = numEvents-1;i>=0;i--){
                             if(data_receive[i])
                             {   
                                var eventData = JSON.parse(data_receive[i]['Event']);
                                
                                    
                                    
                                    
                                    constructEvent(eventData,data_receive[i]['Time'],data_receive[i]['Type'],function(eventstring,alarm,time,type){
                                        if(eventstring)
                                        {  
                                           var  data = {Event_Type: type,Event:eventstring,Time:time,Alarm:alarm};
                                      
                                            if(data)
                                            {
                                                io.emit('sendImportantEvents',data);
                                            }
                                        }
                                    
                                    });
                                
                            }
                           }
                            
                        }
                        else
                        {
                                
                                
                          var  data = {Event_Type: "None",Event:"No important events found",Time:"None",Alarm:"None"};
                                   
                          if(data)
                          {
                            io.emit('sendImportantEvents',data);
                          }
                        }
                            
                               
                           }
                            
                            return;
                        
                        });
    

    
    
}



function getLastAlarm(){
    
    db.getdata('Event_Log',{Select: 'Id',whereClause:"Event LIKE '%12%' ORDER BY Id DESC LIMIT 1"},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                        
                        if(data_receive[0])
                        {
                        var newid = data_receive[0]['Id']-10;

                          db.getdata('Event_Log',{Select: '*',whereClause:"Id > "+ newid +" limit 20"},function(err,data_receives){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                        
                        
                           for(var i = 0;i<=data_receives.length-1;i++){
                                
                                var eventData = JSON.parse(data_receives[i]['Event']);
                                
                                    
                                    
                                    
                                    constructEvent(eventData,data_receives[i]['Time'],data_receives[i]['Type'],function(eventstring,alarm,time,type){
                                        if(eventstring)
                                        {  
                                           var  data = {Event_Type: type,Event:eventstring,Time:time,Alarm:alarm};
                                      
                                            if(data)
                                            {
                                                io.emit('lastAlarmEvents',data);
                                            }
                                        }
                                    
                                    });
                                
                            }
                               
                           }
                            
                            return;
                        
                        });
                        }
                        else
                        {
                            var  data = {Event_Type: "None",Event:"No alarm event found",Time:"None",Alarm:"None"};
                                      
                                            if(data)
                                            {
                                                io.emit('lastAlarmEvents',data);
                                            }
                            
                        }
                               
                           }
                            
                            return;
                        
                        });
    

    
    
}


function constructEvent(eventData,time,type,callback){
    
    if(eventData['Zone'] && eventData['Current_State'])
    {
    
        var state = null;
        var Alarm = null;
        getState(eventData['Current_State'],function(data){
                            
            state = data;
           if(state == "Alarm")
           {
            var eventString = eventData['Zone'] + " - " + state;
            callback(eventString,"Alarm",time,type);  
            
               
           }
           else
           {
            var eventString = eventData['Zone'] + " - " + state;
            callback(eventString,null,time,type);
           }                
        });
                        // code to execute on data retrieval
        
                    
    }
    else if(eventData['Status'])
    {
        
         var eventString = eventData['Status'];
         callback(eventString,null,time,type);
    }
    else if(eventData['Important'])
    {
        
         var eventString = eventData['Important'];
         callback(eventString,null,time,type);
    }
    else
    {
        
        callback(null,null,null,null);
    }
}

function setupexpress(){
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
     
     
     ////////////////////////////////////////////SETUP for PASSPORT AUTHENTICATION
     

////////////////////////////////////////////////////////////////////////////////////////////////////////////

   
   // http.listen(port, function(){
  //    console.log('listening on port:'+ port.toString());
  //  });
    // home page route (http://localhost:8080)
  //  router.get('/', routes.index);
    
    app.use(express.static(path.join(__dirname, 'public')));
    // apply the routes to our application
  //  app.use('/', router);
    
    
  //  app.use(function(req, res){
 //   res.send(404);
  //});
  
  
  
  
  


}



function toHex(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i);
	}
	return hex;
}

exports.start = start;