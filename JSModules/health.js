var db = require('./dbhandler');
//var evaluate = require('../JSModules/Rule_Items_Evaluate');
var pushOver = require('../JSModules/public/scripts/pushOver.js');
var myconsole = require('./myconsole.js');
var intervaltime = 1 * 60 * 1000;
var healthCheckInterval = 60 ;
var now = Date.now();  
var exclude = [];

//var mySensorio = require('socket.io-client');
//var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);


function start() {
    //myconsole.log(debug);
    myconsole.log("Health check started");
   
    checkNodeHealth();
    timer2 = setInterval(function(){


        checkNodeHealth();
        
        
     
    }, intervaltime);
}


function checkNodeHealth(){
    
    data = {'Select':'Name,Last_Seen','whereClause':'Id > 0'};
        
        db.getdata('Nodes',data,function(err,result){
           
           if(err){
               
               myconsole.log(err);
           }else if(result){
                 
                 
                for(var i = 0;i<result.length;i++){
                     
                      var time = new Date().getTime() - result[i].Last_Seen;
                      lastseen = (time/1000/60).toString();
                      lastseen =  lastseen.substring(0, lastseen.indexOf('.'));
                     
                     
                   if(lastseen >= healthCheckInterval){
                     // myconsole.log(lastseen);
                       //myconsole.log("Cleopatra Health: " + result[i].Name + " node offline");
                      if(exclude.indexOf(result[i].Name) == -1){
                       pushOver.push("Cleopatra Health: " + result[i].Name + " node offline");
                       exclude.push(result[i].Name);
                      }
                     
                   }
                   
                    if(lastseen < healthCheckInterval){
                     // myconsole.log(lastseen);
                       //myconsole.log("Cleopatra Health: " + result[i].Name + " node offline");
                      if(exclude.indexOf(result[i].Name) != -1){
                       pushOver.push("Cleopatra Health: " + result[i].Name + " node back online");
                       var index = exclude.indexOf(result[i].Name);
                       // myconsole.log(index);
                        if (index > -1){
                         exclude.splice(index, 1);
                        }
                      }
                      //myconsole.log(exclude);
                   }
                    
                
                    
                }
                
                
               
           }
           
           
        });
    
    
}




exports.start = start;