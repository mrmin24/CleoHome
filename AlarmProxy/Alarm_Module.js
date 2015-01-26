var nap = require('./nodealarmproxy.js');
var config = require('./config.js'); //comment this out
var log = require('./logger.js');
var db = require('./dbhandler');

var configure = require('../JSModules/GetConfig.js');
var configure2 = configure.data.xml;

var port = configure2.alarmmodule[0].port[0];
var client = 0;
var sockets;
var lastzone;
var alarm = null;
var oldconnectionstatus = null;

function start() {

    var io = require('socket.io').listen(port);
    if (io) {
        console.log('Alarm Module Listening on ' + port.toString());
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
                    //connect();

   // ping();
    
  // function ping() {

       /* var exec = require('child_process').exec;
        exec("ping -c 3 10.0.0.20", function(error, stdout, stderr) {

            if (stdout) {
                // console.log("Ping to Alarm Module successful");
                if (!alarm) {
                    console.log("Ping to Alarm Module successful");
                    alarm = nap.initConfig({
                        password: config.password, //replace config.* with appropriate items
                        serverpassword: config.serverpassword,
                        actualhost: config.host,
                        actualport: config.port,
                        serverhost: '0.0.0.0',
                        serverport: config.port,
                        zones: config.zones,
                        partitions: config.partitions,
                        proxyenable: config.proxyEnabled,
                        atomicEvents: true
                    });
                    connect();
                }
            }
            else if (error) {
                console.log("Ping to Alarm Module: " + error);
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Alarm_Connection_Status',
                    Current_State: 0
                });
                alarm = null;
            }
            else if (stderr) {
                console.log("Ping to Alarm Module: " + stderr);
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Alarm_Connection_Status',
                    Current_State: 0
                });
                alarm = null;
            }
        });
        // console.log('test');
   // }
    
  //  setInterval(ping, 5000);
*/
  

        io.sockets.on('connection', function(socket) {
            //console.log('Client connected to Alarm Module');
            // var data = 'Alarm';
            sockets = socket;
            socket.on('register', function(data, callback) {
                console.log(data.client + ' registered for ' + data.type + ' updates');
                client = 1;
                
                
                
                callback();
            });


            socket.on('disconnect', function() {

                console.log('Alarm Module: Client Disconnected from alarm updates');

                if (this.server.sockets.sockets.length == 0) {
                    client = 0;
                    console.log('All clients disconnected');
                }
            });


            socket.on('armDisarmAlarm', function(type) {

                armDisarm(type);

            });


            socket.on('bypassZones', function(zones, callback) {



                bypassZones(zones, callback);


            });



        });

        //if (config.access_token && config.app_id) {
        //SmartThings is setup/enabled

        //}


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
            // console.log("keypad is " + data['code'] + " " +data['ledState']);
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
           
           
         //  console.log(status + "  " + oldconnectionstatus);
            
            
            
            
            
            
            
            if (oldconnectionstatus != status){
                
                if(sockets){
                 sockets.emit('AlarmConnectionState', status,connected);
            }
            
                 console.log("Alarm Status " + status);
                
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
var alarmcode = ['601', '605', '620', '621', '625', '654'];
var armDisarmZone = [configure2.alarm[0].awayArmZone[0],configure2.alarm[0].stayArmZone[0]];
var zoneOpenedCode = '609';

function logdata(data) {

    var important = isImportant(data);
    //console.log(important);
    if (important) {
        log.logger('Alarm', '{"Important":"' + important + '"}');
    }

    if (watchevents.indexOf(data.code) != -1) {
        //console.log(data.pre +' ' + data.zone + ' ' + data.post);
        if (data.pre == 'Zone') {
            if (alarmcode.indexOf(data.code) != -1) {
                lastzone = data.zone;
            
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Zone_' + data.zone,
                    Current_State: data.send,
                    Alarm_Event: Date()
                });

                //console.log(data.zone + " test 1");
                if (client) {
                    sockets.emit('AlarmEvent', {
                        Zone: data.zone,
                        Current_State: data.send,
                        Alarm_Event: Date()
                    });
                }
            }
            else if(armDisarmZone.indexOf(data.zone) > -1 && data.code == zoneOpenedCode){
                console.log("Alarm: Arm / Disarm: " + data.zone + " / " + data.code )
                db.getdata('Alarm_Items', {
                        Select: 'Current_State',
                        whereClause: "Type LIKE '9' ORDER BY Id DESC LIMIT 1"
                    }, function(err, data_receive) {

                        if (err) {

                            console.log(err);
                        }
                        else if (data_receive) {

                            var armStates = [6,7,8,9,10,12,13,14];
                            var currentState = data_receive[0]['Current_State'];
                            console.log(currentState);
                            
                            if(data.zone == configure2.alarm[0].awayArmZone[0]){
                                
                                if(currentState == 3 || currentState == 5 ){
                                    
                                    armDisarm("Away");    
                                    
                                }else if(armStates.indexOf(currentState) > -1 ){
                                    console.log("Disarm");
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
                
                
                
                
                
            }else {
                lastzone = data.zone;
            //console.log(lastzone);
            //console.log(data.send);
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Zone_' + data.zone,
                    Current_State: data.send
                });
                // console.log(data.zone + " test 3");
                if (client) {
                    // console.log(data.zone + " test 2");

                    sockets.emit('AlarmEvent', {
                        Zone: data.zone,
                        Current_State: data.send
                    });
                }
            }

        }
        else if (data.pre == 'Partition') {
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
                console.log('Alarm Module: An alarm was triggered');
                sockets.emit('alarmTrigger', lastzone,Date.now());
            }if (data.code == '656') {
                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Partition_' + data.partition,
                    Current_State: data.send
                });
                console.log('Alarm Module: Exit delay');
                //sockets.emit('alarmTrigger', lastzone,Date.now());
            }
            else {


                log.ownDb('Alarm_Items', {
                    Set: 'Current_State',
                    Where: 'Name',
                    Name: 'Partition_' + data.partition,
                    Current_State: data.send
                });

                if (client) {
                    sockets.emit('AlarmEvent', {
                        Partition: data.partition,
                        Current_State: data.send
                    });
                }
            }
        }
        else if (data.code == '510') {
            //console.log("test " + data.code + " " + data.ledState);
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


            // console.log('Partition_' + data.partition + '_ledState');
           // console.log(code);
           // console.log(client);
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

    setInterval(function() {
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
            console.log("ERROR1 : ", err);
        }
        else {
            // code to execute on data retrieval
            callback(data_receive[0]['Id']);
        }
    });

}

function isImportant(data) {

    var important = ['652', '654', '655', '800', '801', '802', '803'];
    var zoneAlarms = ['601', '603', '605'];
    var importantZones = ['001', '016'];
    var importantZoneEvents = ['609'];
    // console.log("Checking for important Event " + data.code + " " + data.zone);

    if (important.indexOf(data.code) != -1) {

        //console.log("Important Event " + data.code);
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

            // console.log("Important Event " + data.code);   
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

var nextzone, nextzone, bypassedZones = [];

function bypassOne(zone, zones, callback) {
    //console.log(zones);
    //console.log(zone);
    nextzone = zone;
    sleep(250, function() {
        // executes after one second, and blocks the thread

        nap.manualCommand('0711*1' + zone + '#', false, function(ack, nack, retry) {
            if (nack) {
                console.log("nack");
                nextzone = null;
                nextzone = null;
                callback(true, false);
                return;
            }
            else if (ack) {

                if (zones.length == 0) {
                    console.log("Zone " + nextzone + " bypassed");
                    bypassedZones.push(nextzone);
                    nextzone = null;
                    nextzone = null;
                    callback(false, true, bypassedZones);
                    return;

                }
                else {

                    console.log("Zone " + nextzone + " bypassed");
                    bypassedZones.push(nextzone);
                    nextzone = zones.splice(0, 1);
                    nextzones = zones;
                    bypassOne(nextzone, nextzones, callback);
                }

            }
            else if (retry) {
                console.log("Retry Zone " + nextzone);
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
    



                if (type == 'Away') {

                    nap.manualCommand('0301', false, function(ack, nack, retry) {

                        if (ack) {

                            console.log('Away mode');


                        }
                        else if (nack) {

                            console.log('Away mode failed');


                        }


                    });

                }
                else if (type == 'Stay') {


                    nap.manualCommand('0311', false, function(ack, nack, retry) {

                        if (ack) {

                            console.log('Stay mode');


                        }
                        else if (nack) {

                            console.log('Stay mode failed');


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

                            console.log(err);
                        }
                        else if (data_receive) {


                            var currentState = data_receive[0]['Current_State'];


                            // console.log(currentState);

                            if (currentState == 1) {
                                nap.manualCommand('0711*1', false, function(ack, nack, retry) {

                                    if (ack) {

                                        log.ownDb('Alarm_Items', {
                                            Set: 'Current_State',
                                            Where: 'Type',
                                            Name: "11",
                                            Current_State: 0
                                        });
                                        console.log('Night mode cancelled');

                                        sleep(1000, function() {
                                            nap.manualCommand('0401', true, function(ack, nack, retry) {

                                                if (ack) {

                                                    console.log('Disarmed');




                                                }
                                                else if (nack) {

                                                    console.log('Disarm Failed');


                                                }
                                                else if (retry) {

                                                    console.log("Debug: Retry required");
                                                }
                                                else {
                                                    console.log("Debug: Something is not right");
                                                }



                                            });
                                        });


                                    }
                                    else if (nack) {

                                        console.log('Night mode cancel failed');


                                    }
                                    else if (retry) {

                                        console.log("Debug: Retry required");
                                    }


                                });


                            }
                            else {

                                nap.manualCommand('0401', true, function(ack, nack, retry) {



                                    if (ack) {
                                        console.log('Disarmed');


                                    }
                                    else if (nack) {

                                        console.log('Disarm failed');


                                    }
                                    else if (retry) {

                                        console.log("Debug: Retry required");
                                    }
                                });




                            }

                        }
                    });
                }

                else if (type == 'Night') {
                    console.log("debug: Night mode selected");

                    db.getdata('Alarm_Items', {
                        Select: 'Current_State',
                        whereClause: "Type LIKE '%9%' ORDER BY Id DESC LIMIT 1"
                    }, function(err, data_receive) {

                        if (err) {
                            console.log(err);

                        }
                        else if (data_receive) {


                            var currentState = data_receive[0]['Current_State'];
                            //console.log("debug: State before night mode is: " + currentState);

                            // console.log(currentState);

                            if (currentState == 7  || currentState == 13 ) {
                                nap.manualCommand('0711*1', false, function(ack, nack, retry) {

                                    if (ack) {

                                        console.log('Night mode');
                                        log.ownDb('Alarm_Items', {
                                            Set: 'Current_State',
                                            Where: 'Type',
                                            Name: "11",
                                            Current_State: 1
                                        });

                                    }
                                    else if (nack) {

                                        console.log('Night mode failed');


                                    }
                                    else if (retry) {

                                        console.log("Debug: Retry required");
                                    }


                                });


                            }
                            else if (currentState == 3 || currentState == 5 ) {


                                nap.manualCommand('0311', false, function(ack, nack, retry) {



                                    if (ack) {
                                        console.log('Stay mode');

                                        nap.manualCommand('0711*1', false, function(ack, nack, retry) {

                                            if (ack) {

                                                console.log('Night mode');
                                                log.ownDb('Alarm_Items', {
                                                    Set: 'Current_State',
                                                    Where: 'Type',
                                                    Name: "11",
                                                    Current_State: 1
                                                });

                                            }
                                            else if (nack) {

                                                console.log('Night mode failed');


                                            }
                                            else if (retry) {

                                                console.log("Debug: Retry required");

                                            }


                                        });
                                    }
                                    else if (nack) {

                                        console.log('Stay mode failed');


                                    }
                                    else if (retry) {

                                        console.log("Debug: Retry required");
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


                                                console.log('Night mode cancelled');
                                                log.ownDb('Alarm_Items', {
                                                    Set: 'Current_State',
                                                    Where: 'Type',
                                                    Name: "11",
                                                    Current_State: 0
                                                });

                                            }
                                            else if (nack) {

                                                console.log('Night mode cancel failed');


                                            }
                                            else if (retry) {

                                                console.log("Debug: Retry required");
                                            }


                                        });
                                    }

                                });
                            }

                        }
                    });

                }
}
   

exports.start = start;