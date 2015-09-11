var flash  = require('connect-flash');
var express = require('express');
var passport = require('passport');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var ip = require('external-ip');
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
var getconfig = require('../JSModules/GetConfig.js');
var writeXML = require('../JSModules/WriteConfig.js');
var configure = getconfig.data;
var configure2 = configure.xml;

var gatewayStatus = 0;


var eventio = require('socket.io-client');
var eventsocket = eventio.connect('http://localhost:' + configure2.eventmodule[0].port[0]);

var alarmio = require('socket.io-client');
var alarmsocket = alarmio.connect('http://localhost:'+ configure2.alarmmodule[0].port[0]);

var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);

const Virtual_Item_Type = 15;
var nodeCheckInterval = 60000;

var port = configure2.server[0].port[0];   
var externalip = "127.0.0.1";

   //  var morgan = require('morgan');
    app.set('views', __dirname + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');
     
    app.use(cookieParser('anewsecret'));
    //app.use(bodyParser());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(bodyParser.json());
    //app.use(logger('dev')); // log every request to the console
    //app.use(session({ secret: 'anewsecret2' }));
    app.use(session({
        secret: 'anewsecret2',
        name: 'cleohome_session',
        //store: sessionStore, // connect-mongo session store
        proxy: true,
        resave: true,
        saveUninitialized: true
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    //app.use(passport.authenticate('remember-me'));
    app.use(express.static(path.join(__dirname, 'public')));




require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

http.listen(port);



function start() {
    var oldip = externalip;    

    var nodeinterval = setInterval(updateNodeStatus(),nodeCheckInterval);
    var dnsinterval = setInterval(function() {
        
   
    getip(function(ip){
        
        if(ip){
        externalip = ip;
        
        	if(oldip != externalip)
        	{
             if(configure2.server[0].dnsupdate[0] == 'true')  
    		    updatedns(ip,function(){});
    		 
    		 if(configure2.server[0].dnsemail[0] == 'true')  
    		    sendemail("Your current IP is http://" + ip);   
    		    
    		 if(configure2.server[0].dnsproxy[0] == 'true')  
    		   updatednsproxy(function(){});   
		       
		      oldip = externalip;   
        	
		    }
	
	}
    
});
        
     
       // console.log('test');
    } ,1000*60*configure2.server[0].dnsinterval[0]);
    

      

io.on('connection', function(socket){
  console.log('Client Connected');
  //console.log(lastArmTime);
  getAlarmTriggers(lastArmTime);
  getAlarmStatus();
  getDeviceStatus();
  getNodeStatus();
  sendConfig(); 
  sendGatewayStatus();
  
  socket.on('disconnect',function(){
     
     
     
     console.log('Client Disconnected');
     
      if(this.server.sockets.sockets.length ==0)
     {
                         
         console.log('All clients disconnected');
        
     }
  });
  
  socket.on('updateconfig',function(config_receive){
     // console.log(config_receive);
     writeXML.json2xml(config_receive,'xml',function(xml){
         getconfig.config(function(){
          var configure3 = getconfig.data;
           // console.log("2  " + configure3.xml.server[0].dnsupdate[0]);
             configure2 = configure3.xml; 
            //console.log(configure2.server[0].dnsupdate[0]);
           io.emit("config",configure2); 
         });
       
         
     })
     
      
  });
  
  socket.on('getusers',function(){
      
      sendusers();
      
  });
  
  
  
  socket.on('delete_user',function(userId,username){
      //console.log(userId);
      db.deletedata('users',{whereClause:'id = "' + userId + '"'},function(){
          
          console.log('User Deleted');
          db.deletedata('user_logins',{whereClause:'Username = "' + username + '"'},function(){
          
          console.log('User Token Deleted');
          io.emit("user_deleted");
          sendusers();
        });
          
      });
      
      
      
  });
  socket.on('delete_user_token',function(username){
      //console.log(userId);
      
          db.deletedata('user_logins',{whereClause:'Username = "' + username + '"'},function(){
          
          console.log('User Token Deleted');
          io.emit("user_token_deleted");
        });
          
     
  });
  
  
 /* socket.on('AlarmDisconnect',function(){   
      console.log('disconnect requested');
     alarmsocket.disconnect(); 
      
  });*/
  
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
    
    
    
    
 socket.on('refreshIP',function(){
    
        getip(function(ip){
            
            if(ip){
               
    		    updatedns(ip,function(){});
    		 
    		 
    		    sendemail("Your current IP is http://" + ip);   
    		    
    		
    		   updatednsproxy(function(){});   
    		  
        	}
            
        });
   
    }); 
    

    socket.on('test',function(){
        test();
        
   
    });
    
    socket.on("getNodesStatus",function(){
       // console.log("test");
        updateNodeStatus();
    });
    
    socket.on('deviceSwitch',function(Id){
      //console.log(userId);
      
        db.getdata('Items',{Select: 'Item_Type,Item_Current_Value,Node_Id,Node_Port',whereClause:'Id = ' + Id.toString()},function(err,data_receive){
      	
      	  if(data_receive){
      	      
      	   if(data_receive[0].Item_Current_Value == 1 )
      	   {
          	     if(data_receive[0].Item_Type == Virtual_Item_Type)
          	    {
          	       virtualDeviceStatusChange(Id,0);
          	    }else
          	    {
                 mySensorsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,0);
          	    }
            }else
            {    if(data_receive[0].Item_Type == Virtual_Item_Type)
      	        {
      	            virtualDeviceStatusChange(Id,1);
      	        }else
      	        {
                    mySensorsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,1);
      	        }
            } 
      	  }
        });
  });
    
});

}


function virtualDeviceStatusChange(Id,State){
    
    var evaluate = require('../JSModules/Rule_Items_Evaluate');
   if(State > 0){State = 1;}
   
     db.getdata('Items',{Select: 'Id,Item_Enabled_Value',whereClause:'Id = ' + Id},function(err,data_receive){
        // console.log(data_receive);
         if(data_receive[0]){
                    //console.log(data_receive);
                    ID = data_receive[0].Id;
                    enabledValue = data_receive[0].Item_Enabled_Value;
                     data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
                    db.update("Items",data,function(err,data_receive){
                          
                          
                        
                         if(data_receive){
                            // console.log(ID + " " + State);
                             io.emit('DeviceEvent', {Id:ID,Current_State:State,Item_Enabled_Value:enabledValue});
                             evaluate.evaluateChange(ID,State,function(node,port,state){
                             
                             if(node && port && state){
                              mySensorsocket.emit('deviceSwitch',node,port,state);
                             }
                             //console.log(data_receive[0]);
                             });
                             
                             
                         }else
                         {
                            console.log(err); 
                             
                         }
                        
                    }); 
        }else 
        if(err)
        {
            console.log(err);
        }
         
     });
    
}

mySensorsocket.on('deviceStatusChange',function(NodeID,NodePort,State){
    //console.log("Device Status Change");
   // console.log(NodePort);
   var evaluate = require('../JSModules/Rule_Items_Evaluate');
   if(State > 0){State = 1;}
   
     db.getdata('Items',{Select: 'Id,Item_Enabled_Value',whereClause:'Node_Id = ' + NodeID.toString() + ' AND Node_Port = ' + NodePort.toString()},function(err,data_receive){
        // console.log(data_receive);
         if(data_receive[0]){
                    //console.log(data_receive);
                    ID = data_receive[0].Id;
                    enabledValue = data_receive[0].Item_Enabled_Value;
                     data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
                    db.update("Items",data,function(err,data_receive){
                          
                          
                        
                         if(data_receive){
                            // console.log(ID + " " + State);
                             io.emit('DeviceEvent', {Id:ID,Current_State:State,Item_Enabled_Value:enabledValue});
                             evaluate.evaluateChange(ID,State,function(node,port,state){
                            
                             if(node && port && state){
                              mySensorsocket.emit('deviceSwitch',node,port,state);
                             }
                             //console.log(data_receive[0]);
                             });
                             
                             
                         }else
                         {
                            console.log(err); 
                             
                         }
                        
                    }); 
        }else 
        if(err)
        {
            console.log(err);
        }
         
     });
    
   
    
    
});


mySensorsocket.on('gatewayConnected',function(gatewayState){
    gatewayStatus = gatewayState;
    sendGatewayStatus();
    
    
});


mySensorsocket.on('nodeAlive',function(NodeID){
    var timenow = new Date().getTime();
     data = {Set:'Last_Seen',Current_State:timenow,Where:"Node_Port",Name:NodeID};
    db.update("Nodes",data,function(err,data_receive){
              
              
            
             if(data_receive){
                // console.log(ID + " " + State);
                 console.log("Node state updated");
                 
                 
             }else
             {
                console.log(err); 
                 
             }
            
    }); 
    updateNodeStatus();
    
});


  
function sendusers(){
    console.log("Getting Users...");
      db.getdata('users',{Select: 'id,username',whereClause:'id LIKE "%"'},function(err,data_receive){
                      // console.log('test1'); 
                   if(data_receive[0]){
                   // console.log(data_receive);
                    io.emit("sendUsers",data_receive);
                    
                }else{
                    if (err) {
                        // error handling code goes here
                        console.log("ERROR (GetUsers) : ",err);            
                    }
                
                    
                }
		
       
            });
}  
  
function test(){
    
    console.log("testing triggers");
       io.emit("alarmTrigger",{Event:"Left Garage",Time:Date().toString()});
                   db.insert('Alarm_Triggers', {Zone: "Garage", Time: Date()  });
                  //  sendemail("An alarm has been triggered by zone " + "Garage");
                    
                    
}

eventsocket.on('connect', function() { 
    console.log('Connected to Event Handler');
   // io.emit('ConnectionStatus',{item: 'Event_Handler',status:'connected'});
    
    eventsocket.emit('register',{type:'Alarm',client:'Server'},function(){});
    eventsocket.emit('register',{type:'Motion',client:'Server'},function(){});
    
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
           // console.log(eventdata);
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
           //console.log("Alarm event")
           if(data['Partition'])
           {    //console.log("this " + data['Current_State']);
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
                    lastArmTime = Date();
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
            //console.log(data);
             db.getdata('Alarm_Items',{Select: 'Description',whereClause:'Name = ' + '"' + 'Zone_' + data + '"'},function(err,data_receive){
                      // console.log('test1'); 
                   if(data_receive[0]){
                    console.log("Sending Email for Alarm Trigger, zone " + data_receive[0]['Description']);
                     sendemail("An alarm has been triggered by zone " + data_receive[0]['Description']);
                     db.insert('Alarm_Triggers', {Zone: data_receive[0]['Description'], Time: Date().toString()  });
                    io.emit("alarmTrigger",{Event:data_receive[0]['Description'],Time:time});
                    
                   
                    
                }else{
                    if (err) {
                        // error handling code goes here
                        console.log("ERROR (Alarm Trigger) : ",err);            
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
               // sendemail("Trouble Event Restored");
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
    //console.log(requiredState);
    db.getdata('Alarm_States',{Select: 'State',whereClause:'Id = ' + requiredState},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR1 : ",err);            
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
                            console.log("ERROR2 : ",err);            
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
function getDeviceStatus(){
   
    db.getdata('Items',{Select: 'Id,Item_Name,Item_Current_Value,Item_Type,Node_Id,Node_Port',whereClause:"'Id' LIKE '%' ORDER BY Item_Sort_Position ASC"},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR2 : ",err);            
                        } else {       
                            
                        // code to execute on data retrieval
                        var device = [1 , 2 , 3 , 4 , 5,6,7,11,15];
                        
                           for(var i in data_receive){
                              // console.log(data_receive[i]['Item_Name']);  
                                if(device.indexOf(data_receive[i]['Item_Type']) != -1 )
                                {
                                    var data = {Id:data_receive[i]['Id'],Device: data_receive[i]['Item_Name'],Current_State: data_receive[i]['Item_Current_Value'],Node_Id:data_receive[i]['Node_Id'],Node_Port:data_receive[i]['Node_Port'],Item_Type:data_receive[i]['Item_Type']};
                                   
                                    io.emit('DeviceStatusEvent',data);
                                    
                                   
                                
                                }
                                
                                
                               
                           }
                             
                            
                             
                        }
                       
                   });
                   
             
               
               return;
    
}

function getNodeStatus(){
   
    db.getdata('Nodes',{Select: 'Id,Name,Last_Seen,Node_Port',whereClause:"'Id' LIKE '%' ORDER BY Node_Sort_Position ASC"},function(err,data_receive){
    if (err) {
    // error handling code goes here
        console.log("ERROR2 : ",err);            
    } else {       
        
    // code to execute on data retrieval
   // var device = [1 , 2 , 3 , 4 , 5,6,7,11,15];
    
       for(var i in data_receive){
          // console.log(data_receive[i]['Item_Name']);  
           // if(device.indexOf(data_receive[i]['Item_Type']) != -1 )
            //{
                var data = {Id:data_receive[i]['Id'],Device: data_receive[i]['Name'],Current_State: data_receive[i]['Last_Seen'],Node_Port:data_receive[i]['Node_Port'],Item_Type:'Node'};
               
                io.emit('DeviceStatusEvent',data);
                
               
            
           // }
            
            
           
       }
         
        
         
    }
   
});
}

function updateNodeStatus(){
   
    db.getdata('Nodes',{Select: 'Id,Name,Last_Seen,Node_Port',whereClause:"'Id' LIKE '%' ORDER BY Node_Sort_Position ASC"},function(err,data_receive){
    if (err) {
    // error handling code goes here
        console.log("ERROR2 : ",err);            
    } else {       
        
    // code to execute on data retrieval
   // var device = [1 , 2 , 3 , 4 , 5,6,7,11,15];
    
       for(var i in data_receive){
           //console.log(data_receive[i]['Item_Name']);  
           // if(device.indexOf(data_receive[i]['Item_Type']) != -1 )
            //{
                var data = {Id:data_receive[i]['Id'],Device: data_receive[i]['Name'],Current_State: data_receive[i]['Last_Seen'],Node_Port:data_receive[i]['Node_Port'],Item_Type:'Node'};
               
                io.emit('NodeStatusEvent',data);
                
               
            
           // }
            
            
           
       }
         
        
         
    }
   
});
       
    
    
    return;
    
}





function getEvents(numEvents){
    var done = false;
    db.getdata('Event_Log',{Select: 'Id,Type,Event,Time',whereClause:"Id LIKE '%' ORDER BY Id DESC LIMIT " + numEvents},function(err,data_receive){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR3 : ",err);            
                        } else {            
                        // code to execute on data retrieval
                           for(var i = numEvents-1;i>=0;i--){
                                
                                var eventData = JSON.parse(data_receive[i]['Event']);
                                
                                  //  console.log(eventData);
                                    
                                   
                                     
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
                            console.log("ERROR4 : ",err);            
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
                            console.log("ERROR5 : ",err);            
                        } else {            
                        // code to execute on data retrieval
                        
                        if(data_receive[0])
                        {
                        var newid = data_receive[0]['Id']-10;

                          db.getdata('Event_Log',{Select: '*',whereClause:"Id > "+ newid +" limit 20"},function(err,data_receives){
                        if (err) {
                        // error handling code goes here
                            console.log("ERROR6 : ",err);            
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
    
    db.getLast('Alarm_Triggers',{Select: 'Zone,Time',whereClause:"'Zone' LIKE '%'" },function(err,data_receive){
        
        if(err){
            console.log(err);    
        }else if(data_receive[0]){
            if(data_receive[0]['Time'] > lastArmTime){
             console.log("New alarm event");
                io.emit("alarmTrigger",{Event:data_receive[0]["Zone"],Time:data_receive[0]["Time"]});
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
		console.log("Email sent successfully");
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
   
   require('http').request({
    hostname: 'myexternalip.com',
    path: '/raw',
    agent: false
    }, function(res) {
    if(res.statusCode != 200) {
        throw new Error('non-OK status: ' + res.statusCode);
    }
    res.setEncoding('utf-8');
    var ipAddress = '';
    res.on('data', function(chunk) {
        ipAddress += chunk;
     // console.log(chunk);
     callback(ipAddress); 
        
    });
     
    res.on('end', function() {
     // ipAddress contains the external IP address
    });
    }).on('error', function(err) {
    throw err;
}).end();
   


}

function updatedns(ip,callback2){
    
    var http2 = require('http');
    var username = configure2.server[0].dnsusername[0];
    var password = configure2.server[0].dnspassword[0];
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

function updatednsproxy(callback2){
    var http2 = require('http');
   
   
   // var header = { 'Authorization': auth};
    //'Host': 'https://ydns.eu/api/v1/update/?host=example.ydns.eu&ip='+ip,
   
    var options = {
      host: 'api.unotelly.com',
      path: '/api/v1/network/update_by_hash_api?user_hash=15c5462a66cfcce300f0ef2d82098269',//&ip='+ip.substring(0,15),
     // host: 'www.trickbyte.com',
      //path: '/autoupdate.php?email=mariusminny@gmail.com&hash=ff157a4e40705b686babbcf03d3c54e3',//&ip='+ip.substring(0,15),
      // host: 'smartdns.cactusvpn.com',
      //path: '/index.php?smartkey=efcbfcb0efcbd8189fa123d2337c9645',//&ip='+ip.substring(0,15),
      
      port: '80'
      //This is the only line that is new. `headers` is an object with the headers to request
     // headers: header 
    };
    
  var req = http2.request(options, function(res) {
  //	console.log('STATUS: ' + res.statusCode);
  //	console.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    		//console.log('DNS Proxy Update: ' + chunk);
    		console.log('DNS Proxy Update: OK');
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

function sendConfig(){
    
    
    io.emit("config",configure2);
    return;
    
    
}

function sendGatewayStatus(){
    io.emit("gatewayConnected",gatewayStatus);
    
}

exports.start = start;
