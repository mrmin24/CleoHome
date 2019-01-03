var myconsole = require('./myconsole.js');
var sleep = require('sleep');
var debug = 0;

//debug 0 = no output
//debug 1 = output normal no push message
//debug 2 = no rules
//debug 3 = output and  push message


process.argv.forEach(function (val, index, array) {
  if(index == 2){
     
     debug = val;
  }
});


  
   
    


const startup_delay = 1*1000; 
const startup_delay2 = 30 * 1000; 

myconsole.log('Controller active, delay for router is ' + startup_delay/1000  + ' seconds, please wait...');
var ruleMon = null;

var timer = setTimeout(function() {
 myconsole.log('starting....');       
    var Config = require('./GetConfig.js');
    
    
    Config.config(function(){
     ruleMon = require('./Rule_Monitor.js');    
    
    
    var Events = require('./Event_Handler.js');
    var Alarm = require('../AlarmProxy/Alarm_Module.js');
    var mqtt = require('./MQTTParse.js');
    var mySensor = require('./mySensorsParse.js');
   
    var Suncalc = require('./SunCalc.js');
    var Time = require('./timeUpdate');
    var Weather = require('./weatherUpdate');
   ////////// //var ruleMon = require('./Rule_Monitor.js');    
    var Health = require('./health.js');
    var Server = require('./CleoHome_Server.js');
   
    
    
    
   try{Alarm.start();} catch(e){myconsole.dumpError(e)}
    try{Events.start();} catch(e){myconsole.dumpError(e)}
    try{mqtt.start();} catch(e){myconsole.dumpError(e)}
    try{ mySensor.start();} catch(e){myconsole.dumpError(e)}
  
     try{Server.start();} catch(e){myconsole.dumpError(e)}
    try{Suncalc.start();} catch(e){myconsole.dumpError(e)}
    try{Time.start();} catch(e){myconsole.dumpError(e)}
   try{ Weather.start();} catch(e){myconsole.dumpError(e)}
   
   
   
   
   // Health.start();
    
     if(debug < 2 || debug == 3)
       delayStart();
    
  
  
  
    
    });

    clearTimeout(timer);
 
}, startup_delay);



function delayStart(){
    var timer2 = setTimeout(function() {
     
     
     
     
     
     
     ruleMon.start(); 
        
        
        
        
        
       
    }, startup_delay2); 
    
    
    
}


