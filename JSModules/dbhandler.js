var mysql      = require('mysql');
var config = require('./GetConfig.js');
var myconsole = require('./myconsole.js');
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
}

exports.update = function(table,data,callback) {

   // myconsole.log(data);
   try{ 
        pool.getConnection(function(err2, connection){
            connection.query('UPDATE '+ table +' SET ' + data.Set + '=? WHERE ' + data.Where + '= ?', [data.Current_State,data.Name], function(err2, result) {
            connection.release();
            if(err2) {
                 callback(err2,null);
                }
                else {
                 callback(null,result);
                }
                
            });
       });
       
  }catch(e){myconsole.log(e)}
 
}


exports.getdata = function(table,data,callback) {

try{ 
  pool.getConnection(function(err2, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query('SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause , [table], function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
      // myconsole.log(result);
       connection.release();
        if(err2) {
             callback(err2,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
    
  }catch(e){myconsole.log(e)}
}

exports.getBackData = function(table,data,callback) {
try{ 
   pool.getConnection(function(err2, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query('SELECT * FROM (SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause +')sub ORDER BY Id ASC' , [table], function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
      // myconsole.log(result);
       connection.release();
        if(err2) {
             callback(err2,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
    
}catch(e){myconsole.log(e)}
}



exports.getdatajoin = function(table1,table2,data,callback) { //SELECT column_name(s) FROM table1INNER JOIN table2 ON table1.column_name=table2.column_name;
try{ 
  pool.getConnection(function(err2, connection){
    
  //  myconsole.log(data);
   
    connection.query('SELECT ' + data.Select + ' FROM ' + table1 + ' T1 INNER JOIN ' + table2 + ' T2 ON T1.' + data.join1 + ' = T2.' + data.join2 + ' WHERE ' + data.whereClause,  function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
      // myconsole.log(result);
       connection.release();
        if(err2) {
             callback(err2,null);
           //  myconsole.log(err2);
            }
            else {
               // myconsole.log(result);
             callback(null,result);
            }
            
    });
   
    });
    
}catch(e){myconsole.log(e)}
}


exports.getdatajoin2 = function(table1,table2,data,callback) { //SELECT column_name(s) FROM table1INNER JOIN table2 ON table1.column_name=table2.column_name;
try{ 
   pool.getConnection(function(err2, connection){
    
  //  myconsole.log(data);
   
    connection.query('SELECT ' + data.Select + ' FROM ' + table1 + ' t1 INNER JOIN ' + table2 + ' t2 ON find_in_set(t2.'+ data.field2 +', t1.'+ data.field1 + ')  WHERE ' + data.whereClause,  function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
      // myconsole.log(result);
       connection.release();
        if(err2) {
             callback(err2,null);
           //  myconsole.log(err2);
            }
            else {
               // myconsole.log(result);
             callback(null,result);
            }
            
    });
   
    });
}catch(e){myconsole.log(e)}
}




exports.getdataUnion = function(table,table2,data,data2,callback) {
try{
   pool.getConnection(function(err2, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query('(SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause + ' ) UNION (SELECT ' + data2.Select + ' FROM ?? WHERE ' + data2.whereClause +' )', [table],[table2], function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
       myconsole.log(result);
       myconsole.log(err2);
       connection.release();
        if(err2) {
             callback(err2,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}catch(e){myconsole.log(e)}
}


exports.getquery = function(query,callback) {
try{
  pool.getConnection(function(err2, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query(query, function(err2, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err2, result) {
      // myconsole.log(result);
       connection.release();
        if(err2) {
             callback(err2,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}catch(e){myconsole.log(e)}
}

exports.deletedata = function(table,data,callback) {
//myconsole.log(data.whereClause);

try{
   pool.getConnection(function(err2, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query('DELETE FROM ?? WHERE ' + data.whereClause, [table], function(err2, result) {
      
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
    
}catch(e){myconsole.log(e)}
}



exports.getLast = function(table,data,callback) {
try{
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
    
}catch(e){myconsole.log(e)}
}

exports.getSQL = function(sql,callback) {
try{
   pool.getConnection(function(err2, connection){
    
    //myconsole.log(data);
   
    connection.query(sql, function(err2, result) {
      
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
    
}catch(e){myconsole.log(e)}
}

//connection.query('UPDATE users SET Name = ? WHERE UserID = ?', [name, userId])






