var myconsole = require('./myconsole.js');
const startup_delay = 1000; 
var debug = 0;
myconsole.log('Controller active, delay for router is ' + startup_delay/1000  + ' seconds, please wait...');


timer = setTimeout(function() {
 myconsole.log('starting....');       
    var Config = require('./GetConfig.js');
    
    
    Config.config(function(){
    
    var Server = require('./CleoHome_Server.js');
    
    var Events = require('./Event_Handler.js');
    var Alarm = require('../AlarmProxy/Alarm_Module.js');
    var mySensor = require('./mySensorsParse.js');
    var Suncalc = require('./SunCalc.js');
    var Time = require('./timeUpdate');
    var Weather = require('./weatherUpdate');
    var Health = require('./health.js');
    var ruleMon = require('./Rule_Monitor.js');
    var ping = require('./ping.js');
 //  var Rules = require('./Rule_Evaluate.js');
    
    
    
    Alarm.start();
    Events.start();
    mySensor.start();
    Server.start();
    Suncalc.start();
    Time.start();
    Weather.start();
    Health.start();
    ruleMon.start();
    ping.start();
  //  Rules.start();
    
    
    });

    clearTimeout(timer);
 
}, startup_delay);




