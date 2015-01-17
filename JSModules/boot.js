var Config = require('./GetConfig.js');

Config.start(function(){


var Server = require('./CleoHome_Server.js');

var Events = require('./Event_Handler.js');
var Alarm = require('../AlarmProxy/Alarm_Module.js');



Alarm.start();
Events.start();
Server.start();

});





