var flash  = require('connect-flash');
var express = require('express');
var passport = require('passport');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('externalip');
//var routes = require('./routes');
//var router = express.Router();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var logger = morgan('combined');
require('./public/scripts/passport.js')(passport); // pass passport for configuration
var email = require('./public/scripts/email.js');

var path = require('path'); 
var db = require('./dbhandler');

var bypassedZones = [];

var lastArmTime = null;


var configure = require('../JSModules/GetConfig.js');
var configure2 = configure.data.xml;




var eventio = require('socket.io-client');
var eventsocket = eventio.connect('http://localhost:' + configure2.eventmodule[0].port[0]);

var alarmio = require('socket.io-client');
var alarmsocket = alarmio.connect('http://localhost:'+ configure2.alarmmodule[0].port[0]);





var port = configure2.server[0].port[0];   
var externalip = "127.0.0.1";

   //  var morgan = require('morgan');
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
     
    app.use(cookieParser('anewsecret'));
    app.use(bodyParser());
    //app.use(logger('dev')); // log every request to the console
    app.use(session({ secret: 'anewsecret2' }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    //app.use(passport.authenticate('remember-me'));
    app.use(express.static(path.join(__dirname, 'public')));




require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

http.listen(port);



function start() {
    
//setupexpress(); 
var dnsinterval = setInterval(function() {
        
    var oldip = externalip;    
    getip(function(ip){
        
        if(ip){
        externalip = ip;
        
        	if(oldip != externalip)
        	{
         if(configure2.server[0].dnsupdate[0] == 'true')  
		    updatedns(ip,function(){});
		 
		 if(configure2.server[0].dnsemail[0] == 'true')  
		    sendemail("Your current IP is http://" + ip);   
        	
		}
	
	}
        
    });
        
     
       // console.log('test');
    } ,1000*60*configure2.server[0].dnsinterval[0]);
    

        
    
        
     
      

io.on('connection', function(socket){
  console.log('Client Connected');
  getAlarmTriggers(lastArmTime);
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
    
    
    alarmsocket.emit('armDisarmAlarm',type);
    
    
});

  
 socket.on('bypassZone',function(zones,callback){
    
    var cancelBypass = [];
    cancelBypass.length = 0;
   
     alarmsocket.emit('bypassZones',zones,function(err,ack,zones){
         //console.log(zones);
        
        for(var i in zones){
           // console.log(zones[i][0]);
            
            
            var index = bypassedZones.indexOf(zones[i][0]);
           // console.log(index);
            if(index > -1){
                
                cancelBypass.push(bypassedZones[index]);
                bypassedZones.splice(index,1);   
            }else
            {
                
                bypassedZones.push(zones[i][0]);
            }
            
        }
        console.log("Bypassed zones are " + bypassedZones);
       callback(err,ack,bypassedZones,cancelBypass);
         
         
     });
    }); 
    
    
 socket.on('clearBypassZone',function(){
    
        bypassedZones.length = 0;
   
    }); 

socket.on('test',function(){
    test();
        
   
    });
    
});

}
  
function test(){
    
    console.log("testing triggers");
       io.emit("alarmTrigger",{Event:"Left Garage",Time:Date().toString()});
                 //  db.insert('Alarm_Triggers', {Zone: "Garage", Time: Date().toString()  });
                  //  sendemail("An alarm has been triggered by zone " + "Garage");
                    
                    
}

eventsocket.on('connect', function() { 
    console.log('Connected to Event Handler');
   // io.emit('ConnectionStatus',{item: 'Event_Handler',status:'connected'});
    
    eventsocket.emit('register',{type:'Alarm',client:'Server'});//,function(){});
    //console.log("testing");
    eventsocket.on('Event',function(data){
         //console.log(data);
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
    eventsocket.on('connectstatus', function() { 
    
        io.emit('ConnectionStatus',{item: 'Event_Handler',status:'Connected'});
    
    
    });

    eventsocket.on('disconnect', function() { 
     io.emit('ConnectionStatus',{item: 'Event_Handler',status:'Disconnected'});
    
    });
//});
});



alarmsocket.on('connect', function() { 
    console.log('Connected to Alarm Module');
    
    alarmsocket.emit('register',{type:'Alarm',client:'Server'},function(){
    
    
    
        alarmsocket.on('AlarmEvent',function(data){
           
           if(data['Partition'])
           {
               getState(data['Current_State'],function(realState){
                   
                   
               io.emit('AlarmPartitionEvent', {Partition: '1', Current_State: realState});   
                   
               });
               
           }else
           {
               //console.log(data);
                io.emit('AlarmZoneEvent', data);
            
           }
            
        });
        
        
        alarmsocket.on('keypadLedState',function(data){
          getModeStatus(function(night,connect,err){
            
             if(err){
              console.log("Error occured during night mode status retrieval");                          
            }else{
                if(data.Armed){
                    lastArmTime = Date.now();
                }else{
                   lastArmTime = null; 
                }
                
             io.emit("keypadLedState",{Bypass:data.Bypass, Memory:data.Memory,Armed:data.Armed,Ready:data.Ready,Night:night,Connected:connect});
            }
          });
        });
        
        alarmsocket.on('AlarmConnectionState',function(status,connected){
          
             io.emit("AlarmConnectionState",{Connected:connected,Status:status});
            
          });
        
        
        
        alarmsocket.on('alarmTrigger',function(data,time){
        console.log('Server Module: An alarm was triggered');
             db.getdata('Alarm_Items',{Select: 'Description',whereClause:"'Name' = '" + "'" + "Zone_" + data},function(err,data_receive){
                        
                   if(data_receive[0]){
                    console.log("Sending Email for Alarm Trigger, zone " + data_receive[0]['Description']);
                    io.emit("alarmTrigger",{Event:data_receive[0]['Description'],Time:time});
                    db.insert('Alarm_Triggers', {Zone: data_receive[0]['Description'], Time: Date().toString()  });
                    sendemail("An alarm has been triggered by zone " + data_receive[0]['Description']);
                    
                }else{
                    if (err) {
                        // error handling code goes here
                        console.log("ERROR : ",err);            
                    }
                
                    console.log("No zone retrieved for Alarm Trigger");
                    io.emit("alarmTrigger",{Event:"unknown",Time:time});
                    db.insert('Alarm_Triggers', {Zone: "unknown", Time: Date().toString()  });
                    
                    sendemail("An alarm has been triggered by unknown zone " + data);
                }
		
       
        });
        });
        
        alarmsocket.on('power',function(code){
             console.log("Server: Power:Sending Email");
            switch(code){
		    case 800: 
		        log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '12' ,Current_State: 0 });
		        io.emit("battery",false);
		        sendemail("Battery Trouble");
		        break;
		        
		    case 801: 
		        log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '12' ,Current_State: 1 });
		        io.emit("battery",true);
		        sendemail("Battery Trouble Restored");
		        break;
		        
		    
		    case 802: 
		        log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '13' ,Current_State: 0 });
		        io.emit("ac",false);
		        sendemail("AC Trouble");
		        break;
		        
		    case 803: 
		        log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '13' ,Current_State: 1 });
		        io.emit("ac",true);
		        sendemail("AC Trouble Restored");
		        break;
		       
		    default: {}
		    break;
            
            }
           
           
       
        });
        
        
        alarmsocket.on('trouble',function(code){
             
             
             if(code == '8411'){
                io.emit("ac",true);
                sendemail("Trouble Event Restored");
                log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '13' ,Current_State: 0 });
             }else if(code == '8401'){
                 io.emit("ac",false);
                 sendemail("Trouble Event");
                 console.log("Server: Trouble Condition: Sending Email");
                 log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '13' ,Current_State: 1 });
             }
             
        });
    
   //});
    });
});

    




function getState(requiredState,callback){
    
    db.getdata('Alarm_States',{Select: 'State',whereClause:'Id = ' + requiredState},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {            
                        // code to execute on data retrieval
                        if(data_receive[0])
                          callback(data_receive[0]['State']);
                        else
                          callback(false);
                        }
                       
                   });

}

function getAlarmStatus(){
    
    db.getdata('Alarm_Items',{Select: 'Name,Current_State,Description,Alarm_Event,Type',whereClause:"'Id' LIKE '%'"},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR : ",err);            
                        } else {       
                            
                        // code to execute on data retrieval
                        var zone = [1 , 2 , 3 , 4 , 6];
                        
                           for(var i in data_receive){
                               //console.log(data_receive[i]['Type'] + " " + data_receive[i]['Name']);  
                                if(zone.indexOf(data_receive[i]['Type']) != -1 )
                                {
                                    var data = {Zone: data_receive[i]['Name'].substring(5),Current_State: data_receive[i]['Current_State'],Description:data_receive[i]['Description'],Alarm_Event:data_receive[i]['Alarm_Event']};
                               
                                    io.emit('AlarmZoneStatusEvent',data);
                                    
                                   
                                
                                }
                                else if(data_receive[i]['Type'] == 9)
                                {
                                    getState(data_receive[i]['Current_State'],function(realState){
                                        var data = {Partition: data_receive[i]['Name'].substring(0,8)+'1',Current_State:realState };
                                        io.emit('AlarmPartitionStatusEvent',data);
                                    });
                                
                                
                                }
                                 else if(data_receive[i]['Type'] == 10)
                                {
                                     var bypass,memory,armed,ready;
                                   var flag_bypass = 8,flag_memory = 4, flag_armed = 2,flag_ready = 1;
                                  var code = data_receive[i]['Current_State'];
                                  // console.log("the code " + code);       
                                          
                                   if(code & flag_bypass)
                                   {
                                      bypass = true;
                                   }
                                   else{
                                       bypass = false;
                                   }
                                    
                                    
                                    if(code & flag_memory)
                                   {
                                      memory = true;
                                   }
                                   else{
                                       memory = false;
                                   }
                                   
                                   if(code & flag_armed)
                                   {
                                      armed = true;
                                      
                                   }
                                   else{
                                       armed = false;
                                   }
                                   
                                   if(code & flag_ready)
                                   {
                                      ready = true;
                                   }
                                   else{
                                       ready = false;
                                   }
                                  var night = null;  
                                 
                                 getModeStatus(function(night,connect,err){
                                    if(err){
                                        console.log("Error occured during night mode status retrieval");
                                    }else{
                                      //  console.log(bypass + " " + memory + " " + armed + " " + ready);
                                     io.emit("keypadLedState",{Bypass:bypass, Memory:memory,Armed:armed,Ready:ready,Night:night,Connected:connect});
                                    }
                                  });
                                
                                }else if(data_receive[i]['Type'] == 11)
                                {
                                    
                                        io.emit('nightModeState',data_receive[i]['Current_State']);
                                   
                                
                                
                                }else if(data_receive[i]['Type'] == 12)
                                {
                                    io.emit('battery',data_receive[i]['Current_State']);
                                
                                
                                }else if(data_receive[i]['Type'] == 13)
                                {
                                    io.emit('ac',data_receive[i]['Current_State']);
                                
                                
                                }
                               
                           }
                             
                            
                             io.emit('bypassedZones',bypassedZones);
                        }
                       
                   });
                   
             
               
               return;
    
}


function getEvents(numEvents){
    var done = false;
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

function getAlarmTriggers(lastArmTime){
    
    db.getdata('Alarm_Triggers',{Select: 'Zone,Time',whereClause:"Time > " + lastArmTime},function(err,data_receive){
        
        if(err){
            console.log(err);    
        }else if(data_receive[0]){
            for(var i in data_receive){
                io.emit("alarmTrigger",{Event:data_receive[i]["Zone"],Time:data_receive[i]["Time"]});
            }
        }
        
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



function toHex(str){
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i);
	}
	return hex;
}

function sendemail(data){
     
     // send the message and get a callback with an error or details of the message that was sent
    email.server.send({
       text:    data + " at " + Date().toString(), 
       from:    configure2.email[0].from[0], 
       to:      configure2.email[0].to[0],
       cc:      configure2.email[0].cc[0],
       subject: data
        }, function(err, message) { 
       // console.log(err || message); 
        if(message){
		console.log("IP Address email sent successfully");
	}else if(err){
		console.log("An error occured while sending email");
	}
	
	return;
     });
  }
 



function getModeStatus(callback){
    db.getdata('Alarm_Items',{Select: 'Current_State',whereClause:"Type LIKE '%11%' OR Type LIKE '%14%' ORDER BY Id ASC LIMIT 2"},function(err,data_receive){
          
         if(data_receive[0]){    
            if(data_receive[0]['Current_State']){
              
             // console.log("Debug: Night mode is active");
              
              if(data_receive[1]['Current_State']){
              
              callback(true,true,false);
              
              }else if(data_receive[1]['Current_State'] == 0){
               callback(true,false,false);
                  
              }
              
                
            }else if(!data_receive[0]['Current_State']){
            
           // console.log("Debug: Night mode is NOT active");
              if(data_receive[1]['Current_State']){
              
              callback(false,true,false);
              
              }else if(data_receive[1]['Current_State'] == 0){
              
               callback(false,false,false);
                  
              }
            }
            
         }else{
             callback(false,true);
         }
     });
                                 
}

function getip(callback){
    
    ip(function (err, ip) {
  	//console.log(ip); // => 8.8.8.8
  
  
  	callback(ip);
	});

}

function updatedns(ip,callback2){
    
    var http2 = require('http');
    var username = 'mariusminny@gmail.com';
    var password = 'Yd@33557722';
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var header = { 'Authorization': auth};
    //'Host': 'https://ydns.eu/api/v1/update/?host=example.ydns.eu&ip='+ip,
   
    var options = {
      host: 'ydns.eu',
      path: '/api/v1/update/?host=cleohome.ydns.eu',//&ip='+ip.substring(0,15),
      port: '80',
      //This is the only line that is new. `headers` is an object with the headers to request
      headers: header 
    };
    
  var req = http2.request(options, function(res) {
  //	console.log('STATUS: ' + res.statusCode);
  //	console.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    		console.log('DNS Update: ' + chunk);
  	});
  });

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
//req.write('data\n');
//req.write('data\n');
req.end();	
callback2();

}

exports.start = start;
