var SunCalc = require('suncalc');
var db = require('./dbhandler');
//var evaluate = require('../JSModules/Rule_Items_Evaluate');
var calcTime = require('../JSModules/compareTime');
var pushOver = require('../JSModules/public/scripts/pushOver.js');
var myconsole = require('../JSModules/myconsole.js');
var latitude = -25.825848;
var longitude = 28.269367;
var intervaltime = 5 * 60 * 1000;
var isDark = 1;
var rules = require('./Rule_UpdateStates.js');

var mySensorio = require('socket.io-client');
//var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


function start() {
    //myconsole.log(debug);
    myconsole.log("SunCalc started");
   
    checkSunCalc();
   var suntimer = setInterval(function(){


        checkSunCalc();
        
        
     
    }, intervaltime);
}

function checkSunCalc(){
    
    
       var  data = {'Select':'Id,Item_Current_Value','whereClause':'Item_Name = ' + '"' + 'Is_Dark' + '"'};
        
        db.getdata('Items',data,function(err,result){
           
           if(err){
               
               myconsole.log(err);
           }else if(result){
               
               
            var position = SunCalc.getPosition(/*Date*/ new Date(), /*Number*/ latitude, /*Number*/ longitude);
            var times = SunCalc.getTimes(new Date(), latitude, longitude);  //not used at the moment
        
            // format sunrise time from the Date object
            var sunrise = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
            var sunset = times.sunset.getHours() + ':' + times.sunset.getMinutes();
           
           
           
           var  compareSunrise = calcTime.isTimeNowBigger(sunrise);
           var  compareSunset = calcTime.isTimeNowBigger(sunset);
            
           
           
            if(compareSunrise){
                
                isDark = 0;
                
            }
            
            if(compareSunset){
                
                isDark = 1;
            }
            
            if(result[0].Item_Current_Value != isDark){
            
                
                
                
               var  data = {Set:'Item_Current_Value',Where:'Item_Name',Current_State:isDark,Name:'Is_Dark'};
                        
                db.update('Items',data,function(){});   
                 
                 
                
                 rules.updateRuleStates(result[0].Id, isDark);
                 
                /* evaluate.evaluateChange(result[0].Id,isDark,function(node,port,state,virtual,cancelTime,func){
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
                    
            //    myconsole.log("At time: " + timenow + " IsDark is: " + isDark);    
                
                
            }
            //myconsole.log(sunriseStr);
            //myconsole.log(sunset);
            //myconsole.log(position.altitude*180/3.14);
           }
        });
}
                   
exports.start = start;                   