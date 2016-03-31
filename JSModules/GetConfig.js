var myconsole = require('./myconsole.js');
exports.data;

exports.config = function(callback) {
    

    var fs = require('fs'),
        xml2js = require('xml2js');
    
    var parser = new xml2js.Parser();
    myconsole.log('Initialising config');
   // myconsole.log(__DIRNAME);
    fs.readFile(__dirname+'/config.xml', function(err, data) {
        if(err)
            myconsole.log(err);
        parser.parseString(data, function (err, result) {
        if(err)
            myconsole.log(err);
            
        exports.data = result;
        //myconsole.log(result);
        myconsole.log('Config Initialised');
        
        callback();
        });
        
    });
   
    
   
}             
            
            
            
    
