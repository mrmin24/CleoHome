var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'CleoUser',
  password : '33557722',
  database: 'CleoHomeDB'
});
// don't need .connect()

//DO ONE TABLE AT A TIME


//connection.query('CREATE TABLE Event_Log (Id INT NOT NULL AUTO_INCREMENT,Type VARCHAR(100) NOT NULL, Event VARCHAR(100) NOT NULL,' +
//                 'Time VARCHAR(100) NOT NULL , PRIMARY KEY(Id))', 
                 
connection.query('CREATE TABLE Alarm_Items (Id INT NOT NULL AUTO_INCREMENT,Name VARCHAR(100) NOT NULL UNIQUE ,Type INT NOT NULL, Description VARCHAR(100) NOT NULL UNIQUE,' +      //Alarm
                'Current_State INT NOT NULL,Last_Trig INT,Alarm_Event VARCHAR(100), PRIMARY KEY(Id))',                

//connection.query('CREATE TABLE Alarm_States(Id INT NOT NULL AUTO_INCREMENT,State VARCHAR(100) NOT NULL UNIQUE , PRIMARY KEY(Id))',                                     //Alarm


//connection.query('CREATE TABLE Alarm_Item_Types (Id INT NOT NULL AUTO_INCREMENT,Type VARCHAR(100) NOT NULL UNIQUE , PRIMARY KEY(Id))',                                      //Alarm

//connection.query('CREATE TABLE Alarm_Arm_Modes (Id INT NOT NULL AUTO_INCREMENT,Mode VARCHAR(100) NOT NULL UNIQUE , PRIMARY KEY(Id))',                                      //Alarm   ----- unused
                 

                 
function(err, result){
    // Case there is an error during the creation
    if(err) {
        console.log(err);
    } else {
        console.log("Table Created");
    }
});

connection.end();

