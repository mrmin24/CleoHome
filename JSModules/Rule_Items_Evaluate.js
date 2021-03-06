var db = require('./dbhandler');
var rule = require('./Rule_Evaluate');
var myconsole = require('./myconsole.js');

exports.evaluateChange = function(itemId,itemValue,callback){
    myconsole.log("evaluate itemid1: " + itemId);
    //myconsole.log(itemValue);
    
    data = {'Select':'Second_Id,Rule_Id,Equals,Greater_Than,Less_Than,Not_Equal,Secondary_Item','whereClause':'Item_Id = ' + itemId };
    
    db.getdata('Rule_Items',data,function(err,result){
       
       if(err){
           
           myconsole.log(err);
       }else if(result){
           
          // myconsole.log(result);
         
           
           for(var i in result){
               
               
               checkStatus(result[i]);
               
               
           }
           
               
               
             function checkStatus(results){  
                 var status = 0;
               if(results.Equals == itemValue  && results.Equals != null){
                   status = 1;
               }else if(itemValue > results.Greater_Than  && results.Greater_Than != null){
                   status = 1;
               }else if(itemValue < results.Less_Than && results.Less_Than != null){
                   status = 1;
               }else if(results.Not_Equal != itemValue  && results.Not_Equal != null){
                   status = 1;
               }
               
               if(status == 1 ){
                   var rulechanged = 0;
                   data = {'Set':'Status','Where':'Second_Id','Current_State':1,'Name':results.Second_Id};
                
                   db.update('Rule_Items',data,function(err,result2){
                       
                       if(result2){
                        if(result2.changedRows >= 1){
                            rulechanged = 1;
                            //myconsole.log(rulechanged);
                        }
                        else{
                            rulechanged = 0;
                            //myconsole.log(rulechanged);
                        }
                        
                       }
                       
                 
                  
                
                        var rules = results.Rule_Id.split(';');     //determine which rules fit with this ID
                        
                  
                   var ids = "";
                  // myconsole.log(rules);
                   for(var j = 0; j < (rules.length * !results.Secondary_Item * rulechanged) ; j++){
                       if(!isNaN(rules[j])){
                           var rulenr = rules[j];
                          // myconsole.log(rules[i]);
                           
                            rule.checkRule(rules[j],function(ruleValid,node,port,state,virtual,Id,onTime,func){
                               // myconsole.log(Id);
                               // myconsole.log(ruleValid + " " + node + " " + port + " " + virtual+ " " + state+ " " + Id+ " " + onTime+ " " + func);
                               
                            if(node /*&& port*/ && state != null && ruleValid ){
                                myconsole.log("Executing rule(1): " + rulenr); 
                                var cancelTime = null;
                                if(onTime > 0 && state == 1){
                                    
                                   cancelTime = setTimer(onTime);
                                   // myconsole.log(cancelTime);
                                }
                                
                                // myconsole.log(node);
                                //myconsole.log(port);
                                // myconsole.log(state);
                                callback(node,port,state,virtual,cancelTime,func);
                                
                            }/*else if(node && state && ruleValid ){
                                myconsole.log("Executing rule(2): " + rulenr);    //duplicate from above but for virtual items
                                var cancelTime = null;
                                if(onTime > 0 && state == 1){
                                    
                                   cancelTime = setTimer(onTime);
                                   // myconsole.log(cancelTime);
                                }
                                
                                // myconsole.log(node);
                               //  myconsole.log(port);
                                // myconsole.log(state);
                                callback(node,port,state,virtual,cancelTime,func);
                                
                            }*/else if(ruleValid ){
                                 myconsole.log("Executing rule(3): " + rulenr);     //function call only
                               //  data = {'Set':'Item_Current_Value','Where':'Id','Current_State':state,'Name':Id};
                
                               // db.update('Items',data,function(){});
                                var cancelTime = null;
                                if(onTime > 0 && state == 1){
                                    
                                   cancelTime = setTimer(onTime);
                                }
                               // myconsole.log(func);
                                callback(null,null,null,virtual,cancelTime,func);
                            }else
                            {
                                callback(null,null,null,null,null,null);
                            }
                           
                        });   
                        
                          
                        }
                      
                   }
                   
                   });
                   
                   status = 0;
                   // }
               }else
               {
                   data2 = {'Set':'Status','Where':'Second_Id','Current_State':0,'Name':result[i].Second_Id};
                
                   db.update('Rule_Items',data2,function(){});
                   status = 0;
                    callback(null,null,null,null,null,null);
               }
           
             }
       }else{
            callback(null,null,null,null,null,null);
       }
       
       
        
    });
    
    
    
    function setTimer(onTime){
        
        var t = new Date();
        return t.setSeconds(t.getSeconds() + onTime);
       
    }
    
    
    
}