


exports.isTimeNowBigger = function(time,callback){
    
    
   
    date = new Date();
    timenow = date.getHours() + ":" + date.getMinutes();
    
    
    if(Date.parse('01/01/2011 ' + timenow) > Date.parse('01/01/2011 ' + time)){
        
        return true;
    }else{
        
        return false;
    }
    
    
    
    
}


exports.calculateMinutes = function(){
    date = new Date();
    timenow = date.getHours()*60 + date.getMinutes();
    
    return timenow;
}