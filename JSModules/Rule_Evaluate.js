var db = require('./dbhandler');

var myconsole = require('./myconsole.js');


exports.checkRule = function(rule,callback){
    myconsole.log("Checking rule: "  + rule);
    
  var  data = {'Select':'Conditions,Result,RuleOnTime,FunctionName','whereClause':'Id = ' + rule + ' AND Rule_Enabled = 1'  };
    
    db.getdata('Rules',data,function(err,result){
       
       if(err){
           
           myconsole.log(err);
           
       }else if(result){
          // myconsole.log(result[0]);
           var res = result[0].Conditions.split(';');
           
          
           var ids = "";
          
           for(var i = 0; i < res.length ; i++){
               if(!isNaN(res[i])){
                         
                  if(ids.indexOf(res[i]) == -1){
                      if(ids.length > 0 ){
                       ids += ",";
                      }
                    ids += res[i] ;          
                  
                      
                  }
                }
              
           }
          // myconsole.log(ids);
            var where = "Second_Id IN (" + ids + ")  ORDER BY FIELD (Second_Id," + ids + ")";
        
           //AND Secondary_Item = 0
           
          var  data = {'Select':'Status,Second_Id,Secondary_Item','whereClause':where };
    
            db.getdata('Rule_Items',data,function(err,result2){
               
               if(err){
                   
                   myconsole.log(err);
                   
               }else if(result2){
                  // myconsole.log(result2);
                
                   var cond = "";
                  // var j = 0;
                   for(var i = 0; i < res.length ; i++){
               
                     if(!isNaN(res[i])){
                         
                         
                        for(var j = 0;j<result2.length;j++){
                            if(result2[j].Second_Id == res[i]){
                                cond += result2[j].Status;
                            }
                        } 
                         
                        
                       // j++;
                         
                     }else if(isNaN(res[i])){
                         
                        cond += res[i];    
                     }
                     
                   }
                  // myconsole.log(cond);
                  // myconsole.log(eval(cond));
                   
                  var executeRule = eval(cond);
                  myconsole.log("rule: " + cond);
                  if(executeRule > 0){
                      
                      var res2 = result[0].Result.split(';');
                      var onTime = result[0].RuleOnTime;
                      var func = result[0].FunctionName;
                      var nodes = [];
                      var ports = [];
                      var values = [];
                      
                      if(res2[0] != 0){
                          for(var i = 0;i< res2.length/3;i++){
                              
                            var    data = {'Select':'Node_Id,Node_Port,Item_IsVirtual','whereClause':"Id = " + res2[i*3] };
                                
                               var value = res2[i*3+2];
                               // myconsole.log(res2 + "  " + i);
                                var ID = res2[i*3];
                                db.getdata('Items',data,function(err,result3){
                                 //  value = res2[i*3+2];
                                   if(err){
                                       
                                       myconsole.log(err);
                                       callback(false,null,null,null,null,null,null,func); 
                                       
                                   }else if(result3){
                                      // myconsole.log(result3[0]);
                                      
                                      // myconsole.log(nodes[i] + " " + ports[i] + " " + values[i] );
                                     // setTimeout(function () {
                                    // myconsole.log(result3[0].Item_IsVirtual );
                                     if(result3[0].Item_IsVirtual == 1){
                                          //myconsole.log(value);
                                         callback(true,ID,null,value,result3[0].Item_IsVirtual,ID,onTime,func);
                                         
                                     }else{
                                        callback(true,result3[0].Node_Id,result3[0].Node_Port,value,result3[0].Item_IsVirtual,ID,onTime,func); 
                                         
                                     }
                                        
                                      //}, 2000);
                                      
                                   }
                                   
                                });
                            
                           
                            
                          
                            }
                      
                            //callback(result3[0].Node_Id,result3[0].Node_Port,res2[(i*3)+2]);
                      
                      
                      }else{
                          callback(true,null,null,null,null,null,null,func);   
                      }
                  }else
                  {
                    callback(null,null,null);    
                  }
                  
                  
               }
               
               
                
            });
           
           
           
           
           
         // myconsole.log(res);
          
       }
       
       
        
    });
   



};


                   
//exports.start = start;                   
