
var myconsole = require('./myconsole.js');


exports.power = function(state,type,port){
    
  //  Power<x>         |              | Show current power state of relay<x> as On or Off
  //  Power<x>         | 0 | off      | Turn relay<x> power Off
  //  Power<x>         | 1 | on       | Turn relay<x> power On
  //  Power<x>         | 2 | toggle   | Toggle power of relay<x>
  //  Power<x>         | 3 | blink    | Blink power of relay<x>
  //  Power<x>         | 4 | blinkoff | Stop blinking power of relay<x>
    
    
    
    
    
   // myconsole.log("power");
   
   
   
   
    if(type == "on" || type == "off"){
      myconsole.log('{"CMD":"POWER' + port.toString() + '","MSG":"'+type+'"}');
      return '{"CMD":"POWER' + port.toString() + '","MSG":"'+type+'"}';
      
    }else if(type == "pulse"){
      myconsole.log('{"CMD":"PulseTime' + port.toString() + '","MSG":"'+type+'"}');
      return '{"CMD":"PulseTime' + port.toString() + '","MSG":"'+state+'"}';
      
      
    }
    
    
    
}

function getPowerState(port){
    
  //  Power<x>         |              | Show current power state of relay<x> as On or Off
  //  Power<x>         | 0 | off      | Turn relay<x> power Off
  //  Power<x>         | 1 | on       | Turn relay<x> power On
  //  Power<x>         | 2 | toggle   | Toggle power of relay<x>
  //  Power<x>         | 3 | blink    | Blink power of relay<x>
  //  Power<x>         | 4 | blinkoff | Stop blinking power of relay<x>
    
    return '{"CMD":"POWER' + port.toString() + '","MSG":""}';;
    
    
}