var SunCalc = require('suncalc');
var db = require('./dbhandler');
var evaluate = require('../JSModules/Rule_Items_Evaluate');
var calcTime = require('../JSModules/compareTime');

var latitude = -25.825848;
var longitude = 28.269367;
var intervaltime = 300000;
var isDark = 1;


var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


function start() {
    console.log("SunCalc started");
   
    checkSunCalc();
    timer = setInterval(function(){


        checkSunCalc();
        
        
     
    }, intervaltime);
}

function checkSunCalc(){
    
    
        data = {'Select':'Id,Item_Current_Value','whereClause':'Item_Name = ' + '"' + 'Is_Dark' + '"'};
        
        db.getdata('Items',data,function(err,result){
           
           if(err){
               
               console.log(err);
           }else if(result){
               
               
            var position = SunCalc.getPosition(/*Date*/ new Date(), /*Number*/ latitude, /*Number*/ longitude);
            var times = SunCalc.getTimes(new Date(), latitude, longitude);  //not used at the moment
        
            // format sunrise time from the Date object
            var sunrise = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
            var sunset = times.sunset.getHours() + ':' + times.sunset.getMinutes();
           
           
           
            compareSunrise = calcTime.isTimeNowBigger(sunrise);
            compareSunset = calcTime.isTimeNowBigger(sunset);
            
           
           
            if(compareSunrise){
                
                isDark = 0;
                
            }
            
            if(compareSunset){
                
                isDark = 1;
            }
            
            if(result[0].Item_Current_Value != isDark){
            
                
                
                
                data = {'Set':'Item_Current_Value','Where':'Item_Name','Current_State':isDark,'Name':'Is_Dark'};
                        
                db.update('Items',data,function(){});   
                 
                 evaluate.evaluateChange(result[0].Id,isDark,function(node,port,state){
                                     
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state);
                     }
                 //console.log(data_receive[0]);
                 });
                    
                console.log("At time: " + timenow + " IsDark is: " + isDark);    
                
                
            }
            //console.log(sunriseStr);
            //console.log(sunset);
            //console.log(position.altitude*180/3.14);
           }
        });
}
                   
exports.start = start;                   