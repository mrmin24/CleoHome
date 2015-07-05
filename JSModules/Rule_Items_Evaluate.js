var db = require('./dbhandler');
var rule = require('./Rule_Evaluate');

exports.evaluateChange = function(itemId,itemValue,callback){
    
    
    data = {'Select':'Id,Rule_Id,Equals,Greater_Than,Less_Than,Not_Equal','whereClause':'Item_Id = ' + itemId};
    
    db.getdata('Rule_Items',data,function(err,result){
       
       if(err){
           
           console.log(err);
       }else if(result){
           
          // console.log(result);
           var status = 0;
           for(var i in result){
               if(result[i].Equals == itemValue  && result[i].Equals != null){
                   status = 1;
               }else if(itemValue > result[i].Greater_Than  && result[i].Greater_Than != null){
                   status = 1;
               }else if(itemValue < result[i].Less_Than && result[i].Less_Than != null){
                   status = 1;
               }else if(result[i].Not_Equal != itemValue  && result[i].Not_Equal != null){
                   status = 1;
               }
               
               if(status == 1 ){
                   
                   data = {'Set':'Status','Where':'Id','Current_State':1,'Name':result[i].Id};
                
                   db.update('Rule_Items',data,function(){});
                   rule.checkRule(result[i].Rule_Id,function(node,port,state){
                       
                        if(node && port && state){
                            callback(node,port,state);
                        }
                        else
                        {
                            callback(null,null,null);
                        }
                       
                   });
                   status = 0;
               }else
               {
                   data = {'Set':'Status','Where':'Id','Current_State':0,'Name':result[i].Id};
                
                   db.update('Rule_Items',data,function(){});
                   status = 0;
                   callback(null,null,null);
               }
           }
          
       }else{
           callback(null,null,null);
       }
       
       
        
    });
    
    
    
}