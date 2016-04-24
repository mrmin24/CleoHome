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
      pool.getConnection(function(err, connection){
    connection.query('INSERT INTO '+ table +' SET ?', data, function(err, result) {
        connection.release();
        if(err) {
            myconsole.log(err);
            }
            else {
                //myconsole.log(result);
            }
            
    });
   
       });
}

exports.update = function(table,data,callback) {

   // myconsole.log(data);
        pool.getConnection(function(err, connection){
    connection.query('UPDATE '+ table +' SET ' + data.Set + '=? WHERE ' + data.Where + '= ?', [data.Current_State,data.Name], function(err, result) {
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
             callback(null,result);
            }
            
    });
       });
 
}


exports.getdata = function(table,data,callback) {

   pool.getConnection(function(err, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query('SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause, [table], function(err, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err, result) {
      // myconsole.log(result);
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}

exports.getdataUnion = function(table,table2,data,data2,callback) {

   pool.getConnection(function(err, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query('(SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause + ' ) UNION (SELECT ' + data2.Select + ' FROM ?? WHERE ' + data2.whereClause +' )', [table],[table2], function(err, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err, result) {
       myconsole.log(result);
       myconsole.log(err);
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}


exports.getquery = function(query) {

   pool.getConnection(function(err, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query(query, function(err, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err, result) {
      // myconsole.log(result);
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}

exports.deletedata = function(table,data,callback) {
//myconsole.log(data.whereClause);
   pool.getConnection(function(err, connection){
    
    //myconsole.log(data.whereClause);
   
    connection.query('DELETE FROM ?? WHERE ' + data.whereClause, [table], function(err, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err, result) {
       
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}



exports.getLast = function(table,data,callback) {

   pool.getConnection(function(err, connection){
    
    //myconsole.log(data);
   
    connection.query('SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause + ' ORDER BY Id DESC LIMIT 1', [table], function(err, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err, result) {
       
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}

exports.getSQL = function(sql,callback) {

   pool.getConnection(function(err, connection){
    
    //myconsole.log(data);
   
    connection.query(sql, function(err, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err, result) {
       
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
             callback(null,result);
            }
            
    });
   
    });
}

//connection.query('UPDATE users SET Name = ? WHERE UserID = ?', [name, userId])






