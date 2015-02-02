
exports.data;

exports.config = function(callback) {
    

    var fs = require('fs'),
        xml2js = require('xml2js');
    
    var parser = new xml2js.Parser();
    console.log('Initialising config');
    fs.readFile('./config.xml', function(err, data) {
        if(err)
            console.log(err);
        parser.parseString(data, function (err, result) {
        if(err)
            console.log(err);
            
        exports.data = result;
        //console.log(result);
        console.log('Config Initialised');
        
        callback();
        });
        
    });
   
    
   
}             
            
            
            
    
