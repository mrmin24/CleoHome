var db = require('./dbhandler');
var evaluate = require('../JSModules/Rule_Items_Evaluate');

var calcTime = require('../JSModules/compareTime');
var pushOver = require('./public/scripts/pushOver.js');

var intervaltime = 1 * 60 * 1000;



var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


function start() {
    
    console.log("TimeUpdate started");
   
    timeUpdate();
    dayMinutesUpdate();
    weekDayUpdate();
    
    zeroTime(function(){   //waits for 00 seconds before starting interval to ensure time is checked on each minute
        timeUpdate();
        dayMinutesUpdate();
        
        timer = setInterval(function(){
    
    
            timeUpdate();
            dayMinutesUpdate();
           // weekDayUpdate();
         
        }, intervaltime);
    });
}

function timeUpdate(){
    
    
        data = {'Select':'Id','whereClause':'Item_Name = ' + '"' + 'Current_Time' + '"'};
        
        db.getdata('Items',data,function(err,result){
           
           if(err){
               
               console.log(err);
           }else if(result){
               
               
                newTime = Date.now();
                data = {'Set':'Item_Current_Value','Where':'Id','Current_State':newTime ,'Name':result[0].Id};
                        
                db.update('Items',data,function(){});   
                 
                 evaluate.evaluateChange(result[0].Id,newTime,function(node,port,state,cancelTime,func){
                      eval(func);               
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state);
                     }
                     
                     
                     if(cancelTime){
                                 
                         mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                     }
                 //console.log(data_receive[0]);
                 });
                 
                 
                 
                    
               // console.log("At time: " + timenow + " IsDark is: " + isDark);    
                
                
            
            //console.log(sunriseStr);
            //console.log(sunset);
            //console.log(position.altitude*180/3.14);
           }
        });
}

function zeroTime(callback){
    console.log("Waiting to zero time. Can take up to 1 min");
    var timezero = 1;
    
     timer = setInterval(function(){
    
    
        date = new Date();
        timezero = date.getSeconds();
        
        if(timezero == 0){
            console.log("Time zeroed");
            clearInterval(timer);
            callback();
        }   
    }, 500);
    
         
        
    

    
    
}

function dayMinutesUpdate(){
    
    
        data = {'Select':'Id','whereClause':'Item_Name = ' + '"' + 'Current_Day_Minutes' + '"'};
        
        db.getdata('Items',data,function(err,result){
           
           if(err){
               
               console.log(err);
           }else if(result){
               
               
                var newTime = calcTime.calculateMinutes();
                
                
                
                data = {'Set':'Item_Current_Value','Where':'Id','Current_State':newTime ,'Name':result[0].Id};
                        
                db.update('Items',data,function(){});   
                 
                 evaluate.evaluateChange(result[0].Id,newTime,function(node,port,state,cancelTime,func){
                    
                      eval(func);               
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state);
                     }
                     
                     if(cancelTime){
                                 
                         mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                     }
                 //console.log(data_receive[0]);
                 });
                 
                
                 
                 if(newTime == 0){   //set day in DB at midnight
                  weekDayUpdate();
                 }
                 
                    
               // console.log("At time: " + timenow + " IsDark is: " + isDark);    
                
                
            
            //console.log(sunriseStr);
            //console.log(sunset);
            //console.log(position.altitude*180/3.14);
           }
        });
}

function weekDayUpdate(){
    
    data = {'Select':'Id','whereClause':'Item_Name = ' + '"' + 'Day_Of_Week' + '"'};
        
    db.getdata('Items',data,function(err,result){
       
       if(err){
           
           console.log(err);
       }else if(result){
           
        day = new Date();
        day = day.getDay();
        console.log("Setting day to: " + day);
         
         data = {'Set':'Item_Current_Value','Where':'Id','Current_State':day ,'Name':result[0].Id};
            
         db.update('Items',data,function(){});   
         
         evaluate.evaluateChange(result[0].Id,day,function(node,port,state,cancelTime,func){
              eval(func);               
             if(node && port && state){
              mySensorsocket.emit('deviceSwitch',node,port,state);
             }
             
             if(cancelTime){
                                 
                 mySensorsocket.emit('switchOff',node,port,0,cancelTime);
             }
         //console.log(data_receive[0]);
         });
        }
 
    });
                    
                    
}
                   
exports.start = start;                   