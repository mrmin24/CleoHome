var ping = require('ping');
var db = require('./dbhandler');
//var evaluate = require('../JSModules/Rule_Items_Evaluate');
var pushOver = require('../JSModules/public/scripts/pushOver.js');
var myconsole = require('./myconsole.js');
var rules = require('./Rule_UpdateStates.js');
var intervaltime = 1 * 10 * 1000;
var hosts = [];
var id = [];

var timer_ping;

function start() {
    //myconsole.log(debug);
    myconsole.log("Ping check started");
    
   Ping();
   
   
     data = {'Select':'Network_Address,Id','whereClause':'Item_Type = 20'};
        
        db.getdata('Items',data,function(err,result){
           
           if(err){
               
               myconsole.log(err);
           }else if(result){
                 
                 
                for(var i = 0;i<result.length;i++){
                    
                    hosts.push(result[i].Network_Address);
                    id.push(result[i].Id);
                    
                }
                
                
                 timer_ping = setInterval(function(){


                    Ping();
                 
                }, intervaltime);
           }
           
           
        });
   
   
   
   
   
   
}


function Ping(){
    
   //   myconsole.log("test ping");
       
        hosts.forEach(function(host){
            ping.sys.probe(host, function(isAlive){
               
               if(isAlive){
                    data = {'Set':'Item_Current_Value','Where':'Id','Current_State':1 ,'Name':id[hosts.indexOf(host)]};
                        
                    db.update('Items',data,function(){});  
                 rules.updateRuleStates(id[hosts.indexOf(host)], 1) ;
               
               }else{
                    data = {'Set':'Item_Current_Value','Where':'Id','Current_State':0 ,'Name':id[hosts.indexOf(host)]};
                        
                    db.update('Items',data,function(){});  
                    rules.updateRuleStates(id[hosts.indexOf(host)], 0);
                   
               }
               
               
             //  myconsole.log("Phone : " + isAlive);
            });
        });
    
    
}

exports.start = start;

