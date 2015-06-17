var Config = require('./GetConfig.js');


Config.config(function(){

var Server = require('./CleoHome_Server.js');

var Events = require('./Event_Handler.js');
var Alarm = require('../AlarmProxy/Alarm_Module.js');
var mySensor = require('./mySensorsParse.js');



Alarm.start();
Events.start();
mySensor.start();
Server.start();


});





