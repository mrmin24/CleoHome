var db = require('./dbhandler');




exports.checkRule = function(rule,callback){
    console.log("Checking rule: "  + rule);
    
   data = {'Select':'Conditions,Result,RuleOnTime','whereClause':'Id = ' + rule + ' AND Rule_Enabled = 1'  };
    
    db.getdata('Rules',data,function(err,result){
       
       if(err){
           
           console.log(err);
           
       }else if(result){
           //console.log(result[0]);
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
           //console.log(ids);
            var where = "Id IN (" + ids + ") AND Secondary_Item = 0 ORDER BY FIELD (Id," + ids + ")";
        
           
           
           data = {'Select':'Status,Second_Id','whereClause':where };
    
            db.getdata('Rule_Items',data,function(err,result2){
               
               if(err){
                   
                   console.log(err);
                   
               }else if(result2){
                  // console.log(result2);
                   //console.log(result2);
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
                  // console.log(cond);
                  // console.log(eval(cond));
                   
                  var executeRule = eval(cond);
                  
                  if(executeRule > 0){
                      
                      var res2 = result[0].Result.split(';');
                      var onTime = result[0].RuleOnTime;
                      var nodes = [];
                      var ports = [];
                      var values = [];
                      
                      for(var i = 0;i< res2.length/3;i++){
                       data = {'Select':'Node_Id,Node_Port','whereClause':"Id = " + res2[i*3] };
                        value = res2[i*3+2];
                        var ID = res2[i*3];
                        db.getdata('Items',data,function(err,result3){
                           
                           if(err){
                               
                               console.log(err);
                               callback(false,null,null,null); 
                               
                           }else if(result3){
                               console.log(result3[0]);
                              
                              // console.log(nodes[i] + " " + ports[i] + " " + values[i] );
                             // setTimeout(function () {
                                callback(true,result3[0].Node_Id,result3[0].Node_Port,value,ID,onTime);
                              //}, 2000);
                              
                           }
                           
                        });
                        
                       
                        
                      }
                      
                      //callback(result3[0].Node_Id,result3[0].Node_Port,res2[(i*3)+2]);
                      
                      
                  }else
                  {
                    callback(null,null,null);    
                  }
                  
                  
               }
               
               
                
            });
           
           
           
           
           
         // console.log(res);
          
       }
       
       
        
    });
   



}


                   
//exports.start = start;                   
