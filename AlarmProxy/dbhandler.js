var mysql      = require('mysql');
var myconsole = require('../JSModules/myconsole.js');
var config = require('../JSModules/GetConfig.js');
var config2 = config.data.xml.database[0];


var pool = mysql.createPool({
  	host     : config2.host[0],
  user     : config2.user[0],
  password : config2.password[0],
  database: config2.name[0],
  users_table: config2.users_table[0]
});
// don't need .connect()


    

exports.insert = function(table,data) {

    //myconsole.log(data);
    try{ 
     pool.getConnection(function(err2, connection){
      connection.query('INSERT INTO '+ table +' SET ?', data, function(err2, result) {
        connection.release();
        if(err2) {
            myconsole.log(err2);
            }
            else {
                //myconsole.log(result);
            }
            
        });
   
       });
    }catch(e){myconsole.log(e)}
};

exports.update = function(table,data) {

    //myconsole.log(data);
     try{ 
        pool.getConnection(function(err2, connection){
            connection.query('UPDATE '+ table +' SET ' + data.Set + '=? WHERE ' + data.Where + '= ?', [data.Current_State,data.Name], function(err2, result) {
               connection.release();
                if(err2) {
                    myconsole.log(err2);
                    }
                    else {
                       //myconsole.log(result);
                    }
                    
            });
       });
     }catch(e){myconsole.log(e)}
 
};


exports.getdata = function(table,data,callback) {

   try{ 
   pool.getConnection(function(err2, connection){
    
   // myconsole.log(data.whereClause);
   
    connection.query('SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause, [table], function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
       
       connection.release();
        if(err2) {
             callback(err2,null);
            }
            else {
                // myconsole.log(data.whereClause);
             callback(null,result);
            }
            
            });
   
        });
   }catch(e){myconsole.log(e)}
};

exports.getJoinData = function(table,table2,data,callback) {

   pool.getConnection(function(err2, connection){
    
   // myconsole.log(data.whereClause);
   
        connection.query('SELECT ' + data.Select + ' FROM ?? T1 INNER JOIN ?? T2 ON ' + data.Join  + 'WHERE ' + data.whereClause, [table],[table2], function(err2, result) {
          
      // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
           
           connection.release();
            if(err2) {
                 callback(err2,null);
                }
                else {
                    // myconsole.log(data.whereClause);
                 callback(null,result);
                }
                
        });
   
    });
};


exports.getLast = function(table,data,callback) {

   pool.getConnection(function(err2, connection){
    
    //myconsole.log(data);
   
    connection.query('SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause + ' ORDER BY Id DESC LIMIT 1', [table], function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
       
       connection.release();
        if(err2) {
             callback(err2,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
};



//connection.query('UPDATE users SET Name = ? WHERE UserID = ?', [name, userId])






