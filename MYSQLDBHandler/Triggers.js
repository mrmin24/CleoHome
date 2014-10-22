
var mysql      = require('mysql');
var connection = mysql.createPool({
  host     : 'localhost',
  user     : 'CleoUser',
  password : '33557722',
  database: 'CleoHomeDB'
});
// don't need .connect()


    




connection.query('CREATE TRIGGER Catch_Alarm_Event AFTER UPDATE ON Alarm_Items FOR EACH ROW INSERT INTO Event_Log SET Type = "Alarm", Event = concat("{""Zone"":""",New.Description,""",""Current_State"":""",New.Current_State,"""}"),Time = NOW();',function(err,result){
    
   if(err){
       console.log(err);
   } 
   else
   {
       console.log(result);
   }
    
    
});