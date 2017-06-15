var myconsole = require('./myconsole.js');

var debug = 0;

process.argv.forEach(function (val, index, array) {
  if(index == 2){
     
     debug = val;
  }
});


  
   
    


const startup_delay = 1000; 
const startup_delay2 = 60 * 1000; 

myconsole.log('Controller active, delay for router is ' + startup_delay/1000  + ' seconds, please wait...');


var timer = setTimeout(function() {
 myconsole.log('starting....');       
    var Config = require('./GetConfig.js');
    
    
    Config.config(function(){
    
    var Server = require('./CleoHome_Server.js');
    
    var Events = require('./Event_Handler.js');
    var Alarm = require('../AlarmProxy/Alarm_Module.js');
    var mqtt = require('./MQTTParse.js');
    var mySensor = require('./mySensorsParse.js');
    //var ESP8266 = require('./ESP8266Parse.js');
    var Suncalc = require('./SunCalc.js');
    var Time = require('./timeUpdate');
    var Weather = require('./weatherUpdate');
    //var ruleMon = require('./Rule_Monitor.js');    
    var Health = require('./health.js');
    
  //  var ping = require('./ping.js');
 //  var Rules = require('./Rule_Evaluate.js');
    
    
    
    Alarm.start();
    Events.start();
    mqtt.start();
    mySensor.start();
   
    Server.start();
    Suncalc.start();
    Time.start();
    Weather.start();
    Health.start();
    
     if(debug < 2)
       delayStart();
    
  // ruleMon.start();
    
   // ping.start();
  
  
    
    });

    clearTimeout(timer);
 
}, startup_delay);



function delayStart(){
    var timer2 = setTimeout(function() {
     var ruleMon = require('./Rule_Monitor.js');    
     
     
     
     
     
     ruleMon.start(); 
        
        
        
        
        
       
    }, startup_delay2); 
    
    
    
}