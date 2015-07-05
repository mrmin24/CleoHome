var db = require('./dbhandler');
var evaluate = require('../JSModules/Rule_Items_Evaluate');

var calcTime = require('../JSModules/compareTime');


var intervaltime = 60000;



var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


function start() {
    
    console.log("TimeUpdate started");
   
    timeUpdate();
    dayMinutesUpdate();
    
    
    zeroTime(function(){   //waits for 00 seconds before starting interval to ensure time is checked on each minute
        timeUpdate();
        dayMinutesUpdate();
        
        timer = setInterval(function(){
    
    
            timeUpdate();
            dayMinutesUpdate();
            
         
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
                 
                 evaluate.evaluateChange(result[0].Id,newTime,function(node,port,state){
                                     
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state);
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
                 
                 evaluate.evaluateChange(result[0].Id,newTime,function(node,port,state){
                                     
                     if(node && port && state){
                      mySensorsocket.emit('deviceSwitch',node,port,state);
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


                   
exports.start = start;                   