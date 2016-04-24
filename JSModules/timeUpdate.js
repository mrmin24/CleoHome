var db = require('./dbhandler');
//var evaluate = require('../JSModules/Rule_Items_Evaluate');
var myconsole = require('../JSModules/myconsole.js');
var calcTime = require('../JSModules/compareTime');
var pushOver = require('./public/scripts/pushOver.js');

var rules = require('./Rule_UpdateStates.js');
var intervaltime = 1 * 60 * 1000;



var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


function start() {
   // myconsole.log(debug);
    
    myconsole.log("TimeUpdate started");
   
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
               
               myconsole.log(err);
           }else if(result){
               
               
                newTime = Date.now();
                data = {'Set':'Item_Current_Value','Where':'Id','Current_State':newTime ,'Name':result[0].Id};
                        
                db.update('Items',data,function(){});   
                 
                 
                 rules.updateRuleStates(result[0].Id, newTime);
               
                /* evaluate.evaluateChange(result[0].Id,newTime,function(node,port,state,cancelTime,func){
                      eval(func);               
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state,1);
                     }
                     
                     
                     if(cancelTime){
                                 
                         mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                     }
                // myconsole.log(data_receive[0]);
                 });*/
                 
                 
                 
                    
               // myconsole.log("At time: " + timenow + " IsDark is: " + isDark);    
                
                
            
            //myconsole.log("test");
            //myconsole.log(sunset);
            //myconsole.log(position.altitude*180/3.14);
           }
        });
}

function zeroTime(callback){
    myconsole.log("Waiting to zero time. Can take up to 1 min");
    var timezero = 1;
    
     timer = setInterval(function(){
    
    
        date = new Date();
        timezero = date.getSeconds();
        
        if(timezero == 0){
            myconsole.log("Time zeroed");
            clearInterval(timer);
            callback();
        }   
    }, 500);
    
         
        
    

    
    
}

function dayMinutesUpdate(){
    
    
        data = {'Select':'Id','whereClause':'Item_Name = ' + '"' + 'Current_Day_Minutes' + '"'};
        
        db.getdata('Items',data,function(err,result){
           
           if(err){
               
               myconsole.log(err);
           }else if(result){
               
               
                var newTime = calcTime.calculateMinutes();
                
                
                
                data = {'Set':'Item_Current_Value','Where':'Id','Current_State':newTime ,'Name':result[0].Id};
                        
                db.update('Items',data,function(){});   
                 
                 rules.updateRuleStates(result[0].Id, newTime);
                  
                 /* evaluate.evaluateChange(result[0].Id,newTime,function(node,port,state,virtual,cancelTime,func){
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
                 
                
                 
                 if(newTime == 0){   //set day in DB at midnight
                  weekDayUpdate();
                 }
                 
                    
               // myconsole.log("At time: " + timenow + " IsDark is: " + isDark);    
                
                
            
            //myconsole.log(sunriseStr);
            //myconsole.log(sunset);
            //myconsole.log(position.altitude*180/3.14);
           }
        });
}

function weekDayUpdate(){
    
    data = {'Select':'Id','whereClause':'Item_Name = ' + '"' + 'Day_Of_Week' + '"'};
        
    db.getdata('Items',data,function(err,result){
       
       if(err){
           
           myconsole.log(err);
       }else if(result){
           
        day = new Date();
        day = day.getDay();
        myconsole.log("Setting day to: " + day);
         
         data = {'Set':'Item_Current_Value','Where':'Id','Current_State':day ,'Name':result[0].Id};
            
         db.update('Items',data,function(){});   
         
         rules.updateRuleStates(result[0].Id, isDark);
                
         
         
        /* evaluate.evaluateChange(result[0].Id,day,function(node,port,state,cancelTime,func){
              eval(func);               
             if(node && port && state){
              mySensorsocket.emit('deviceSwitch',node,port,state,1);
             }
             
             if(cancelTime){
                                 
                 mySensorsocket.emit('switchOff',node,port,0,cancelTime);
             }
         //myconsole.log(data_receive[0]);
         });*/
        }
 
    });
                    
                    
}
                   
exports.start = start;                   