var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'CleoUser',
  password : '33557722',
  database: 'CleoHomeDB'
});
// don't need .connect()

//DO ONE TABLE AT A TIME

var table1 = 'Alarm_Items';
var table2 = 'Alarm_States';
var table3 = 'Alarm_Item_Types';


var data =[ 

{Name: 'Zone_001',Type: 3, Description: 'Front Door', Current_State: 18},
{Name: 'Zone_002',Type: 3, Description: 'Living Room Door', Current_State: 18},
{Name: 'Zone_003',Type: 1, Description: 'Living Room', Current_State: 18},
{Name: 'Zone_004',Type: 3, Description: 'Kitchen Door', Current_State: 18},
{Name: 'Zone_005',Type: 3, Description: 'Office Door', Current_State: 18},
{Name: 'Zone_006',Type: 1, Description: 'Office', Current_State: 18},
{Name: 'Zone_007',Type: 4, Description: 'Hallway', Current_State: 18},
{Name: 'Zone_008',Type: 4, Description: 'Main Bedroom', Current_State: 18},
{Name: 'Zone_009',Type: 1, Description: 'Study', Current_State: 18},
{Name: 'Zone_010',Type: 1, Description: 'Kitchen', Current_State: 18},
{Name: 'Zone_011',Type: 1, Description: 'Laundry', Current_State: 18},
{Name: 'Zone_012',Type: 3, Description: 'Laundry Door', Current_State: 18},
{Name: 'Zone_013',Type: 7, Description: 'Spare1', Current_State: 18},
{Name: 'Zone_014',Type: 7, Description: 'Spare2', Current_State: 18},
{Name: 'Zone_015',Type: 5, Description: 'Arm/Disarm', Current_State: 18},
{Name: 'Zone_016',Type: 6, Description: 'Panic', Current_State: 18},
{Name: 'Zone_017',Type: 2, Description: 'Main Gate', Current_State: 18},
{Name: 'Zone_018',Type: 2, Description: 'Driveway', Current_State: 18},
{Name: 'Zone_019',Type: 2, Description: 'Left Garage', Current_State: 18},
{Name: 'Zone_020',Type: 2, Description: 'Right Garage', Current_State: 18},
{Name: 'Zone_021',Type: 2, Description: 'Wooden Door', Current_State: 18},
{Name: 'Zone_022',Type: 2, Description: 'Front Door Beam', Current_State: 18},
{Name: 'Zone_023',Type: 2, Description: 'Pool Beam', Current_State: 18},
{Name: 'Zone_024',Type: 2, Description: 'Lapa Beam', Current_State: 18},
{Name: 'Zone_025',Type: 2, Description: 'Lapa', Current_State: 18},
{Name: 'Zone_026',Type: 2, Description: 'Back Beam', Current_State: 18},
{Name: 'Zone_027',Type: 2, Description: 'Side Beam', Current_State: 18},
{Name: 'Partition_1',Type: 8, Description: 'Main Partition', Current_State: 18}];
//{Name: 'Zone_1',Type: 1, Description: 'Front Door', Current State: 9}




for(count = 0;count < data.length;count++){
                 
connection.query('INSERT INTO '+ table1 +' SET ?', data[count], function(err, result) {
        if(err) {
            console.log(err);
            }
            else {
                //console.log(result);
            }
            
    });


}


/*
var states =[ 

{State: 'Opened'},
{State: 'Restored'},
{State: 'Ready'},
{State: 'Not Ready'},
{State: 'Ready for force arm'},
{State: 'Armed in Away Mode'},
{State: 'Armed in Stay Mode'},
{State: 'Armed in Zero_Entry_Away Mode'},
{State: 'Armed in Zero_Entry_Stay Mode'},
{State: 'Armed in Night Mode'},
{State: 'Disarmed'},
{State: 'Alarm'},
{State: 'Exit Delay'},
{State: 'Entry Delay'},
{State: 'Failed Arm'},
{State: 'Busy'},
{State: 'Tamper'},
{State: 'Unknown'}];

for(count = 0;count < states.length;count++){
                 
connection.query('INSERT INTO '+ table2 +' SET ?', states[count], function(err, result) {
        if(err) {
            console.log(err);
            }
            else {
                //console.log(result);
            }
            
    });


}
*/

/*
var types =[ 

{Type: 'Zone_Internal'},
{Type: 'Zone_External'},
{Type: 'Zone Door'},
{Type: 'Partition'},
{Type: 'PGM'}];

for(count = 0;count < types.length;count++){
                 
connection.query('INSERT INTO '+ table3 +' SET ?', types[count], function(err, result) {
        if(err) {
            console.log(err);
            }
            else {
                //console.log(result);
            }
            
    });


}
*/

/*
var Arm_Modes =[ 

{Mode: 'Away'},
{Mode: 'Stay'},
{Mode: 'Zero_Entry_Away'},
{Mode: 'Zero_Entry_Stay'},
{Mode: 'Night'}];

for(count = 0;count < Arm_Modes.length;count++){
                 
connection.query('INSERT INTO '+ table4 +' SET ?', types[count], function(err, result) {
        if(err) {
            console.log(err);
            }
            else {
                //console.log(result);
            }
            
    });


}

*/




connection.end();

