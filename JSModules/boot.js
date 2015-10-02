
const startup_delay = 1000; 

console.log('Controller active, delay for router is ' + startup_delay/1000  + ' seconds, please wait...');


timer = setTimeout(function() {
 console.log('starting....');       
    var Config = require('./GetConfig.js');
    
    
    Config.config(function(){
    
    var Server = require('./CleoHome_Server.js');
    
    var Events = require('./Event_Handler.js');
    var Alarm = require('../AlarmProxy/Alarm_Module.js');
    var mySensor = require('./mySensorsParse.js');
    var Suncalc = require('./SunCalc.js');
    var Time = require('./timeUpdate');
    var Weather = require('./weatherUpdate');
   // var Rules = require('./Rule_Evaluate.js');
    
    
    
    Alarm.start();
    Events.start();
    mySensor.start();
    Server.start();
    Suncalc.start();
    Time.start();
    Weather.start();
  //  Rules.start();
    
    
    });

    clearTimeout(timer);
 
}, startup_delay);




