var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'CleoUser',
  password : '33557722',
  database: 'CleoHomeDB'
});
// don't need .connect()


    

exports.insert = function(table,data) {

    //console.log(data);
      pool.getConnection(function(err, connection){
    connection.query('INSERT INTO '+ table +' SET ?', data, function(err, result) {
        connection.release();
        if(err) {
            console.log(err);
            }
            else {
                //console.log(result);
            }
            
    });
   
       });
}

exports.update = function(table,data) {

    //console.log(data);
        pool.getConnection(function(err, connection){
    connection.query('UPDATE '+ table +' SET ' + data.Set + '=? WHERE ' + data.Where + '= ?', [data.Current_State,data.Name], function(err, result) {
       connection.release();
        if(err) {
            console.log(err);
            }
            else {
        //        console.log(result);
            }
            
    });
       });
 
}


exports.getdata = function(table,data,callback) {

   pool.getConnection(function(err, connection){
    
    console.log(data.whereClause);
   
    connection.query('SELECT ' + data.Select + ' FROM ?? WHERE ' + data.whereClause, [table], function(err, result) {
      
  // connection.query("SELECT Id FROM Alarm_States WHERE State = 'Ready'", function(err, result) {
       
       connection.release();
        if(err) {
             callback(err,null);
            }
            else {
                // console.log(data.whereClause);
             callback(null,result);
            }
            
    });
   
    });
}


exports.getLast = function(table,data,callback) {

   pool.getConnection(function(err, connection){
    
    //console.log(data);
   
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



//connection.query('UPDATE users SET Name = ? WHERE UserID = ?', [name, userId])






