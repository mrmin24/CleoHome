const isUp = require('is-up');
var Config = require('./GetConfig.js');
var ping = require('ping');
var pushOver = null;   
//var status = true;
var Oldup = true;
var Oldup2 = true;
var Oldup3 = true;
    
Config.config(function(){
  
   pushOver = require('./public/scripts/pushOver.js');

 
    checkUp();
    Ping1();
    Ping2();
    
    var timerUP = setInterval(function(){


        checkUp();
        Ping1();
        Ping2();
     
    }, 30000);
    


});



function checkUp(){
    
    isUp('minny.co.za').then(up => {
        
       
        if(Oldup != up){
            if(up)
             pushOver.push("Cleopatra is running again");
            else
             pushOver.push("Cleopatra is not running");
           // console.log("Cleo: " + up);
        }
        Oldup = up;
    
    
        
    });
    
     
    return;
     

}





function Ping1(){
    
   try{ 
       ping.sys.probe('antMiner1.lan', function(isAlive){
            
           
            if(Oldup2 != isAlive){
                if(isAlive)
                 pushOver.push("Miner1 is running again");
                else
                 pushOver.push("Miner1 is not running");
              //  console.log("Miner1: " + isAlive);
            }
           
            Oldup2 = isAlive;
           
            
        
             
        });
    
    }catch(e){
            console.log(e);
        }
        
         return;
     
}


function Ping2(){
    
   try{ 
       ping.sys.probe('antMiner2.lan', function(isAlive){
            
           
            if(Oldup3 != isAlive){
                if(isAlive)
                 pushOver.push("Miner2 is running again");
                else
                 pushOver.push("Miner2 is not running");
                //console.log("Miner2: " + isAlive);
            }
           
            Oldup3 = isAlive;
           
            
        
             
        });
    
    }catch(e){
           // console.log(e);
        }
        
         return;
     
}

