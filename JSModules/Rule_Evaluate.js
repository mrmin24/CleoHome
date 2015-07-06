var db = require('./dbhandler');




exports.checkRule = function(rule,callback){
    console.log("Checking rule: "  + rule);
    
   data = {'Select':'Conditions,Result','whereClause':'Id = ' + rule };
    
    db.getdata('Rules',data,function(err,result){
       
       if(err){
           
           console.log(err);
           
       }else if(result){
           //console.log(result[0]);
           var res = result[0].Conditions.split(';');
           
          
           var ids = "";
           for(var i = 0; i < res.length ; i++){
               if(!isNaN(res[i])){
                         
                  ids += res[i] ;          
                  
                  if(i + 1 < res.length ){
                   ids += ",";
                  }
                }
              
           }
           
            var where = "Id IN (" + ids + ") ORDER BY FIELD (Id," + ids + ")";
        
           
           
           data = {'Select':'Status','whereClause':where };
    
            db.getdata('Rule_Items',data,function(err,result2){
               
               if(err){
                   
                   console.log(err);
                   
               }else if(result2){
                  // console.log(result2);
                   
                   var cond = "";
                   var j = 0;
                   for(var i = 0; i < res.length ; i++){
               
                     if(!isNaN(res[i])){
                         
                        cond += result2[j].Status;
                        j++;
                         
                     }else if(isNaN(res[i])){
                         
                        cond += res[i];    
                     }
                     
                   }
                  // console.log(cond);
                  // console.log(eval(cond));
                   
                  var executeRule = eval(cond);
                  
                  if(executeRule > 0){
                      var res2 = result[0].Result.split(';');
                       data = {'Select':'Node_Id,Node_Port','whereClause':"Id = " + res2[0] };
    
                        db.getdata('Items',data,function(err,result3){
                           
                           if(err){
                               
                               console.log(err);
                               callback(null,null,null); 
                               
                           }else if(result3){
                               console.log(result3[0]);
                               callback(result3[0].Node_Id,result3[0].Node_Port,res2[2]);
                               
                           }
                           
                        });
                      
                      
                      
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