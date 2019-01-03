var flash  = require('connect-flash');
var express = require('express');
var passport = require('passport');
var app = express();
var http = require('http').createServer(app);


var rules = require('./Rule_UpdateStates.js');



var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var logger = morgan('combined');
var log = require('./logger.js');
require('./public/scripts/passport.js')(passport); // pass passport for configuration

var email = require('./public/scripts/email.js');
var pushOver = require('./public/scripts/pushOver.js');
var path = require('path'); 
var db = require('./dbhandler');
//var updateIP = require('./public/scripts/updateIP.js');
var bypassedZones = [];

var lastArmTime = Date();
var getconfig = require('../JSModules/GetConfig.js');
var writeXML = require('../JSModules/WriteConfig.js');
var configure = getconfig.data;
var configure2 = configure.xml;

var gatewayStatus = 0;
var ROWS = 0;

//var eventio = require('socket.io-client');
//var eventsocket = eventio.connect('http://localhost:' + configure2.eventmodule[0].port[0]);

//var alarmio = require('socket.io-client');
//var alarmsocket = alarmio.connect('http://localhost:'+ configure2.alarmmodule[0].port[0]);

//var mySensorio = require('socket.io-client');
//var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


//var rulesio = require('socket.io-client');
//var rulessocket = rulesio.connect('http://localhost:'+ 44603);

var MQTTio = require('socket.io-client');
var MQTTsocket = MQTTio.connect('http://localhost:'+ 44607,{query:"name=Server",'force new connection': true});  //, {'force new connection': true}

var io = null;

const Virtual_Item_Type = 15;
const Virtual_Alarm_Item_Type = 18;
const Phone_Item_Type = 20;
var nodeCheckInterval = 60000;

var port =  configure2.server[0].port[0];   //port must be redirected to this port on debian using 'sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to--port 8080   use -D to undo'

var myconsole = require('./myconsole.js');

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

try{
  io = require('socket.io')(http);
  
 
 try{
  
  http.listen(port);
  
 }catch(e){
   myconsole.log(e);
 }
 
 myconsole.log("Server on PORT: " + port);
 
 
}catch(e){
 
 myconsole.log(e);
}

  
  const ipcRaw = require('node-ipc').IPC;
  const ipc = new ipcRaw;
  const serveripc= new ipcRaw;
//const ipc=require('../../../node-ipc');

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/
ipc.config.id = 'Server';
ipc.config.retry= 1500;

serveripc.config.id = 'Server';
serveripc.config.retry= 1500;
//ipc.config.silent = true;





 var oldip = externalip;  

 //myconsole.log(io);
 
 
function start() {
    //log(debug);
    
 //myconsole.log(io);
try{
 serveripc.serve(
    function(){
        
        serveripc.server.on(
            'socket.disconnected',
            function(data,socket){
                myconsole.log('DISCONNECTED\n\n',arguments);
            }
        );
        
        
        serveripc.server.on(
            'connect',
            function(socket){
            //	myconsole.log('Alarmmmmmmmmmmmmmmmmmmmmmm');
                
            }
        );
        
        serveripc.server.on(
          'error',
          function(err){
             myconsole.log('Error occured' + err);
          }
      );
        
    }
    
    
);



serveripc.server.start();
}catch(e){myconsole.dumpError(e);}


ipc.connectTo(
    'MQTTParse',
    function(){
        ipc.of.MQTTParse.on(
            'connect',
            function(){
                
                myconsole.log('CleoServer connected to MQTT Parser with IPC ##');
                
            }
        );
        ipc.of.MQTTParse.on(
            'disconnect',
            function(){
               
            }
        );
        
        ipc.of.MQTTParse.on(
            'deviceConnected',
            function(){
               
                myconsole.log('vvvvvvvvvvvvvvvvvvvvv   ');
               
            }
        );
        
        
        
        ipc.of.MQTTParse.on('nodeAlive2',function(nodeData){       //NodeID,Status
       
          myconsole.log("2: Setting " + nodeData['NodeID'] + ' to ' + nodeData['Status']);
          
          var timenow = new Date().getTime();
        var   data = {Set:'Status',Current_State:nodeData['Status'].toLowerCase(),Where:"Node_Port",Name:nodeData['NodeID']};
         try{ db.update("Nodes",data,function(err2,data_receive){
                   
                   
                 
                  if(data_receive){
                      myconsole.log(nodeData['NodeID'] + " " + nodeData['Status']);
                    var   data2 = {Set:'Last_Seen',Current_State:timenow,Where:"Node_Port",Name:nodeData['NodeID']};
                      db.update("Nodes",data2,function(err2,data_receive2){
                                
                                
                              
                               if(data_receive2){
                                  // myconsole.log(ID + " " + State);
                                   myconsole.log("Node state updated");
                                   
                                   if(nodeData['Status'].toLowerCase() == "offline"){
                                    
                                   var  data3 = {Set:'Item_Current_Value',Current_State:3,Where:"Node_Id",Name:nodeData['NodeID']};
                                    db.update("Items",data3,function(err2,data_receive3){
                                
                                
                              
                                            if(data_receive3){
                                               // myconsole.log(ID + " " + State);
                                                myconsole.log("Node state updated2");
                                                
                                                db.getdata('Items',{Select: 'Id,Item_Current_Value,Item_Enabled_Value',whereClause:'Node_Id = ' + nodeData['NodeID'].toString() },function(err2,data_receive4){
                                                   myconsole.log(data_receive4[0]);
                                                   if(data_receive4[0]){
                                                              myconsole.log(data_receive4[0].Id);
                                                            
                                                              for(var i = 0;i<data_receive4.length;i++){
                                                               
                                                               
                                                                 io.emit('DeviceEvent', {Id:data_receive4[i].Id,Current_State:data_receive4[i].Item_Current_Value,Item_Enabled_Value:data_receive4[i].Item_Enabled_Value});
                                               
                                                               
                                                               
                                                              }
                                                              
                                                              
                                                  }else 
                                                  if(err2)
                                                  {
                                                      myconsole.log(err2);
                                                  }
                                                   
                                               });
                                              
                                               
                                                
                                                
                                            }else
                                            {
                                               myconsole.log(err2); 
                                                
                                            }
                                           
                                   });
                                    
                                    
                                   }
                                   
                                   
                               }else
                               {
                                  myconsole.log(err2); 
                                   
                               }
                              
                      });
                      updateNodeStatus(nodeData['NodeID']);
                      
                  }else
                  {
                     myconsole.log(err2); 
                      
                  }
                 
         });  }catch(e){myconsole.dumpError(e);} 
         
         
     });   //nodeAlive
     
     
     
        ipc.of.MQTTParse.on('deviceStatusChange',function(nodeData){
           myconsole.log("Device Status Change4" + " " + nodeData['NodeID'] + " " + nodeData['NodePort'] + " " + nodeData['State']);
          // State = parseInt(State);
          // myconsole.log(nodeData['State']);
            
         // var evaluate = require('../JSModules/Rule_Items_Evaluate');
          if(nodeData['State'] > 0){nodeData['State'] = 1;}
          
            db.getdata('Items',{Select: 'Id,Item_Enabled_Value',whereClause:'Node_Id = ' + nodeData['NodeID'].toString() + ' AND Node_Port = ' + nodeData['NodePort'].toString()},function(err2,data_receive){
              // myconsole.log(err2);
               myconsole.log(data_receive);
                if(data_receive[0]){
                           
                         var  ID = data_receive[0].Id;
                         var   enabledValue = data_receive[0].Item_Enabled_Value;
                           
                        var   data = {Set:'Item_Current_Value',Current_State:nodeData['State'],Where:"Id",Name:ID};
                           db.update("Items",data,function(err2,data_receive2){
                                 
                                 
                               
                                if(data_receive2){
                                   // myconsole.log("data: " + ID + " " + enabledValue);
                                    io.emit('DeviceEvent', {Id:ID,Current_State:nodeData['State'],Item_Enabled_Value:enabledValue});
                                
                                    rules.updateRuleStates(ID, nodeData['State']);
                                   
                                   /* evaluate.evaluateChange(ID,State,function(node,port,state,virtual,cancelTime,func){
                                        
                                        eval(func);
                                        
                                        if(node && port && state){
                                         mySensorsocket.emit('deviceSwitch',node,port,state,1);
                                        }
                                        
                                        if(cancelTime){
                                                    
                                            mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                                        }
                                        
                                         if(virtual == 1){
                                            virtualDeviceStatusChange(node,state);
                                          
                                            
                                        }
                                    //myconsole.log(data_receive[0]);
                                    });*/
                                    
                                    
                                }else
                                {
                                   myconsole.log(err2); 
                                    
                                }
                               
                           }); 
               }else 
               if(err2)
               {
                   myconsole.log(err2);
               }
                
            });
           
          
           
           
       });    //devicestatuschange
    
   
       ipc.of.MQTTParse.on('newNode',function(nodeData){
        
         myconsole.log(nodeData['newNodeIP']);
         io.emit('newNode',nodeData['newNodeId'],nodeData['newNodeIP'],nodeData['oldId']);
        
        
        
        
       });   //newNode
       
       //MQTTsocket.on('deviceStatusChange',function(NodeID,NodePort,State){
       
       
       
       ipc.of.MQTTParse.on('sensorStatusChange',function(nodeData){   //NodeID,NodePort,State,Type
           //myconsole.log("Device Status Change");
          // myconsole.log(NodePort);
          //var evaluate = require('../JSModules/Rule_Items_Evaluate');
          
          
            db.getdata('Items',{Select: 'Id,Item_Current_Value,Time_Updated,Item_Type',whereClause:'Node_Id = ' + nodeData['NodeID'].toString() + ' AND Node_Port = ' + nodeData['NodePort'].toString()},function(err2,data_receive){
               // myconsole.log(data_receive);
                if(data_receive[0]){
                           //myconsole.log(data_receive);
                         var  ID = data_receive[0].Id;
                         var currentValue = data_receive[0].Item_Current_Value;
                         var updateTime = data_receive[0].Time_Updated;
                         var doUpdate = false;
                         var timediff = (new Date() - new Date(updateTime))/1000;
                         myconsole.log("Time diff1: " + timediff);
                         
                         if((nodeData['State'] <= currentValue - 0.3) || (nodeData['State'] >= currentValue + 0.3) || (timediff >= 5*60) ){
                           doUpdate = true;
                         }
                         
                         if(doUpdate == true){
                        //  myconsole.log("Updated: " + State + " " + (currentValue - 0.3) + " " + (currentValue + 0.3) + " " + (timediff >= 5*60)  );
                         // var data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
                          // db.update("Items",data,function(err2,data_receive2){
                          var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                          
                          var time = (new Date(Date.now() - tzoffset)).toISOString().replace(/T/, ' ').replace(/\..+/, '');
                          
                         //  myconsole.log(time);
                          db.getSQL("Update Items SET Item_Current_Value = " + nodeData['State'] + " ,Time_Updated = '" + time + "' WHERE Id = " + ID,function(err2,data_receive2){
                                 
                                 //	myconsole.log("Server: Sensor updated");
                               
                                if(data_receive2){
                                   // myconsole.log(ID + " " + State);
                                    io.emit('SensorEvent', {Id:ID,Current_State:nodeData['State']});
                                     log.logger(nodeData['Type'], '{"Item_Id":"'+ID+'","Node":"'+nodeData['NodeID'] +'","Value":"'+ nodeData['State'] +'"}');
                                    rules.updateRuleStates(ID, nodeData['State']);
                                    
                                  
                                    
                                    
                                }else
                                {
                                   myconsole.log(err2); 
                                    
                                }
                               
                           }); 
                          doUpdate = false;
                         }
               }else 
               if(err2)
               {
                   myconsole.log(err2);
               }
                
            });
           
          
           
           
       });   //sensorstatuschange

 

     


          ipc.of.MQTTParse.on('updateNodeStatus',function(nodeData){
             var timenow = new Date().getTime();
             myconsole.log("MQTT: nodeupdate");
             var  data2 = {Set:'Last_Seen',Current_State:timenow,Where:"Node_Port",Name:nodeData['NodeID']};
              db.update("Nodes",data2,function(err2,data_receive2){
                        
                        
                      
                       if(data_receive2){
                          // myconsole.log(ID + " " + State);
                           myconsole.log("Node state updated");
                           
                           
                       }else
                       {
                          myconsole.log(err2); 
                           
                       }
                      
              });
              updateNodeStatus(nodeData['NodeID']);
              
          });  //updateNodeStatus

 
 
 
 
 
    setStartupStatus(); 
    updateIP2();
  
    var nodeinterval = setInterval(updateNodeStatus,nodeCheckInterval);
    var dnsinterval = setInterval(function() {
      
   
   
    updateIP2();
        
     
    
    } ,1000*60*configure2.server[0].dnsinterval[0]);
    
  
  //myconsole.log("ioXXXXXXXXXXXXXXXXXXX");

 });   //end mymqtt parse ipc
 
 
 
io.on('connection', function(Websocket){
   myconsole.log('Server: Client Connected');

   getAlarmTriggers(lastArmTime,Websocket); 
   
   sendGatewayStatus(Websocket);
     
   
 Websocket.on('firstConnect',function(){
  
  
   sendPageTabs(Websocket);
   
   getAlarmStatus(Websocket,1);   //send on update
   getDeviceStatus(Websocket);   //send on update
   getNodeStatus(Websocket);    //send on update
   getGraphButtons();
   
   sendConfig(Websocket); 
  
  
 });
 
 Websocket.on('ReConnect',function(){
  getAlarmStatus(Websocket,0);   //send on update
  getLatestAlarmStatus();
  getLatestVirtualStatus();
  getGraphButtons();
 });
  
  Websocket.on('disconnect',function(Websocket){
     
     
     
     myconsole.log('Server: Client Disconnected');
     
      if(this.server.sockets.sockets.length ==0)
     {
                         
         myconsole.log('All clients disconnected');
        
     }
  });
  
  Websocket.on('updateconfig',function(config_receive){
     // myconsole.log(config_receive);
     writeXML.json2xml(config_receive,'xml',function(xml){
         getconfig.config(function(){
          var configure3 = getconfig.data;
           // myconsole.log("2  " + configure3.xml.server[0].dnsupdate[0]);
             configure2 = configure3.xml; 
            //myconsole.log(configure2.server[0].dnsupdate[0]);
           io.emit("config",configure2); 
         });
       
         
     });
     
      
  });
  
  Websocket.on('getusers',function(){
      
      sendusers();
      
  });
  
  Websocket.on('saveNode',function(data){
    
     saveNode(data);
   
   
   
  });
  
  
  
  Websocket.on('getrules',function(){
      
      sendrules();
      
  });
  
  Websocket.on('getgraphs',function(type,itemId){
      
      sendgraphs(type,itemId);
      
  });
  
  Websocket.on('getItems',function(callback){
        myconsole.log('items requested');
      senditems();
      callback();
  });
  
  Websocket.on('delete_user',function(userId,username){
      //myconsole.log(userId);
      db.deletedata('users',{whereClause:'id = "' + userId + '"'},function(){
          
          myconsole.log('User Deleted');
          db.deletedata('user_logins',{whereClause:'Username = "' + username + '"'},function(){
          
          myconsole.log('User Token Deleted');
          io.emit("user_deleted");
          sendusers();
        });
          
      });
      
      
      
  });
  Websocket.on('delete_user_token',function(username){
      //myconsole.log(userId);
      
          db.deletedata('user_logins',{whereClause:'Username = "' + username + '"'},function(){
          
          myconsole.log('User Token Deleted');
          io.emit("user_token_deleted");
        });
          
     
  });
  
  Websocket.on('deleteRule',function(rule){
      //myconsole.log(userId);
      
         deleteRule(rule);
          
     
  });
  
  
  Websocket.on('getEvents',function(data){
    
    
    
    getEvents(data['numEvents']);
    
    
    
});

 Websocket.on('getImportantEvents',function(data){
    
    
   // myconsole.log(data);
    
    getImportantEvents(data['numEvents']);
    
    
    
});

 Websocket.on('getLastAlarm',function(data){
    
    
   // myconsole.log(data);
    
    getLastAlarm();
    
    
    
});

 Websocket.on('armDisarmAlarm',function(type){
    
   myconsole.log(type + " requested") ;
    ipc.of.AlarmModule.emit('armDisarmAlarm',
     {
      "type":type
     
      
     });
   
   
    
    
});

  
 Websocket.on('bypassZone',function(zones,callback){
    
    var cancelBypass = [];
    cancelBypass.length = 0;
    ipc.of.AlarmModule.emit('bypassZones',
                     {
                      "zones":zones
                     
                      
                     },function(err2,ack,zones){
         //myconsole.log(zones);
        
        for(var i in zones){
           // myconsole.log(zones[i][0]);
            
            
            var index = bypassedZones.indexOf(zones[i][0]);
           // myconsole.log(index);
            if(index > -1){
                
                cancelBypass.push(bypassedZones[index]);
                bypassedZones.splice(index,1);   
            }else
            {
                
                bypassedZones.push(zones[i][0]);
            }
            
        }
        myconsole.log("Bypassed zones are " + bypassedZones);
       callback(err2,ack,bypassedZones,cancelBypass);
         
         
     });
    }); 
    
    
 Websocket.on('clearBypassZone',function(){
    
       clearBypass();
        
   
    }); 
    
    
    
    
    
 Websocket.on('panic',function(){
    
    panic();
   
     
    });    
    
 Websocket.on('refreshIP',function(){
     updateIP2();
        
   
    }); 
    
    
    
    
    Websocket.on('getWeather',function(){
        getWeather();
        
   
    });
    
    Websocket.on('getPower',function(){
         //  myconsole.log('test1'); 
        getPower();
        
   
    });


    Websocket.on('test',function(){
       // test();
        
   
    });
    
    Websocket.on("getNodesStatus",function(node){
       // myconsole.log("test");
        
        getNodeStatus();
    });
    
    Websocket.on('deviceSwitch',function(Id,timeOn){
    //  myconsole.log("deviceSwitch1");
      try{
        db.getdata('Items',{Select: 'Item_Type,Item_Current_Value,Item_Toggle_Delay,Node_Id,Node_Port',whereClause:'Id = ' + Id.toString()},function(err2,data_receive){
      //	 myconsole.log("deviceSwitch: " + data_receive);
      	  if(data_receive){
      	      
      	   if(data_receive[0].Item_Current_Value == 1 )
      	   {
          	     if(data_receive[0].Item_Type == Virtual_Item_Type ||  data_receive[0].Item_Type == Virtual_Alarm_Item_Type)
          	    {
          	       virtualDeviceStatusChange(Id,0);
          	    }else
          	    {
                // mySensorsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,0,0,data_receive[0].Item_Toggle_Delay);
                
                
                ipc.of.mySensParse.emit('deviceSwitch',
                     {
                      "NodeID":data_receive[0].Node_Id,
                      "NodePort":data_receive[0].Node_Port,
                      "State":0,
                      "RuleReq":0,
                      "NodeTimeOn":data_receive[0].Item_Toggle_Delay
                      
                     }
                    );
                
                
                
                
                
                // MQTTsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,0,0,data_receive[0].Item_Toggle_Delay);
                	myconsole.log("mysensMQTT5 " + data_receive[0].Node_Id + " " + data_receive[0].Node_Port + " " + 0 + " " + 0);
                 ipc.of.MQTTParse.emit('deviceSwitch',
                     {
                      "NodeID":data_receive[0].Node_Id,
                      "NodePort":data_receive[0].Node_Port,
                      "State":0,
                      "RuleReq":0,
                      "NodeTimeOn":data_receive[0].Item_Toggle_Delay
                      
                     }
                    );
                 
                 
                 myconsole.log('deviceSwitch2 :   ' + data_receive[0].Node_Port);
          	    }
            }else
            {    if(data_receive[0].Item_Type == Virtual_Item_Type || data_receive[0].Item_Type == Virtual_Alarm_Item_Type)
      	        {
      	            virtualDeviceStatusChange(Id,1);
      	        }else
      	        {
                  //  mySensorsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,1,0,data_receive[0].Item_Toggle_Delay);
                   // MQTTsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,1,0,data_receive[0].Item_Toggle_Delay);
                   //	myconsole.log("mysensMQTT5 " + data_receive[0].Node_Id.toString() + " " + data_receive[0].Node_Port.toString() + " " + 0 + " " + 0 + "  " + data_receive[0].Item_Toggle_Delay.toString());
                    
                    
                    ipc.of.mySensParse.emit('deviceSwitch',
                     {
                      "NodeID":data_receive[0].Node_Id,
                      "NodePort":data_receive[0].Node_Port,
                      "State":1,
                      "RuleReq":0,
                      "NodeTimeOn":data_receive[0].Item_Toggle_Delay
                      
                     }
                    );
                    
                    
                    
                    ipc.of.MQTTParse.emit('deviceSwitch',
                     {
                      "NodeID":data_receive[0].Node_Id,
                      "NodePort":data_receive[0].Node_Port,
                      "State":1,
                      "RuleReq":0,
                      "NodeTimeOn":data_receive[0].Item_Toggle_Delay
                      
                     }
                    );
                    myconsole.log('deviceSwitch3');
      	        }
            } 
      	  }
        });
      }catch(e){myconsole.dumpError(e);}
  });
  
 
  
  
  Websocket.on('saveRule',function(ruleData){
      
      var rule = "";
      var ids = [];
      var ids2 = [];
      var ruleItemsId = [];
      
      myconsole.log(ruleData);
      var j = 0;
      for(var i = 0;i<ruleData['length'];i++)
      {
          //db.getdata('Items',{Select: 'Id',whereClause:'Item_Name = "' + ruleData['dropdownMenuReq'+(i+1)] +'"'},function(err2,data_receive){
            db.getSQL( 'SELECT Id FROM Items WHERE Item_Name = "' + ruleData['dropdownMenuReq'+ (i+1)] + '" UNION SELECT Id FROM Alarm_Items WHERE Description = "' + ruleData['dropdownMenuReq'+ (i+1)] + '"'  ,function(err2,data_receive){
             if(data_receive[0]){
              
              ids[j] = data_receive[0]['Id'];   
              j++;   
              
             
          
        
         if(j==ruleData['length']) {
              
               var condition = '';
               var selectedItemRules = [];
               var nonNull = [];
               var isNull = [];
               
              var h = 0;
              var newWhereClause = "";
              for(var g = 0 ;g<j;g++){
                 
                 
                 
                 
                 
                 
                 if(ruleData['equalsValueReq'+(g+1)])  //also add secondary rule value in where
                 {
                    newWhereClause = 'Item_Id = "' + ids[g] +'" AND Equals = "'+ ruleData['equalsValueReq'+(g+1)] +'" AND Secondary_Item = "'+ ruleData['secondaryRuleCheck'+(g+1)] +'"';
                    
                     
                 }else if(ruleData['greaterValueReq'+(g+1)]){
                    
                    newWhereClause = 'Item_Id = "' + ids[g] +'" AND Greater_Than = "'+ ruleData['greaterValueReq'+(g+1)] +'" AND Secondary_Item = "'+ ruleData['secondaryRuleCheck'+(g+1)] +'"';
                     
                 }else if(ruleData['lessValueReq'+(g+1)]){
                    
                    newWhereClause = 'Item_Id = "' + ids[g] +'" AND Less_Than = "'+ ruleData['lessValueReq'+(g+1)] +'" AND Secondary_Item = "'+ ruleData['secondaryRuleCheck'+(g+1)] +'"';
                     
                 }else if(ruleData['notEqualValueReq'+(g+1)]){
                    
                     newWhereClause = 'Item_Id = "' + ids[g] +'" AND Not_Equal = "'+ ruleData['notEqualValueReq'+(g+1)] +'" AND Secondary_Item = "'+ ruleData['secondaryRuleCheck'+(g+1)] +'"';
                     
                 }else{}
             
                 
                  db.getdata('Rule_Items',{Select: 'Second_Id,Rule_Id',whereClause:newWhereClause},function(err2,data_receive){
                        //myconsole.log("Returned: " + data_receive[0]);
                        
                         if(data_receive[0]){
                            
                          
                          ids2[h] = data_receive[0]['Second_Id'];
                          selectedItemRules[h] = data_receive[0]['Rule_Id'];
                          h++; 
                        
                         }else if(err2)
                         {
                             myconsole.log(err2);
                         }else{
                             ids2[h] = null;
                             selectedItemRules[h] = null;
                             h++; 
                         }
                    
              
              
                         if(h == j){
                            
                           
                          db.getdata('Rule_Items',{Select: 'Second_Id',whereClause:'Id LIKE "%" ORDER BY Id DESC LIMIT 1'},function(err2,data_receive){
                
                             if(data_receive[0]){
                                 
                                var n = 0;
                                var b = 0;
                                 for(var k =0 ;k<j;k++){
                                     
                                     
                                     if(!ids2[k]){
                                         
                                       ids2[k]  = data_receive[0].Second_Id + n + 1;  
                                       isNull[n] = k;
                                       n++;
                                     }else{
                                         nonNull[b] = k;
                                         b++;
                                     }
                                      
                                      
                                     if(k >0){
                                         
                                          condition += ';';
                                          if(ruleData['operator'+ (k+1)] == 'AND'){
                                           condition += '*' ;
                                          }else 
                                          if(ruleData['operator'+ (k+1)] == 'OR'){
                                           condition += '+' ;
                                          }
                                          
                                          condition += ';';
                                      }
                                      
                                      condition += ids2[k];
                          
                                 }
                                     
                                   
                                         
                                    // db.getdata('Items',{Select: 'Id',whereClause:'Item_Name = "' + ruleData['dropdownMenuAction1'] +'"'},function(err2,data_receive){
                                       db.getSQL('SELECT Id FROM Items WHERE Item_Name = "' + ruleData['dropdownMenuAction1'] + '" UNION SELECT Id FROM Alarm_Items WHERE Description = "' + ruleData['dropdownMenuAction1'] + '"',function(err2,data_receive){    
                                         if(data_receive[0]){
                                            
                                        var   action =  data_receive[0]['Id'] + ';=;' + ruleData['ActionValue1'] ;  
                                         var  onTime = ruleData['ActionOnValue1'] ;
                                          myconsole.log(action);
                                          
                                          
                                          
                                          db.insert('Rules', {Conditions:condition, Result: action,RuleOnTime:onTime, Comments:ruleData['description']  });
                                          
                                          
                                          db.getdata('Rules',{Select: 'Id',whereClause:'Id LIKE "%" ORDER BY Id DESC LIMIT 1'},function(err2,data_receive2){
                                
                                             if(data_receive2[0]){
                                                 
                                             
                                              var ruleId = data_receive2[0].Id;
                                              
                                            
                                            
                                             
                                             for(var m = 0;m<nonNull.length;m++)
                                              {
                                                var   newRules = selectedItemRules[nonNull[m]] + ';' + ruleId;
                                                  
                                                var    data = {Set:'Rule_Id',Current_State:newRules,Where:"Second_Id",Name:ids2[nonNull[m]]};
                                                    db.update("Rule_Items",data,function(err2,data_receive){
                                                          
                                                          
                                                        
                                                     if(data_receive){
                                                         myconsole.log("success");
                                                         
                                                     }else
                                                     {
                                                         
                                                     
                                                     }
                                                     
                                                    });
                                              }
                                             
                                             
                                             
                                              for(var n = 0;m<isNull.length;m++)
                                              {
                                                  
                                                 
                                                db.insert('Rule_Items', {Second_Id:ids2[isNull[n]],Rule_Id:ruleId, Item_Id: ids[isNull[n]],Equals: ruleData['equalsValueReq'+ (isNull[n]+1)]?ruleData['equalsValueReq'+ (isNull[n]+1)]:null  , Greater_Than: ruleData['greaterValueReq'+ (isNull[n]+1)]?ruleData['greaterValueReq'+ (isNull[n]+1)]:null ,Less_Than: ruleData['lessValueReq'+ (isNull[n]+1)]?ruleData['lessValueReq'+ (isNull[n]+1)]:null ,Not_Equal:  ruleData['notEqualValueReq'+ (isNull[n]+1)]?ruleData['notEqualValueReq'+ (isNull[n]+1)]:null , Secondary_Item:  ruleData['secondaryRuleCheck'+ (isNull[n]+1)]  ,Status: 0, Comments: ''  });
                                              
                                                if(n == b){
                                                  myconsole.log('Rules Saved');
                                                 
                                                 }
                                              }
                                              
                                                  
                                                 
                                                 }else
                                                 {
                                                     myconsole.log(err2);
                                                 }
                                             
                                          });
                                          
                                          
                                          
                                         
                                         }else
                                         {
                                             myconsole.log(err2);
                                         }
                                     
                                     
                                         
                                      });
                                         
                                         
                                     
                                  
                                  //myconsole.log('Rules Saved');
                             
                             }else
                             {
                                 myconsole.log(err2);
                             }
                             
                          });
                          
                          
                      
                    
                      
                      
                      
                         }
                  });
                 
              }
              
             
            }
            
             }else
             {
                 myconsole.log(err2);
             }
               
               
          });  //end firs db call
        
      }
  });
    
});     /////////////////////////////////////////////////////////////////////////////////////////////////////////end of webpage socket connection


 ipc.connectTo(
    'RuleMonitor',
    function(){
     serveripc.server.on(
            'speak',
            function(data){
             
              myconsole.log("rules: speak requested");
              speak(data['msg']);
             
             
            });
            
            
       serveripc.server.on(
            'deviceUpdate',
            function(data){
             
             
               db.getdata('Items',{Select: 'Item_Type,Item_Current_Value',whereClause:'Id = "' + data['Id'] + '"'},function(err2,data_receive){
                
                if(err2){
                 
                 myconsole.log(err2);
                }else{
             	  // myconsole.log(data_receive);
             	  if(data_receive){
             	      
             	   if(data_receive[0].Item_Current_Value == 1 )
             	   {
                 	     if(data_receive[0].Item_Type == Virtual_Item_Type ||  data_receive[0].Item_Type == Virtual_Alarm_Item_Type || data_receive[0].Item_Type == Phone_Item_Type)
                 	    { // myconsole.log("test virtual");
                 	       virtualDeviceStatusChangebyRule(data['Id'],1);
                 	    }//else
                 	  //  {
                      //  mySensorsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,0);
                 	   // }
                   }else
                   {    if(data_receive[0].Item_Type == Virtual_Item_Type || data_receive[0].Item_Type == Virtual_Alarm_Item_Type || data_receive[0].Item_Type == Phone_Item_Type)
             	        {
             	          // myconsole.log("test virtual");
             	            virtualDeviceStatusChangebyRule(data['Id'],0);
             	        }//else
             	      //  {
                       //    mySensorsocket.emit('deviceSwitch',data_receive[0].Node_Id,data_receive[0].Node_Port,1);
             	       // }
                   } 
             	  }
                }
               });
             
             
            });     
            
            
            
    });



        
    
        






 ipc.connectTo(
    'AlarmModule',
    function(){
      ipc.of.AlarmModule.on(
            'connect',
            function(){
                
                myconsole.log('CleoServer connected to AlarmModule with IPC ##');
                           
             
                
                ipc.of.AlarmModule.emit('register',{type:'Alarm',client:'Server'});

                 
               
            }
        );
        
     ipc.of.AlarmModule.on(
            'power',
            function(data){
                
              myconsole.log("Server: Power:Sending Email");
              switch(data['Code']){
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
                
            }
        );   // end power command
        
        ipc.of.AlarmModule.on(
            'trouble',
            function(data){
                
              if(data['Code'] == '8411'){
                io.emit("ac",true);
               // sendemail("Trouble Event Restored");
               
                log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '13' ,Current_State: 0 });
             }else if(data['Code'] == '8401'){
                 io.emit("ac",false);
                 sendemail("Trouble Event");
                   pushOver.push('AC Power Off');
                 myconsole.log("Server: Trouble Condition: Sending Email");
                 log.ownDb('Alarm_Items',{Set: 'Current_State',Where: 'Type',Name: '13' ,Current_State: 1 });
             }
                
            }
        );   // end trouble command
        
        
        ipc.of.AlarmModule.on(
            'AlarmEvent',
            function(data){
        
        
          // myconsole.log("Alarm event")
           if(data['Partition'])
           {   // myconsole.log("this1 " + data['Current_State']);
           
               getState(data['Current_State'],function(realState){
                   
                   
               io.emit('AlarmPartitionEvent', {Partition: '1', Current_State: realState});   
                   
               });
               
           }else
           {
              // myconsole.log(data);
                io.emit('AlarmZoneEvent', data);
            
           }
     
    });
    
       ipc.of.AlarmModule.on(
          'speak',
          function(data){
  
            myconsole.log("rules: speak requested");
            speak(data['msg']);
            
           
         });//speak
         
         ipc.of.AlarmModule.on(
          'keypadLedState',
          function(data){
         
          getModeStatus(function(night,connect,err2){
            
             if(err2){
              myconsole.log("Error occured during night mode status retrieval");                          
            }else{
                if(data['Armed']){
                    lastArmTime = Date();
                }else{
                   lastArmTime = null; 
                }
                
               if(data['Ready'] && !data['Bypass']){
                 //  clearBypass();
                } 
                // myconsole.log(data.Bypass + " " + data.Memory + " " + data.Armed + " " + data.Ready);
             io.emit("keypadLedState",{Bypass:data['Bypass'], Memory:data['Memory'],Armed:data['Armed'],Ready:data['Ready'],Night:night,Connected:connect});
            }
          });
        });   //keypadLEDstate
        
        
        
        ipc.of.AlarmModule.on(
          'AlarmConnectionState',
         function(data){
       
         
            io.emit("AlarmConnectionState",{Connected:data['Connected'],Status:data['Status']});
            
           
         });  //AlarmConnectionState
          
          
          
        ipc.of.AlarmModule.on(
          'alarmTrigger',
         function(data){
         
            myconsole.log('Server Module: An alarm was triggered');
            //myconsole.log(data);
             db.getdata('Alarm_Items',{Select: 'Description',whereClause:'Name = ' + '"' + 'Zone_' + data['zone'] + '"'},function(err2,data_receive){
                      // myconsole.log('test1'); 
                   if(data_receive[0]){
                    myconsole.log("Sending Email for Alarm Trigger, zone " + data_receive[0]['Description']);
                     sendemail("An alarm has been triggered by zone " + data_receive[0]['Description']);
                       pushOver.push("An alarm has been triggered by zone " + data_receive[0]['Description']);
                     db.insert('Alarm_Triggers', {Zone: data_receive[0]['Description'], Time: Date().toString()  });
                    io.emit("alarmTrigger",{Event:data_receive[0]['Description'],Time:data['time']});
                    
                   
                    
                }else{
                    if (err2) {
                        // error handling code goes here
                        myconsole.log("ERROR (Alarm Trigger) : ",err2);            
                    }
                
                    myconsole.log("No zone retrieved for Alarm Trigger");
                    io.emit("alarmTrigger",{Event:"unknown",Time:data['time']});
                    db.insert('Alarm_Triggers', {Zone: "unknown", Time: Date().toString()  });
                    
                    sendemail("An alarm has been triggered by unknown zone " + data['zone']);
                    pushOver.push("An alarm has been triggered by unknown zone " + data['zone']);
                }
		
       
            });
            
        });
        
        
          ipc.of.AlarmModule.on(
          'clearBypassZone',
          function(){
         
              clearBypass();
          });
          
        
    
 });   //alarmmodule IPC
 
  ipc.connectTo(
    'EventModule',
    function(){
        ipc.of.EventModule.on(
            'connect',
            function(){
                
                myconsole.log('CleoServer connected to EventModule with IPC ##');
                           
                io.emit('ConnectionStatus',{item: 'Event_Handler',status:'connected'});
                
                ipc.of.EventModule.emit('register',{type:'Alarm',client:'Server'});
                ipc.of.EventModule.emit('register',{type:'Motion',client:'Server'}); 
                 
                 
               
            }
        );
        
        
        
        
        
        //myconsole.log("testing");
    ipc.of.EventModule.on('Event',function(data){
         //myconsole.log(data);
        if(data['result']['Event'].indexOf('Partition') > -1) 
        {
    
           var eventdata = JSON.parse(data['result']['Event']);
            
             constructEvent(eventdata,data['result']['Time'],data['result']['Type'],function(eventstring,alarm,time,type){
                if(eventstring)
                {
                    var datatosend = {Type: type,Event:eventstring,Time:time};
               
                    io.emit('AlarmPartitionEventHandler', datatosend);
                    
        
                }
            });
        }
        else if(data['result']['Event'].indexOf('Important') > -1)
        {
            var eventdata = JSON.parse(data['result']['Event']);
            
            constructEvent(eventdata,data['result']['Time'],data['result']['Type'],function(eventstring,alarm,time,type){
                if(eventstring)
                {
                    var datatosend = {Type: type,Event:eventstring,Time:time};
           
                    io.emit('ImportantEventHandler', datatosend);
                    
                }
            });
        }
        else if(data['result']['Event'].indexOf('Zone') > -1)
        {
            var eventdata = JSON.parse(data['result']['Event']);
           // myconsole.log(eventdata);
            constructEvent(eventdata,data['result']['Time'],data['result']['Type'],function(eventstring,alarm,time,type){
                if(eventstring)
                {
                    var datatosend = {Type: type,Event:eventstring,Time:time};
          
                    io.emit('AlarmZoneEventHandler', datatosend);
                    
                    
                }
            });
        }
    });
    
    
    
    ipc.of.EventModule.on('connectstatus', function() { 
    
        io.emit('ConnectionStatus',{item: 'Event_Handler',status:'Connected'});
    
    
    });

    ipc.of.EventModule.on('disconnect', function() { 
     io.emit('ConnectionStatus',{item: 'Event_Handler',status:'Disconnected'});
    
    });
        
 });   //ipc event module
 
 
 
  
 ipc.connectTo(
    'mySensParse',
    function(){
        ipc.of.mySensParse.on(
            'connect',
            function(){
                
                myconsole.log('CleoServer connected to mySensParse with IPC ##');
                
            }
        );
        ipc.of.mySensParse.on(
            'disconnect',
            function(){
               
            }
        );
        
        ipc.of.mySensParse.on(
            'deviceConnected',
            function(){
               
                myconsole.log('vvvvvvvvvvvvvvvvvvvvv   ');
               
            }
        );
        
        
        
         ipc.of.mySensParse.on('deviceStatusChange',function(nodeData){    //NodeID,NodePort,State
           //  myconsole.log("Device Status Change");
            // myconsole.log(NodePort);
           // var evaluate = require('../JSModules/Rule_Items_Evaluate');
            if(nodeData['State'] > 0){nodeData['State'] = 1;}
            
              db.getdata('Items',{Select: 'Id,Item_Enabled_Value',whereClause:'Node_Id = ' + nodeData['NodeID'].toString() + ' AND Node_Port = ' + nodeData['NodePort'].toString()},function(err2,data_receive){
                 // myconsole.log(data_receive);
                  if(data_receive[0]){
                             //myconsole.log(data_receive);
                           var  ID = data_receive[0].Id;
                         var     enabledValue = data_receive[0].Item_Enabled_Value;
                            var data = {Set:'Item_Current_Value',Current_State:nodeData['State'],Where:"Id",Name:ID};
                             db.update("Items",data,function(err2,data_receive){
                                   
                                   
                                 
                                  if(data_receive){
                                    // myconsole.log(ID + " " + State);
                                      io.emit('DeviceEvent', {Id:ID,Current_State:nodeData['State'],Item_Enabled_Value:enabledValue});
                                  
                                      rules.updateRuleStates(ID, nodeData['State']);
                                     
                                     /* evaluate.evaluateChange(ID,State,function(node,port,state,virtual,cancelTime,func){
                                          
                                             eval(func);             
                                          if(node && port && state){
                                           mySensorsocket.emit('deviceSwitch',node,port,state,1);
                                          }
                                          
                                          if(cancelTime){
                                                      
                                              mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                                          }
                                          
                                           if(virtual == 1){
                                              virtualDeviceStatusChange(node,state);
                                            
                                              
                                          }
                                      //myconsole.log(data_receive[0]);
                                      });*/
                                      
                                      
                                  }else
                                  {
                                     myconsole.log(err2); 
                                      
                                  }
                                 
                             }); 
                 }else 
                 if(err2)
                 {
                     myconsole.log(err2);
                 }
                  
              });
             
            
             
             
         });
         
         
         
         ipc.of.mySensParse.on('sensorStatusChange',function(nodeData){      //NodeID,NodePort,State,Type
             //myconsole.log("Device Status Change");
            // myconsole.log(NodePort);
            //var evaluate = require('../JSModules/Rule_Items_Evaluate');
            
            
              db.getdata('Items',{Select: 'Id',whereClause:'Node_Id = ' + nodeData['NodeID'].toString() + ' AND Node_Port = ' + nodeData['NodePort'].toString()},function(err2,data_receive){
                 // myconsole.log(data_receive);
                  if(data_receive[0]){
                             //myconsole.log(data_receive);
                          var   ID = data_receive[0].Id;
                             
                             var data = {Set:'Item_Current_Value',Current_State:nodeData['State'],Where:"Id",Name:ID};
                             db.update("Items",data,function(err2,data_receive){
                                   
                                   //	myconsole.log("Server: Sensor updated");
                                 
                                  if(data_receive){
                                     // myconsole.log(ID + " " + State);
                                      io.emit('SensorEvent', {Id:ID,Current_State:nodeData['State']});
                                      log.logger(nodeData['Type'], nodeData['State']);
                                      rules.updateRuleStates(ID, nodeData['State']);
                                      
                                     /* evaluate.evaluateChange(ID,State,function(node,port,state,virtual,cancelTime,func){
                                          
                                             eval(func);             
                                          if(node && port && state){
                                           mySensorsocket.emit('deviceSwitch',node,port,state,1);
                                          }
                                          
                                          if(cancelTime){
                                                      
                                              mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                                          }
                                          
                                           if(virtual == 1){
                                              virtualDeviceStatusChange(node,state);
                                           
                                              
                                          }
                                      //myconsole.log(data_receive[0]);
                                      });*/
                                      
                                      
                                  }else
                                  {
                                     myconsole.log(err2); 
                                      
                                  }
                                 
                             }); 
                 }else 
                 if(err2)
                 {
                     myconsole.log(err2);
                 }
                  
              });
             
            
             
             
         });
         
         
         
         
         
         //MQTTsocket.on('newNode',function(newNodeId,newNodeIP,oldId){
          
         //  myconsole.log(newNodeIP);
         //  io.emit('newNode',newNodeId,newNodeIP,oldId);
          
          
          
          
         //});
         
         
         
         
         ipc.of.mySensParse.on('gatewayConnected',function(nodeData){
             gatewayStatus = nodeData['gatewayState'];
             sendGatewayStatus();
             
             
         });
         
         
         ipc.of.mySensParse.on('nodeAlive',function(nodeData){
           myconsole.log("3: Setting " + nodeData['NodeID'] + ' to ' + nodeData['Status']);
             var timenow = new Date().getTime();
             var  data = {Set:'Last_Seen',Current_State:timenow,Where:"Node_Port",Name:nodeData['NodeID']};
             db.update("Nodes",data,function(err2,data_receive){
                       
                       
                     
                      if(data_receive){
                         // myconsole.log(ID + " " + State);
                          myconsole.log("Node state updated");
                          
                          
                      }else
                      {
                         myconsole.log(err2); 
                          
                      }
                     
             }); 
             updateNodeStatus(nodeData['NodeID']);
             
             
         });
        
    });   //end IPC mysensor
 
 
}



function saveNode(data){
 
  
 var nodedata = JSON.parse(data);
 
 //myconsole.log("nodedata: " + nodedata['Item_Name0']);
 
 
 db.insert('Nodes',{Node_Port:nodedata['Node_Id'],Name:nodedata['Node_Name']});
 
 for(var i = 0;i<8;i++){
  
  if(nodedata['Item_Name'+i] && nodedata['Item_Port_Type'+i] > 0)
  {
  //myconsole.log(nodedata['Item_Port_Type'+i]);
   db.insert('Items',{Node_Port:nodedata['Node_Port'+i],Item_Name:nodedata['Item_Name'+i],Item_Port_Type:nodedata['Item_Port_Type'+i],Node_Id:nodedata['Node_Id'],Item_Sort_Position:nodedata['Node_Id'],Node_Child:nodedata['Node_Child'+i],Item_Default_Value:nodedata['Item_Default'+i],Item_Enabled_Value:nodedata['Item_Enable'+i],Item_Is_Toggle:nodedata['Item_Toggle'+i],Item_Toggle_Delay:nodedata['Item_Toggle_Val'+i]});
  }
  
 }
 
 //MQTTsocket.emit('newNode',nodedata);
 ipc.of.MQTTParse.emit('newNode',nodedata);

 //'"Item_Name'+i+'":"'+ports[i,0]+'","Item_Port_Type'+i+'":'+ports[i,1]+',"Item_Toggle'+i+'":'+ports[i,2]+',"Item_Toggle_Val'+i+'":"'+ports[i,3]+'","Item_Default'+i+'":'+ports[i,4]+',"Item_Enable'+i+'":'+ports[i,5]+',"Node_Id'+i+'":'+id+',"Node_Name'+i+'":"'+name+'","Node_Port'+i+'":'+i
 
 
}

function getLatestVirtualStatus(){
 myconsole.log('Get latest zone');
  db.getdata('Items',{Select: 'Id,Item_Enabled_Value,Item_Current_Value',whereClause:'Id > 0 '},function(err2,data_receive){
 
    if(data_receive[0]){
     for(var i = 0;i<data_receive.length;i++){
     var  ID = data_receive[i].Id;
     var  enabledValue = data_receive[i].Item_Enabled_Value;
     var  State = data_receive[i].Item_Current_Value;
     
      io.emit('DeviceEvent', {Id:ID,Current_State:State,Item_Enabled_Value:enabledValue});
     }
    }
    else{
      myconsole.log(err2); 
    }
  });
}



function getLatestAlarmStatus(){
 myconsole.log('Get latest alarm');
  db.getdata('Alarm_Items',{Select: 'Name,Current_State',whereClause:'Id < 28 '},function(err2,data_receive){
 
    if(data_receive[0]){
     for(var i = 0;i<data_receive.length;i++){
      
     var  ID = data_receive[i].Name.substring(5, 8);
   //  myconsole.log(data_receive[i].Name.substring(5, 8)  +  "   "  + data_receive[i].Name);
     
     
     var  State = data_receive[i].Current_State;
     
      io.emit('AlarmZoneEvent', {Zone:ID,Current_State:State});
     }
    }
    else{
      myconsole.log(err2); 
    }
  });
}




function virtualDeviceStatusChange(Id,State){
    
  //  var evaluate = require('../JSModules/Rule_Items_Evaluate');
   if(State > 0){State = 1;}
   
     db.getdata('Items',{Select: 'Id,Item_Enabled_Value',whereClause:'Id = ' + Id},function(err2,data_receive){
        // myconsole.log(data_receive);
         if(data_receive[0]){
                    //myconsole.log(data_receive);
                    var ID = data_receive[0].Id;
                   var  enabledValue = data_receive[0].Item_Enabled_Value;
                   var   data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
                    db.update("Items",data,function(err2,data_receive){
                          
                          
                        
                         if(data_receive){
                            // myconsole.log(ID + " " + State);
                             io.emit('DeviceEvent', {Id:ID,Current_State:State,Item_Enabled_Value:enabledValue});
                             
                              rules.updateRuleStates(ID, State);
                          /*  evaluate.evaluateChange(ID,State,function(node,port,state,virtual,cancelTime,func){
                                 
                                    eval(func);             
                                 if(node && port && state){
                                  mySensorsocket.emit('deviceSwitch',node,port,state,1);
                                 }
                                 
                                 if(cancelTime){
                                             
                                     mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                                 }
                                 
                                 if(virtual == 1){
                                     virtualDeviceStatusChange(node,state);
                                   
                                     
                                 }
                             //myconsole.log(data_receive[0]);
                             });*/
                             
                             
                         }else
                         {
                            myconsole.log(err2); 
                             
                         }
                        
                    }); 
        }else 
        if(err2)
        {
            myconsole.log(err2);
        }
         
     });
    
}


function virtualDeviceStatusChangebyRule(Id,State){
    
  //  var evaluate = require('../JSModules/Rule_Items_Evaluate');
   if(State > 0){State = 1;}
   
     db.getdata('Items',{Select: 'Id,Item_Enabled_Value',whereClause:'Id = ' + Id},function(err2,data_receive){
        // myconsole.log(data_receive);
         if(data_receive[0]){
                    //myconsole.log(data_receive);
                   var  ID = data_receive[0].Id;
                   var  enabledValue = data_receive[0].Item_Enabled_Value;
                 //    data = {Set:'Item_Current_Value',Current_State:State,Where:"Id",Name:ID};
                   // db.update("Items",data,function(err2,data_receive){
                          
                          
                        
                       //  if(data_receive){
                            // myconsole.log(ID + " " + State);
                             io.emit('DeviceEvent', {Id:ID,Current_State:State,Item_Enabled_Value:enabledValue});
                             
                            //  rules.updateRuleStates(ID, State);
                          /*  evaluate.evaluateChange(ID,State,function(node,port,state,virtual,cancelTime,func){
                                 
                                    eval(func);             
                                 if(node && port && state){
                                  mySensorsocket.emit('deviceSwitch',node,port,state,1);
                                 }
                                 
                                 if(cancelTime){
                                             
                                     mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                                 }
                                 
                                 if(virtual == 1){
                                     virtualDeviceStatusChange(node,state);
                                   
                                     
                                 }
                             //myconsole.log(data_receive[0]);
                             });*/
                             
                             
                     //    }else
                       //  {
                       //     myconsole.log(err2); 
                             
                      //   }
                        
                 //   }); 
      //  }else 
      //  if(err2)
      //  {
      //      myconsole.log(err2);
        }
         
     });
    
}


  
function sendusers(){
    myconsole.log("Getting Users...");
      db.getdata('users',{Select: 'id,username',whereClause:'id LIKE "%"'},function(err2,data_receive){
                      // myconsole.log('test1'); 
               if(data_receive[0]){
               // myconsole.log(data_receive);
                io.emit("sendUsers",data_receive);
                
            }else{
                if (err2) {
                    // error handling code goes here
                    myconsole.log("ERROR (GetUsers) : ",err2);            
                }
            
                
            }
	
   
        });
}  
  
  
  
function sendrules(){
    myconsole.log("Getting Rules...");
      db.getdata('Rules',{Select: 'Id,Conditions,Result,Comments',whereClause:'Id LIKE "%"'},function(err2,data_receive){
                      // myconsole.log('test1'); 
           if(data_receive[0]){
           // myconsole.log(data_receive);
            io.emit("sendRules",data_receive);
            
        }else{
            if (err2) {
                // error handling code goes here
                myconsole.log("ERROR (GetRules) : ",err2);            
            }
        
            
        }


    });
}  


function sendgraphs(Type,itemId){
    myconsole.log("Getting Graphs..."); 
     
      db.getBackData('Event_Log',{Select: 'Id,Type,Event,Time',whereClause:'Type LIKE "'+Type+'" ORDER BY Id DESC LIMIT 2500'},function(err2,data_receive){
                      // myconsole.log(data_receive); 
           if(data_receive[0]){
            
           // myconsole.log(data_receive[data_receive.length-1]['TimeStamp']);
            
            io.emit("sendGraphs",data_receive,itemId);
            
        }else{
            if (err2) {
                // error handling code goes here
                myconsole.log("ERROR (GetRules) : ",err2);            
            }
        
            
        }


    });
} 


function deleteRule(rule){
    myconsole.log("Deleting Rules...");
      db.getdata('Rules',{Select: 'Conditions',whereClause:'Id = ' + rule},function(err2,result){
                      // myconsole.log('test1'); 
           if(result){
                var res = result[0].Conditions.split(';');
           
          
                   var ids = "";
                  
                   for(var i = 0; i < res.length ; i++){
                       if(!isNaN(res[i])){
                                 
                          if(ids.indexOf(res[i]) == -1){
                              if(ids.length > 0 ){
                               ids += ",";
                              }
                            ids += res[i] ;          
                          
                              
                          }
                        }
                      
                   }
                  
                
                     //delete rule_item
                      db.deletedata('Rule_Items',{whereClause:'Rule_Id = ' + rule },function(err2, result){
                        if(err2){
                            myconsole.log(err2);
                        }else
                        {
                        myconsole.log('Rule_Item Deleted: '  );
                      
                        }
                     // io.emit("user_token_deleted");
                    });
                     
                 
                 
                 
                
                 
               
            
                db.deletedata('Rules',{whereClause:'Id = ' + rule  },function(err2, result){
                    if(err2){
                        myconsole.log(err2);
                    }else
                    {
                        myconsole.log('Rule Deleted');
                        io.emit("ruleDeleted");
                    }
                  
                });
                
                 //myconsole.log(ids);
                    var where = "Second_Id IN (" + ids + ")  ORDER BY FIELD (Second_Id," + ids + ")";
                   
                  var  data = {'Select':'Second_Id,Rule_Id','whereClause':where };
            
                    db.getdata('Rule_Items',data,function(err2,result2){
                       
                       if(err2){
                           
                           myconsole.log(err2);
                           
                       }else if(result2){
                           myconsole.log(result2);
                           //myconsole.log(result2);
                           var cond = "";
                           var newRuleId = "";
                           
                          // var j = 0;
                           for(var i = 0; i < res.length ; i++){
                               
                            
                             
                             if(result2[i].Rule_Id.indexOf(';') != -1){
                                
                                 
                                 if(result2[i].Rule_Id.indexOf(rule) == 0)
                                 {
                                    newRuleId = result2[i].Rule_Id.substring(3);
                                     
                                 }else{
                                    newRuleId = result2[i].Rule_Id.substring(0,result2[i].Rule_Id.indexOf(rule)-1) + result2[i].Rule_Id.substring(result2[i].Rule_Id.indexOf(rule)+rule.length);
                                 }
                                 
                                
                               var   data = {Set:'Rule_Id',Current_State:newRuleId,Where:"Second_Id",Name:res[i]};
                                db.update("Rule_Items",data,function(err2,data_receive){
                                          
                                          
                                        
                                         if(data_receive){
                                            // myconsole.log(ID + " " + State);
                                             myconsole.log("Rule_Items Updated");
                                             
                                             
                                         }else
                                         {
                                            myconsole.log(err2); 
                                             
                                         }
                                        
                                }); 
                                 
                             }
                             
                           }
                           
                        
                               
                           
                       }
                       
                       
                        
                    });
            
            
        }else{
            if (err2) {
                // error handling code goes here
                myconsole.log("ERROR (GetRules) : ",err2);            
            }
        
            
        }


    });
}  



function senditems(){
    myconsole.log("Getting Items...");
      db.getdata('Items',{Select: 'Id,Item_Name',whereClause:'Id LIKE "%"'},function(err2,data_receive){
                      // myconsole.log('test1'); 
           if(data_receive[0]){
            myconsole.log(data_receive);
                db.getdata('Alarm_Items',{Select: 'Id,Description',whereClause:'Id LIKE "%"'},function(err2,data_receive2){
                          // myconsole.log('test1'); 
                   if(data_receive2[0]){
                    myconsole.log(data_receive);
                    
                        io.emit("sendItems",data_receive,data_receive2);
                   
                     }else{
                    if (err2) {
                        // error handling code goes here
                        myconsole.log("ERROR (GetItems) : ",err2);            
                    }
                    
                     }
                });
           
            
            
        }else{
            if (err2) {
                // error handling code goes here
                myconsole.log("ERROR (GetItems) : ",err2);            
            }
        
            
        }


    });
}  



function getWeather(){
     db.getdata('Items',{Select: 'Item_Current_Value',whereClause:'Item_Name = "Wind Speed" OR Item_Name = "Temperature" OR Item_Name = "Rain"'},function(err2,data_receive){
                      // myconsole.log('test1'); 
           if(data_receive[0]){
            //myconsole.log(data_receive);
            io.emit("sendWeather",data_receive[2].Item_Current_Value,data_receive[0].Item_Current_Value,data_receive[1].Item_Current_Value );
            
        }else{
            if (err2) {
                // error handling code goes here
                myconsole.log("ERROR (GetItems) : ",err2);            
            }
        
            
        }


    });
    
    
    
    
}

function getPower(){
      // myconsole.log('test1'); 
     db.getdata('Items',{Select: 'Id,Item_Current_Value',whereClause:'Item_Type = "10"'},function(err2,data_receive){
                      // myconsole.log('test1'); 
       
           if(data_receive[0]){
            //myconsole.log(data_receive);
          //  io.emit("sendWeather",data_receive[0].Item_Current_Value,data_receive[1].Item_Current_Value);
          io.emit('SensorEvent', {Id:data_receive[0].Id,Current_State:data_receive[0].Item_Current_Value});
          io.emit('SensorEvent', {Id:data_receive[1].Id,Current_State:data_receive[1].Item_Current_Value});
        //   io.emit('sendPower', data_receive[0].Item_Current_Value,data_receive[1].Item_Current_Value);
           
           
          //  rules.updateRuleStates(data_receive[0].Id, data_receive[0].Item_Current_Value);
           // rules.updateRuleStates(data_receive[1].Id, data_receive[1].Item_Current_Value);
          
          //  io.emit('SensorEvent', {Id:ID,Current_State:State2});
            
        }else{
            if (err2) {
                // error handling code goes here
                myconsole.log("ERROR (GetItems) : ",err2);            
            }
        
            
        }


    });
    
    
    
    
}



function test(){
    
    myconsole.log("testing triggers");
      pushOver.push('test');
                    
                    
}

     
        
 
    




function getState(requiredState,callback){
    //myconsole.log(requiredState);
    db.getdata('Alarm_States',{Select: 'State',whereClause:'Id = ' + requiredState},function(err2,data_receive){
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR1 : ",err2);            
                        } else {            
                        // code to execute on data retrieval
                        if(data_receive[0]){
                        
                           
                        
                          callback(data_receive[0]['State']);
                        }
                        else
                       
                          callback(requiredState);   // change back to false
                        }
                       
                   });

}


function getGraphButtons(){
 
  db.getdatajoin('Items','Item_Types',{Select: 'T1.Id,T1.Item_Name,T2.Type',join1: 'Item_Type' ,join2: 'Id',whereClause:"T1.Id LIKE '%' AND T2.hasGraph = 1 ORDER BY T1.Item_Name ASC"},function(err2,data_receive){
                      
                       
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR2 : ",err2);            
                        } else {       
                            
                           // myconsole.log(data_receive);         
                            io.emit('addGraphButtons',data_receive);
                            
                        }
                        
                        
                        
  });
 
 
}


function getAlarmStatus(sockets,newpage){  //newpage 1 if first load of page
    
    try{
     db.getdatajoin('Alarm_Items','Alarm_Item_Types',{Select: 'Name,Current_State,Description,Alarm_Event,T1.Type',join1: 'Type' ,join2: 'Id',whereClause:"T1.Id LIKE '%' AND T2.ShowOnPage = 1 ORDER BY T1.Description ASC"},function(err2,data_receive){
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR2 : ",err2);            
                        } else {       
                            
                        // code to execute on data retrieval
                        var zone = [1 , 2 , 3 , 4 , 6];
                        
                           for(var i in data_receive){
                               //myconsole.log(data_receive[i]['Type'] + " " + data_receive[i]['Name']);  
                                if(zone.indexOf(data_receive[i]['Type']) != -1 )
                                {  if(newpage == 1){
                                    var data = {Zone: data_receive[i]['Name'].substring(5),Current_State: data_receive[i]['Current_State'],Description:data_receive[i]['Description'],Alarm_Event:data_receive[i]['Alarm_Event']};
                               
                                    sockets.emit('AlarmZoneStatusEvent',data);
                                  }
                                   
                                
                                }
                                else if(data_receive[i]['Type'] == 9)
                                { //  myconsole.log("this2 " + data['Current_State']);
                                    getState(data_receive[i]['Current_State'],function(realState){
                                        var data = {Partition: data_receive[i]['Name'].substring(0,8)+'1',Current_State:realState };
                                        sockets.emit('AlarmPartitionStatusEvent',data);
                                    });
                                
                                
                                }
                                 else if(data_receive[i]['Type'] == 10)
                                {
                                     var bypass,memory,armed,ready;
                                   var flag_bypass = 8,flag_memory = 4, flag_armed = 2,flag_ready = 1;
                                  var code = data_receive[i]['Current_State'];
                                  // myconsole.log("the code " + code);       
                                          
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
                                 
                                 getModeStatus(function(night,connect,err2){
                                    if(err2){
                                        myconsole.log("Error occured during night mode status retrieval");
                                    }else{
                                       // myconsole.log(bypass + " " + memory + " " + armed + " " + ready);
                                     sockets.emit("keypadLedState",{Bypass:bypass, Memory:memory,Armed:armed,Ready:ready,Night:night,Connected:connect});
                                    }
                                  });
                                
                                }else if(data_receive[i]['Type'] == 11)
                                {
                                    
                                        sockets.emit('nightModeState',data_receive[i]['Current_State']);
                                   
                                
                                
                                }else if(data_receive[i]['Type'] == 12)
                                {
                                    sockets.emit('battery',data_receive[i]['Current_State']);
                                
                                
                                }else if(data_receive[i]['Type'] == 13)
                                {
                                   sockets.emit('ac',data_receive[i]['Current_State']);
                                
                                
                                }
                               
                           }
                             
                            
                             sockets.emit('bypassedZones',bypassedZones);
                        }
                       
                   });
                   
    }catch(e){myconsole.log(e);}
               
               return;
    
}

function sendPageTabs(sockets){
         try {
          db.getdatajoin2('Page_Tabs', 'Page_Containers', {
           Select: 't1.Description D1,t2.Description D2',
           whereClause: "t1.Id LIKE '%' ORDER BY t1.Id ASC, t2.Id",
           field1: "Containers_ToShow",
           field2: "Id"
          }, function(err2, data_receive) {
           if (err2) {
            // error handling code goes here
            myconsole.log("ERROR2 : ", err2);
           }
           else {
         
            sockets.emit('PageTabs', data_receive);
           
            //  myconsole.log(data_receive);  
            /*for(var i in data_receive){
                myconsole.log(data_receive[i]);  
                
                  
                 
                
            }*/
         
         
         
           }
         
          });
         }
         catch (e) {
          myconsole.log(e);
         }
                   
             
               
               return;
 
 
 
}
/*
function sendPageContainers(sockets){
//myconsole.log(sockets);
             db.getdatajoin2('Page_Tabs','Page_Containers',{Select: 't1.Description D1,t2.Description D2',whereClause:"t1.Id LIKE '%' ORDER BY t1.Id ASC, t2.Id",field1:"Containers_ToShow",field2:"Id"},function(err2,data_receive){
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR2 : "+err2);            
                        } else {       
                            
                         sockets.emit('PageContainers',data_receive);
                         //myconsole.log(data_receive);  
                           /*for(var i in data_receive){
                               myconsole.log(data_receive[i]);  
                               
                                 
                                
                               
                           }*/
                             
 /*                           
                             
                        }
                       
                   });
                   
             
               
               return;
 
 
 
}*/

function getDeviceStatus(sockets){
   

    db.getdatajoin2('Page_Containers','Items',{Select: 't2.Id,t2.Item_Name,t2.Item_Current_Value,t2.Item_Type,t2.Node_Id,t2.Node_Port,t2.Item_Enabled_Value,t1.Description',whereClause:"t2.Id LIKE '%' ORDER BY t2.Item_Sort_Position ASC",field1:'ItemTypes_ToShow',field2:'Item_Type'},function(err2,data_receive){

                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR2 : "+err2);            
                        } else {       
                            
                        // code to execute on data retrieval
                       //var device = [1 , 2 , 3 , 4 , 5,6,7,11,15,18,20];
                        
                           for(var i in data_receive){

                            //  myconsole.log(data_receive[i]);  
                              //  if(device.indexOf(data_receive[i]['Item_Type']) != -1 )
                                //{
                                    var data = {Id:data_receive[i]['Id'],Device: data_receive[i]['Item_Name'],Current_State: data_receive[i]['Item_Current_Value'],Node_Id:data_receive[i]['Node_Id'],Node_Port:data_receive[i]['Node_Port'],Item_Type:data_receive[i]['Item_Type'],Item_Enabled_Value:data_receive[i]['Item_Enabled_Value'],Item_Container:data_receive[i]['Description']};
                                  
                                    sockets.emit('DeviceStatusEvent',data);
                                  

                                   
                                
                                //}
                                
                                
                               
                           }
                             
                            
                             
                        }
                       
                   });
                   
             
               
               return;
               
               
    
}

function setStartupStatus(){
 
    myconsole.log("Items to unknown ");
    // data = {Set:'Item_Current_Value',Current_State:3,Where:"Id > 0"};
    try{
     
     db.getSQL('UPDATE Items SET Item_Current_Value = 3 WHERE ID > 0 AND Item_IsVirtual = 0',function(err2,data_receive){
               
               
             
              if(data_receive){
                 // myconsole.log(ID + " " + State);
                  myconsole.log("Items set to unknown ");
                  
                  
              }else
              {
                 myconsole.log(err2); 
                  
              }
             
     }); 
    }catch(e){
     myconsole.log(e);
    }
}



function getNodeStatus(sockets){
   
    db.getdata('Nodes',{Select: 'Id,Name,Last_Seen,Node_Port,Status,IPAddress,RSSI,Vcc,UpTime',whereClause:"'Id' LIKE '%' ORDER BY Node_Sort_Position ASC"},function(err2,data_receive){
    if (err2) {
    // error handling code goes here
        myconsole.log("ERROR2 : ",err2);            
    } else {       
        
    // code to execute on data retrieval
   // var device = [1 , 2 , 3 , 4 , 5,6,7,11,15];
    
       for(var i in data_receive){
           myconsole.log(data_receive[i]['Item_Name']);  
           // if(device.indexOf(data_receive[i]['Item_Type']) != -1 )
            //{
                var data = {Id:data_receive[i]['Id'],Device: data_receive[i]['Name'],Current_State: data_receive[i]['Last_Seen'],Node_Port:data_receive[i]['Node_Port'],Item_Type:'Node',Status:data_receive[i]['Status'],RSSI:data_receive[i]['RSSI'],IPAddress:data_receive[i]['IPAddress'],Vcc:data_receive[i]['Vcc'],Uptime:data_receive[i]['UpTime']};
               
               if(sockets)
                sockets.emit('NodeStatusEvent',data);
               else
                 io.emit('NodeStatusEvent',data);
               
            
           // }
            
            
           
       }
         
        
         
    }
   
});



return;
}



function updateNodeStatus(node){
   
    if(node){
     
      
     
   
       
       myconsole.log(node + " update requested");
      
       db.getdata('Nodes',{Select: 'Id,Name,Last_Seen,Node_Port,Status,IPAddress,RSSI,Vcc,UpTime',whereClause:"Node_Port = " + node + " ORDER BY Node_Sort_Position ASC"},function(err2,data_receive){
       
       if (err2) {
       // error handling code goes here
           myconsole.log("ERROR4 : " + err2);            
       } else {       
           myconsole.log("Update Data " + data_receive[0]['Id']); 
            var data = {Id:data_receive[0]['Id'],Device: data_receive[0]['Name'],Current_State: data_receive[0]['Last_Seen'],Node_Port:data_receive[0]['Node_Port'],Item_Type:'Node',Status:data_receive[0]['Status'],RSSI:data_receive[0]['RSSI'],IPAddress:data_receive[0]['IPAddress'],Vcc:data_receive[0]['Vcc'],Uptime:data_receive[0]['UpTime']};
                  
            io.emit('NodeStatusEvent',data);
              
              
           // pushOver.push("Cleopatra Health: " + data_receive[0]['Name'] + " node " + data_receive[i]['Status']);
         
       }
      
      });
    }/*else{
     
       myconsole.log("all update requested");
      
       db.getdata('Nodes',{Select: 'Id,Name,Last_Seen,Node_Port,Status,IPAddress,RSSI,Vcc,UpTime',whereClause:"Node_Port > 0 ORDER BY Node_Sort_Position ASC"},function(err2,data_receive){
       
       if (err2) {
       // error handling code goes here
           myconsole.log("ERROR4 : " + err2);            
       } else {      
        
        for(var i = 0;i<data_receive.length;i++){
           myconsole.log("Update Data " + data_receive[0]); 
            var data = {Id:data_receive[i]['Id'],Device: data_receive[i]['Name'],Current_State: data_receive[i]['Last_Seen'],Node_Port:data_receive[i]['Node_Port'],Item_Type:'Node',Status:data_receive[i]['Status'],RSSI:data_receive[i]['RSSI'],IPAddress:data_receive[i]['IPAddress'],Vcc:data_receive[i]['Vcc'],Uptime:data_receive[i]['UpTime']};
                  
            io.emit('NodeStatusEvent',data);
              
              
           // pushOver.push("Cleopatra Health: " + data_receive[i]['Name'] + " node " + data_receive[i]['Status']);
            
        }
         
       }
      
      });
     
     
     
    }*/
       
    
    
    return;
    
}



function clearBypass(){
     myconsole.log("Clear bypass");
    
    bypassedZones.length = 0;
    // myconsole.log(bypassedZones);
     
       
}






function getEvents(numEvents){
   ROWS = 0;
   // console.log(numEvents);
    db.getdata('Event_Log',{Select: 'Id,Type,Event,Time',whereClause:"Id LIKE '%' ORDER BY Id DESC LIMIT " + numEvents},function(err2,data_receive){
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR3 : ",err2);            
                        } else {            
                        // code to execute on data retrieval
                           for(var i = numEvents-1;i>=0;i--){
                                
                                var eventData = JSON.parse(data_receive[i]['Event']);
                                
                                  //  myconsole.log(eventData);
                                    
                                  
                                     
                                    constructEvent(eventData,data_receive[i]['Time'],data_receive[i]['Type'],function(eventstring,alarm,time,type){
                                     
                                        if(eventstring)
                                        {  
                                           var  data = {Event_Type: type,Event:eventstring,Time:time,Alarm:alarm};
                                      
                                            if(data)
                                            { 
                                                
                                                
                                                io.emit('sendEvents',data,false);
                                                
                                            }
                                        }
                                       // myconsole.log(ROWS + " " + numEvents);
                                        ROWS++;
                                        if(ROWS == numEvents-1){
                                          io.emit('sendEvents',false,true);
                                        }
                                    
                                    });
                                
                            }
                               
                           }
                            
                            return;
                        
                        });
    

    
    
}

function getImportantEvents(numEvents){
    ROWS = 0;
    db.getdata('Event_Log',{Select: 'Id,Type,Event,Time',whereClause:"Event LIKE '%Important%' ORDER BY Id DESC LIMIT " + numEvents},function(err2,data_receive){
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR4 : ",err2);            
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
                                        ROWS++;
                                        if(ROWS == numEvents-1){
                                          io.emit('sendEvents',false,true);
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
    ROWS = 0;
    db.getdata('Event_Log',{Select: 'Id',whereClause:"Event LIKE '%12%' ORDER BY Id DESC LIMIT 1"},function(err2,data_receive){
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR5 : ",err2);            
                        } else {            
                        // code to execute on data retrieval
                        
                        if(data_receive[0])
                        {
                        var newid = data_receive[0]['Id']-10;

                          db.getdata('Event_Log',{Select: '*',whereClause:"Id > "+ newid +" limit 20"},function(err2,data_receives){
                        if (err2) {
                        // error handling code goes here
                            myconsole.log("ERROR6 : ",err2);            
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
                                        ROWS++;
                                        if(ROWS == 1-1){
                                          io.emit('sendEvents',false,true);
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

function getAlarmTriggers(lastArmTime,sockets){
    
    db.getLast('Alarm_Triggers',{Select: 'Zone,Time',whereClause:"'Zone' LIKE '%'" },function(err2,data_receive){
        
        if(err2){
            myconsole.log(err2);    
        }else if(data_receive[0]){
           
            //myconsole.log( Date.parse(data_receive[0]['Time']) - Date.parse(lastArmTime));
            if(Date.parse(data_receive[0]['Time']) > Date.parse(lastArmTime)){
             myconsole.log("New alarm event");
                sockets.emit("alarmTrigger",{Event:data_receive[0]["Zone"],Time:data_receive[0]["Time"]});
            }
        }
        
    });
    
    
}

function constructEvent(eventData,time,type,callback){
   
    if(eventData['Zone'] && eventData['Current_State'])
    {
    
        var state = null;
        var Alarm = null;
         // myconsole.log("this3 " + data['Current_State']);
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
       // console.log("this is a null event: " +  eventData);
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
  //    myconsole.log('listening on port:'+ port.toString());
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
        }, function(err2, message) { 
       // myconsole.log(err2 || message); 
        if(message){
		myconsole.log("Email sent successfully");
	}else if(err2){
		myconsole.log("An error occured while sending email");
	}
	
	return;
     });
  }
 



function getModeStatus(callback){
    db.getdata('Alarm_Items',{Select: 'Current_State',whereClause:"Type LIKE '%11%' OR Type LIKE '%14%' ORDER BY Id ASC LIMIT 2"},function(err2,data_receive){
          
         if(data_receive[0]){    
            if(data_receive[0]['Current_State']){
              
             // myconsole.log("Debug: Night mode is active");
              
              if(data_receive[1]['Current_State']){
              
              callback(true,true,false);
              
              }else if(data_receive[1]['Current_State'] == 0){
               callback(true,false,false);
                  
              }
              
                
            }else if(!data_receive[0]['Current_State']){
            
           // myconsole.log("Debug: Night mode is NOT active");
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

function updateIP2(){
 
  getip(function(ip){
        
        if(ip){
        // pushOver.push(ip);
        externalip = ip;
        
        	if(oldip != externalip)
        	{
        	 pushOver.push(ip);
        	  myconsole.log("Ip Sent");
             if(configure2.server[0].dnsupdate[0] == 'true')  {
        		    //updatedns(ip,function(){});
        		   // updatednshome(ip,function(){});  
             }
    		 
    		 if(configure2.server[0].dnsemail[0] == 'true')  
    		    sendemail("Your current IP is http://" + ip);   
    		    
    		 if(configure2.server[0].dnsproxy[0] == 'true')  
    		   //updatednsproxy(function(){});   
		       
		      oldip = externalip;   
        	
		    }
	
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
     // myconsole.log(chunk);
     callback(ipAddress); 
        
    });
     
    res.on('end', function() {
     // ipAddress contains the external IP address
    });
    }).on('error', function(err2) {
    throw err2;
}).end();
   


}

function updatedns(ip,callback2){
    
    var http2 = require('http'), https = require('https');
    var username = configure2.server[0].dnsusername[0];
    var password = configure2.server[0].dnspassword[0];
    var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    var header = { 'Authorization': auth};
    //'Host': 'https://ydns.eu/api/v1/update/?host=example.ydns.eu&ip='+ip,
   
    var options = {
      host: 'https://ydns.eu',
      path: '/api/v1/update/?host=cleohome.ydns.eu',//&ip='+ip.substring(0,15),
      port: '80',
      //This is the only line that is new. `headers` is an object with the headers to request
      headers: header 
    };
    
  var req = http2.request(options, function(res) {
  //	myconsole.log('STATUS: ' + res.statusCode);
  //	myconsole.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    		myconsole.log('DNS Update1 - YDNS: ' + chunk);
  	});
  });

req.on('error', function(e) {
  myconsole.log('YDNS: problem with request: ' + e.message);
});

// write data to request body
//req.write('data\n');
//req.write('data\n');
req.end();	
callback2();

}

function updatednshome(ip,callback2){
    
    var http2 = require('http');
    //var username = configure2.server[0].dnsusername[0];
   // var password = configure2.server[0].dnspassword[0];
    var pass = configure2.server[0].dnspassword2[0];
    //var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
   // var header = { 'Authorization': auth};
    //curl "http://dyn.example.com:password@dyn.dns.he.net/nic/update?hostname=dyn.example.com&myip=192.168.0.1
  // myconsole.log(pass);
    var options = {
      host: 'https://api.dynu.com',  //wget "http://api.dynu.com/nic/update?myip=198.144.117.32&myipv6=2604:4400:a:8a::f4&username=someusername&password=098f6bcd4621d373cade4e832627b4f6"
      path: '/v2/dns \
        -H "accept: application/json" \
        -H "API-Key: cK8MRDSS9cKv97729gNM1DNX1aU98hUK"',//&ip='+ip.substring(0,15),
      port: '80',
      //This is the only line that is new. `headers` is an object with the headers to request
    //  headers: header 
    };
    
  var req = http2.request(options, function(res) {
  //	myconsole.log('STATUS: ' + res.statusCode);
  //	myconsole.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    		myconsole.log('DynU DNS Update2: ' + chunk);
  	});
  });

req.on('error', function(e) {
  myconsole.log('problem with DynU request: ' + e.message);
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
  //	myconsole.log('STATUS: ' + res.statusCode);
  //	myconsole.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    		//myconsole.log('DNS Proxy Update: ' + chunk);
    		myconsole.log('Unotelly Update: OK');
  	});
  });

req.on('error', function(e) {
  myconsole.log('problem with request: ' + e.message);
});

// write data to request body
//req.write('data\n');
//req.write('data\n');
req.end();	
callback2();
    
}




function panic(){
    
      myconsole.log('Panic');
      ipc.of.AlarmModule.emit('panic');
    
}





function speak(msg){
    
    
    io.emit("speak",msg['msg']);
    
}




function sendConfig(sockets){
    
     if(sockets)
    sockets.emit("config",configure2);
    else
    io.emit("config",configure2);
    
    return;
    
    
}

function sendGatewayStatus(sockets){
    
    if(sockets)
    sockets.emit("gatewayConnected",gatewayStatus);
    else
    io.emit("gatewayConnected",gatewayStatus);
    
    return;
    
}





exports.start = start;
