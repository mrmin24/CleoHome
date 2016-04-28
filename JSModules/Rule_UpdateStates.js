   
var db = require('./dbhandler');
var myconsole = require('./myconsole.js');
   
   
              
exports.updateRuleStates = function(Id, state){
   //  myconsole.log("Rule to check " + Id.toString());
    var data = {Item_Id: Id, State: state};
    
   
	db.insert('Rules_toCheck',data);
    
    
}