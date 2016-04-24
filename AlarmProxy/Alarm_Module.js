var nap = require('./nodealarmproxy.js');
var config = require('./config.js'); //comment this out
var log = require('./logger.js');
var db = require('./dbhandler');
var myconsole = require('../JSModules/myconsole.js');
var pushOver = require('../JSModules/public/scripts/pushOver.js');

//var evaluate = require('../JSModules/Rule_Items_Evaluate');

var configure = require('../JSModules/GetConfig.js');
var rules = require('../JSModules/Rule_UpdateStates.js');
var configure2 = configure.data.xml;

var port = configure2.alarmmodule[0].port[0];
var client = 0;
var sockets;
var lastzone;
var alarm = null;
var oldconnectionstatus = null;
var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);
var retrycount = 0;
var retryrequest = false;

function start() {
   // myconsole.log(debug);

    var io = require('socket.io').listen(port);
    if (io) {
        myconsole.log('Alarm Module Listening on ' + port.toString());
    }


    var https = require('https');
    pollAlarm();

    log.ownDb('Alarm_Items', {
        Set: 'Current_State',
        Where: 'Name',
        Name: 'Alarm_Connection_Status',
        Current_State: 0
    });

            if(!alarm){        
                alarm = nap.initConfig({
                        password: configure2.alarm[0].envisPassword[0], //replace config.* with appropriate items
                        serverpassword: '0000',
                        actualhost: configure2.alarm[0].ip[0],
                        actualport: configure2.alarm[0].port[0],
                        serverhost: '0.0.0.0',
                        serverport: configure2.alarm[0].port[0],
                        zones: configure2.alarm[0].zones[0],
                        partitions: configure2.alarm[0].partitions[0],
                        proxyenable: configure2.alarm[0].proxyEnabled[0],
                        atomicEvents: true
                    });
            }
          
  

        io.sockets.on('connection', function(socket) {
            //myconsole.log('Client connected to Alarm Module');
            // var data = 'Alarm';
            sockets = socket;
            socket.on('register', function(data, callback) {
                myconsole.log(data.client + ' registered for ' + data.type + ' updates');
                client = 1;
                
                callback();
            });


            socket.on('disconnect', function() {

                myconsole.log('Alarm Module: Client Disconnected from alarm updates');

                if (this.server.sockets.sockets.length == 0) {
                    client = 0;
                    myconsole.log('All clients disconnected from alarm module');
                }
            });


            socket.on('armDisarmAlarm', function(type) {

                armDisarm(type);

            });


            socket.on('bypassZones', function(zones, callback) {



                bypassZones(zones, callback);


            });
            
            socket.on('panic', function() {


                sendPanic();


            });



        });

       


 // function connect() {

        alarm.on('data', function(data) {
            
            logdata(data);

        });

        alarm.on('zoneupdate', function(data) {
            logdata(data);
        });

        alarm.on('partitionupdate', function(data) {
            logdata(data);


        });

        alarm.on('partitionuserupdate', function(data) {
            logdata(data);
        });

        alarm.on('systemupdate', function(data) {
            logdata(data);
        });

        alarm.on('keypadLedState', function(data) {
            //sockets.emit('keypadLedState', {state: data});
            // myconsole.log("keypad is " + data['code'] + " " +data['ledState']);
            logdata(data);

        });

        alarm.on('power', function(code) {

            sockets.emit('power', code);
        });

        alarm.on('trouble', function(code) {

            sockets.emit('trouble', code);
        });

        alarm.on('other', function(data) {
            logdata(data);
        });

        alarm.on('Alarms_connection_status', function(status,connected) {
           
           
         //  myconsole.log(status + "  " + oldconnectionstatus);
            
            
            
            
            
            
            
            if (oldconnectionstatus != status){
                
                if(sockets){
                 sockets.emit('AlarmConnectionState', status,connected);
            }
            
                 myconsole.log("Alarm Status " + status);
                
                 log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Alarm_Connection_Status',
                    Current_State: status
                });
                
                
                
              
            }
            
        
            
            if(status == 1){
                if(!alarm){
                alarm = nap.initConfig({
                        password: configure2.alarm[0].envisPassword[0], //replace config.* with appropriate items
                        serverpassword: '0000',
                        actualhost: configure2.alarm[0].ip[0],
                        actualport: configure2.alarm[0].port[0],
                        serverhost: '0.0.0.0',
                        serverport: configure2.alarm[0].port[0],
                        zones: configure2.alarm[0].zones[0],
                        partitions: configure2.alarm[0].partitions[0],
                        proxyenable: configure2.alarm[0].proxyEnabled[0],
                        atomicEvents: configure2.alarm[0].atomicEvents[0]
                    });
                }
                
            }else{
                alarm = null;
            }
            
            
            oldconnectionstatus = status;
        });

   // }

}




var watchevents = ['500', '510', '601', '602', '609', '610', '650', '651', '653', '625', '626', '652', '654', '655', '656', '657', /*'659'*/ , '670', '700', '701', '702', '750', '751', '800', '801', '802', '803', '829'];
var alarmcode = ['601', '605', '620', '621', '625', '654'];  //alarm trigger events
var armDisarmZone = [configure2.alarm[0].awayArmZone[0],configure2.alarm[0].stayArmZone[0]];
var zoneOpenedCode = '609';

function logdata(data) {

    var important = isImportant(data);
    //myconsole.log(important);
    if (important) {
        log.logger('Alarm', '{"Important":"' + important + '"}');
    }



    if (watchevents.indexOf(data.code) != -1) {
       // myconsole.log(data.pre +' ' + data.zone + ' ' + data.post);
        if (data.pre == 'Zone') {
             //*****************************************************************************************************  Used for control based on alarm zone opened
          
                
               getID('Zone_' + data.zone,function(ID){
                   // myconsole.log(ID);
                     
                   
                   /*let recursivelyDelete = (id) => {
                      db.items.findOne(id, (err, item) => {
                        if(err) {
                          callback(err)
                        } else {
                          db.items.remove({ '_id': item._id}, (err, results) => {
                            if(err) {
                              callback(err)
                            } else {
                              if(item.child_id) {
                                recursivelyDelete(item.child_id)
                              } else {
                                return true
                              }
                            }
                          }
                        }
                      }  
                    }*/
                 //  myconsole.log("Alarm " + ID);
                   // evaluate(ID,data.send);
                   
                 
                   rules.updateRuleStates(ID, data.send);
                   
                   
                   
                   
                  /*  evaluate.evaluateChange(ID,data.send,function(node,port,state,virtual,cancelTime,func){
                        eval(func);             
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state,1);
                     }
                     
                     if(cancelTime){
                                 
                         mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                     }
                     
                     if(virtual == 1){
                         data = {Set:'Item_Current_Value',Where:'Id',Current_State:state,Name:node};
                        
                        db.update('Items',data,function(){});  
                         evaluate(node,state);
                         
                     }
                 //myconsole.log(data_receive[0]);
                 });*/
                    
               
                
                });
                
                
            //***********************************************************************************************
            
            if (alarmcode.indexOf(data.code) != -1) {
                lastzone = data.zone;
            
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Zone_' + data.zone,
                    Current_State: data.send,
                    Alarm_Event: Date()
                });
                
                //myconsole.log("GettingID");
                

                //myconsole.log(data.zone + " test 1");
                if (client) {
                    sockets.emit('AlarmEvent', {
                        Zone: data.zone,
                        Current_State: data.send,
                        Alarm_Event: Date()
                    });
                }
            }
            else if(armDisarmZone.indexOf(data.zone) > -1 && data.code == zoneOpenedCode){
             /*   myconsole.log("Alarm: Arm / Disarm: " + data.zone + " / " + data.code )
                db.getdata('Alarm_Items', {
                        Select: 'Current_State',
                        whereClause: "Type LIKE '9' ORDER BY Id DESC LIMIT 1"
                    }, function(err, data_receive) {

                        if (err) {

                            myconsole.log(err);
                        }
                        else if (data_receive) {

                            var armStates = [6,7,8,9,10,12,13,14];
                            var currentState = data_receive[0]['Current_State'];
                            myconsole.log(currentState);
                            
                            if(data.zone == configure2.alarm[0].awayArmZone[0]){
                                
                                if(currentState == 3 || currentState == 5 ){
                                    
                                    armDisarm("Away");    
                                    
                                }else if(armStates.indexOf(currentState) > -1 ){
                                    myconsole.log("Disarm");
                                    armDisarm("Disarm");
                                }
                            
                                
                                
                                
                            }else if(configure2.alarm[0].stayArmZone[0]){
                                var stayStates = [7,9,10];
                                
                                
                                if(currentState == 3 || currentState == 5){
                                    
                                    armDisarm("Stay"); 
                                    
                                    
                                }else if(currentState == 7 || currentState == 13 || currentState == 6 ){
                                    
                                    armDisarm("Night");
                                }
                                
                                
                            }
                            
                        }
                    });
                
                
                */
                
                
            }else {
                lastzone = data.zone;
          
            
            
           
            
            
            
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Zone_' + data.zone,
                    Current_State: data.send
                });
                
                
                
                
                
                // myconsole.log(data.zone + " test 3");
                if (client) {
                    // myconsole.log(data.zone + " test 2");

                    sockets.emit('AlarmEvent', {
                        Zone: data.zone,
                        Current_State: data.send
                    });
                }
            }

        }
        else if (data.pre == 'Partition') {
          //   myconsole.log(data);
            if (data.code == '652') {
                var state;
                switch (data.mode) {
                case '0':
                    getState("'Armed in Away Mode'", function(result) {

                        if (result) {
                            log.ownDb('Alarm_Items', {
                                Set: 'Current_State',
                                Where: 'Name',
                                Name: 'Partition_' + data.partition,
                                Current_State: result
                            });

                            if (client) {
                                sockets.emit('AlarmEvent', {
                                    Partition: data.partition,
                                    Current_State: result
                                });
                            }

                        }

                    });
                    break;


                case '1':
                    getState("'Armed in Stay Mode'", function(result) {

                        if (result) {
                            log.ownDb('Alarm_Items', {
                                Set: 'Current_State',
                                Where: 'Name',
                                Name: 'Partition_' + data.partition,
                                Current_State: result
                            });

                            if (client) {
                                sockets.emit('AlarmEvent', {
                                    Partition: data.partition,
                                    Current_State: result
                                });
                            }
                        }
                    });

                    break;


                case '2':
                    getState("'Armed in Zero_Entry_Away Mode'", function(result) {

                        if (result) {
                            log.ownDb('Alarm_Items', {
                                Set: 'Current_State',
                                Where: 'Name',
                                Name: 'Partition_' + data.partition,
                                Current_State: result
                            });

                            if (client) {
                                sockets.emit('AlarmEvent', {
                                    Partition: data.partition,
                                    Current_State: result
                                });
                            }
                        }
                    });
                    break;


                case '3':
                    getState("'Armed in Zero_Entry_Stay Mode'", function(result) {

                        if (result) {
                            log.ownDb('Alarm_Items', {
                                Set: 'Current_State',
                                Where: 'Name',
                                Name: 'Partition_' + data.partition,
                                Current_State: result
                            });

                            if (client) {
                                sockets.emit('AlarmEvent', {
                                    Partition: data.partition,
                                    Current_State: result
                                });
                            }
                        }
                    });
                    break;

                default:
                    {}

                }

            }
            else if (data.code == '654') {
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Partition_' + data.partition,
                    Current_State: data.send
                });
                 updateStatus('Partition_1',data.send);
                myconsole.log('Alarm Module: An alarm was triggered');
                sockets.emit('alarmTrigger', lastzone,Date.now());
                
            }else if (data.code == '655') {    //disarmed code
              log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Type',
                    Name: "11",
                    Current_State: 0
                });
                  updateStatus('Night_Mode_Active',0);
                  
                   log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Partition_' + data.partition,
                    Current_State: data.send
                });
                 updateStatus('Partition_1',data.send);
                 
                 
                   sockets.emit('clearBypassZone');
                myconsole.log('Alarm Module: The alarm was disarmed');
               
                
            }else if (data.code == '656') {
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Partition_' + data.partition,
                    Current_State: data.send
                });
                 updateStatus('Partition_1',data.send);
                myconsole.log('Alarm Module: Exit delay');
                //sockets.emit('alarmTrigger', lastzone,Date.now());
            }
            else {


                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Partition_' + data.partition,
                    Current_State: data.send
                });
                 updateStatus('Partition_1',data.send);
                if (client) {
                    sockets.emit('AlarmEvent', {
                        Partition: data.partition,
                        Current_State: data.send
                    });
                }
            }
        }
        else if (data.code == '510') {
            //myconsole.log("test " + data.code + " " + data.ledState);
            var bypass, memory, armed, ready;
            var flag_bypass = 8,
                flag_memory = 4,
                flag_armed = 2,
                flag_ready = 1;
            var code = getHex(data.ledState);


            if (code & flag_bypass) {
                bypass = true;
            }
            else {
                bypass = false;
            }


            if (code & flag_memory) {
                memory = true;
            }
            else {
                memory = false;
            }

            if (code & flag_armed) {
                armed = true;
            }
            else {
                armed = false;
            }

            if (code & flag_ready) {
                ready = true;
            }
            else {
                ready = false;
            }


            // myconsole.log('Partition_' + data.partition + '_ledState');
           // myconsole.log(code);
           // myconsole.log(client);
            if (client) {
                sockets.emit('keypadLedState', {
                    Bypass: bypass,
                    Memory: memory,
                    Armed: armed,
                    Ready: ready
                });
            }

            log.ownDb('Alarm_Items', {
                Set: 'Current_State',
                Where: 'Name',
                Name: 'Partition_' + data.partition + '_ledState',
                Current_State: code
            });
            
            
        }

        else {
            log.logger('Alarm', '{"Status":"' + data.pre + ' ' + data.post + '"}');
        }

    }

}

function pollAlarm() {

   var alarmPollTimer =  setInterval(function() {
        nap.manualCommand('000', false, function(ack, nack, retry) {

        })
    }, 60000);
    
}



function getState(requiredState, callback) {

    db.getdata('Alarm_States', {
        Select: 'Id',
        whereClause: 'State = ' + requiredState
    }, function(err, data_receive) {
        if (err) {
            // error handling code goes here
            myconsole.log("ERROR1 : ", err);
        }
        else {
            // code to execute on data retrieval
             updateStatus('Partition_1',data_receive[0]['Id']);
            callback(data_receive[0]['Id']);
        }
    });

}


function updateStatus(item,state){
    
    data = {'Select':'Id','whereClause':'Name = ' + '"' + item + '"'};
        
        db.getdata('Alarm_Items',data,function(err,result){
           
           if(err){
               
               myconsole.log(err);
           }else if(result){
               
               
               rules.updateRuleStates(result[0].Id, state);
               
              /* evaluate.evaluateChange(result[0].Id,state,function(node,port,state,virtual,cancelTime,func){
                        eval(func);             
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state,1);
                     }
                     
                     if(cancelTime){
                                 
                         mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                     }
                     
                     if(virtual == 1){
                         data = {Set:'Item_Current_Value',Where:'Id',Current_State:state,Name:node};
                        
                        db.update('Items',data,function(){});   
                         
                     }
                 //myconsole.log(data_receive[0]);
                 });*/
               
               
           }
           
        });
    
}

function isImportant(data) {

    var important = ['652', '654', '655', '800', '801', '802', '803'];
    var zoneAlarms = ['601', '603', '605'];
    var importantZones = ['001', '016'];
    var importantZoneEvents = ['609'];
    // myconsole.log("Checking for important Event " + data.code + " " + data.zone);

    if (important.indexOf(data.code) != -1) {

        //myconsole.log("Important Event " + data.code);
        if (zoneAlarms.indexOf(data.code) != -1) {
            var message = data.pre + "_" + data.zone + " " + data.post;
        }
        else {
            var message = data.pre + " " + data.post;
        }

        return message;



    }
    else {
        if (importantZones.indexOf(data.zone) != -1 && importantZoneEvents.indexOf(data.code) != -1) {

            // myconsole.log("Important Event " + data.code);   
            var message = "Zone_" + data.zone + " " + data.post;
            return message;


        }

        else {

            return null;
        }

    }




}

function getHex(code) {

    switch (code) {
    case '1':
        return 1;
        break;

    case '2':
        return 2;
        break;

    case '3':
        return 3;
        break;

    case '4':
        return 4;
        break;

    case '5':
        return 5;
        break;

    case '6':
        return 6;
        break;

    case '7':
        return 7;
        break;

    case '8':
        return 8;
        break;

    case '9':
        return 9;
        break;

    case 'A':
        return 10;
        break;

    case 'B':
        return 11;
        break;

    case 'C':
        return 12;
        break;

    case 'D':
        return 13;
        break;

    case 'E':
        return 14;
        break;

    case 'F':
        return 15;
        break;

    default:
        return 0;
        break;

    }
}


function bypassZones(zones, callback) {

    bypassedZones.length = 0;
    bypassOne(zones.splice(0, 1), zones, callback);


}


function sendPanic(){
    
    nap.manualCommand('0603' , false, function(ack, nack, retry) {
            if (nack) {
                myconsole.log("nack");
                
                return;
            }
            else if (ack) {

                myconsole.log("ack"); 

            }
            


        });
    // myconsole.log('send panic 2');
}

function speak(msg){
    
        sockets.emit('speak',msg);
    }

var nextzone, nextzone, bypassedZones = [];

function bypassOne(zone, zones, callback) {
    //myconsole.log(zones);
    //myconsole.log(zone);
    nextzone = zone;
    sleep(250, function() {
        // executes after one second, and blocks the thread

        nap.manualCommand('0711*1' + zone + '#', false, function(ack, nack, retry) {
            if (nack) {
                myconsole.log("nack");
                nextzone = null;
                nextzone = null;
                callback(true, false);
                return;
            }
            else if (ack) {

                if (zones.length == 0) {
                    myconsole.log("Zone " + nextzone + " bypassed");
                    bypassedZones.push(nextzone);
                    nextzone = null;
                    nextzone = null;
                    callback(false, true, bypassedZones);
                    return;

                }
                else {

                    myconsole.log("Zone " + nextzone + " bypassed");
                    bypassedZones.push(nextzone);
                    nextzone = zones.splice(0, 1);
                    nextzones = zones;
                    bypassOne(nextzone, nextzones, callback);
                }

            }
            else if (retry) {
                myconsole.log("Retry Zone " + nextzone);
                bypassOne(nextzone, nextzones, callback);

            }


        });

    });

}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {;
    }
    callback();
}


function armDisarm(type){
    
            myconsole.log("Alarm: " + type + " requested");


                if (type == 'Away') {

                    nap.manualCommand('0301', false, function(ack, nack, retry) {

                        if (ack) {

                            myconsole.log('Away mode');
                             log.ownDb('Alarm_Items', {
                                            Set: 'Current_State',
                                            Where: 'Type',
                                            Name: "11",
                                            Current_State: 0
                                        });
                              updateStatus('Night_Mode_Active',0);

                        }
                        else if (nack) {

                            myconsole.log('Away mode failed');


                        }


                    });

                }
                else if (type == 'Stay') {


                    nap.manualCommand('0311', false, function(ack, nack, retry) {

                        if (ack) {

                            myconsole.log('Stay mode');
                             log.ownDb('Alarm_Items', {
                                            Set: 'Current_State',
                                            Where: 'Type',
                                            Name: "11",
                                            Current_State: 0
                                        });
                              updateStatus('Night_Mode_Active',0);

                        }
                        else if (nack) {

                            myconsole.log('Stay mode failed');


                        }


                    });




                    // while(nap.ackReceived != '031') {}


                }
                else if (type == 'Disarm') {

                    db.getdata('Alarm_Items', {
                        Select: 'Current_State',
                        whereClause: "Type LIKE '%11%' ORDER BY Id DESC LIMIT 1"
                    }, function(err, data_receive) {

                        if (err) {

                            myconsole.log(err);
                        }
                        else if (data_receive) {


                            var currentState = data_receive[0]['Current_State'];


                            // myconsole.log(currentState);

                            if (currentState == 1) {
                               
                                nap.manualCommand('0711*1', false, function(ack, nack, retry) {

                                    if (ack) {

                                        log.ownDb('Alarm_Items', {
                                            Set: 'Current_State',
                                            Where: 'Type',
                                            Name: "11",
                                            Current_State: 0
                                        });
                                          updateStatus('Night_Mode_Active',0);
                                        myconsole.log('Night mode cancelled');
                                        
                                        sleep(1000, function() {
                                            
                                            
                                          
                                            
                                            
                                             if(retrycount == 0){
                                                 disarmcommand();
                                                 sleep(1000,function() {});
                                                 while(retrycount <= 3 && retryrequest == true ){
                                                    disarmcommand();
                                                    sleep(1000,function() {});
                                                
                                                 }
                                               }
                                            
                                            
                                            
                                        });


                                    }
                                    else if (nack) {

                                        myconsole.log('Night mode cancel failed');


                                    }
                                    else if (retry) {

                                        myconsole.log("Debug: Retry required");
                                    }


                                });


                            }
                            else {
                                
                               
                               if(retrycount == 0){
                                 disarmcommand();
                                 sleep(1000,function() {});
                                 while(retrycount <= 3 && retryrequest == true ){
                                    disarmcommand();
                                    sleep(1000,function() {});
                                
                                 }
                               }
                                

                               /* nap.manualCommand('0401', true, function(ack, nack, retry) {



                                    if (ack) {
                                        myconsole.log('Disarmed');
                                         log.ownDb('Alarm_Items', {
                                            Set: 'Current_State',
                                            Where: 'Type',
                                            Name: "11",
                                            Current_State: 0
                                        });
                                          updateStatus('Night_Mode_Active',0);

                                    }
                                    else if (nack) {

                                        myconsole.log('Disarm failed');


                                    }
                                    else if (retry) {

                                        myconsole.log("Debug: Retry required");
                                    }
                                });*/




                            }

                        }
                    });
                }

                else if (type == 'Night') {
                    myconsole.log("debug: Night mode selected");

                    db.getdata('Alarm_Items', {
                        Select: 'Current_State',
                        whereClause: "Type LIKE '%9%' ORDER BY Id DESC LIMIT 1"
                    }, function(err, data_receive) {

                        if (err) {
                            myconsole.log(err);

                        }
                        else if (data_receive) {


                            var currentState = data_receive[0]['Current_State'];
                            //myconsole.log("debug: State before night mode is: " + currentState);

                            // myconsole.log(currentState);

                            if (currentState == 7  || currentState == 13 ) {
                                nap.manualCommand('0711*1', false, function(ack, nack, retry) {

                                    if (ack) {

                                        myconsole.log('Night mode');
                                        log.ownDb('Alarm_Items', {
                                            Set: 'Current_State',
                                            Where: 'Type',
                                            Name: "11",
                                            Current_State: 1
                                        });
                                        
                                         updateStatus('Night_Mode_Active',1);

                                    }
                                    else if (nack) {

                                        myconsole.log('Night mode failed');


                                    }
                                    else if (retry) {

                                        myconsole.log("Debug: Retry required");
                                    }


                                });


                            }
                            else if (currentState == 3 || currentState == 5 ) {


                                nap.manualCommand('0311', false, function(ack, nack, retry) {



                                    if (ack) {
                                        myconsole.log('Stay mode');

                                        nap.manualCommand('0711*1', false, function(ack, nack, retry) {

                                            if (ack) {

                                                myconsole.log('Night mode');
                                                log.ownDb('Alarm_Items', {
                                                    Set: 'Current_State',
                                                    Where: 'Type',
                                                    Name: "11",
                                                    Current_State: 1
                                                });
                                                
                                                  updateStatus('Night_Mode_Active',1);

                                            }
                                            else if (nack) {

                                                myconsole.log('Night mode failed');


                                            }
                                            else if (retry) {

                                                myconsole.log("Debug: Retry required");

                                            }


                                        });
                                    }
                                    else if (nack) {

                                        myconsole.log('Stay mode failed');


                                    }
                                    else if (retry) {

                                        myconsole.log("Debug: Retry required");
                                    }
                                });




                            }
                            else if (currentState == 6) {

                                db.getdata('Alarm_Items', {
                                    Select: 'Current_State',
                                    whereClause: "Type LIKE '%11%' ORDER BY Id DESC LIMIT 1"
                                }, function(err, data_receive) {

                                    if (err) {

                                    }
                                    else if (data_receive[0]['Current_State']) {



                                        nap.manualCommand('0711*1', false, function(ack, nack, retry) {

                                            if (ack) {


                                                myconsole.log('Night mode cancelled');
                                                log.ownDb('Alarm_Items', {
                                                    Set: 'Current_State',
                                                    Where: 'Type',
                                                    Name: "11",
                                                    Current_State: 0
                                                });
                                                
                                                 updateStatus('Night_Mode_Active',0);

                                            }
                                            else if (nack) {

                                                myconsole.log('Night mode cancel failed');


                                            }
                                            else if (retry) {

                                                myconsole.log("Debug: Retry required");
                                            }


                                        });
                                    }

                                });
                            }

                        }
                    });

                }
}

function disarmcommand(){
    nap.manualCommand('0401', true, function(ack, nack, retry) {
    
        if (ack) {
    
             myconsole.log('Disarmed');
             log.ownDb('Alarm_Items', {
                Set: 'Current_State',
                Where: 'Type',
                Name: "11",
                Current_State: 0
            });
              updateStatus('Night_Mode_Active',0);
    
                retrycount = 0;  
                retryrequest = false;
          
    
        }
        else if (nack) {
    
            myconsole.log('Disarm Failed');
    
    
        }
         if (retry) {
           
            myconsole.log("Debug: Retry required");
            retrycount++;
            retryrequest = true;
          
        }
       // else {
        //    myconsole.log("Debug: Something is not right");
        //}
    
    
    
    });  
}

function getID(name,callback){
    
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
                                
                                

}


//  function evaluate(id,data){
     //     myconsole.log("test");              
    /* evaluate.evaluateChange(id,data,function(node,port,state,virtual,cancelTime,func){
            eval(func);             
         if(node && port && state){
          mySensorsocket.emit('deviceSwitch',node,port,state,1);
         }
         
         if(cancelTime){
                     
             mySensorsocket.emit('switchOff',node,port,0,cancelTime);
         }
         
         if(virtual == 1){
             data = {Set:'Item_Current_Value',Where:'Id',Current_State:state,Name:node};
            
            db.update('Items',data,function(){});  
             evaluate(node,state);
             
         }
     //myconsole.log(data_receive[0]);
     });*/
    
//} 

exports.start = start;