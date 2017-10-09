var myconsole = require('./myconsole.js');

exports.json2xml = function(json, root, cb){
	var recursion = 0;
	var xml = '' ;
	var isArray = function(obj) { return obj.constructor == Array; };
	
	var parseAttributes = function(node){
		for(var key in node){
			var value = node[key];
			
			if(value == '<') value = '&lt;';
			if(value == '>') value = '&gt;';
			
			xml += ' ' + key +'="'+ value +'"';
		};
	xml += '>';
	};
	
	var parseNode = function(node, parentNode){
	    
		recursion++;
		// Handle Object structures in the JSON properly
		if(!isArray(node)){
			xml += '<'+ parentNode;
			if(typeof node == 'object' && node['@']){
				parseAttributes(node['@']);
			} else {
				xml += '>';
			}
			for(var key in node){
				var value = node[key];
				if(value == '<') value = '&lt;';
			    if(value == '>') value = '&gt;';
				// text values
				if(typeof value == 'string'){
					if(key === '#'){
					    xml += value;
					} else {
					    //myconsole.log(key);
						xml +=  value ;
					}
				}
				// is an object
				if(typeof value == 'object' && key != '@'){
					parseNode(node[key], key);
				}
			}
			recursion--;
			xml += '</'+ parentNode +'>';
		}
		
		// Handle array structures in the JSON properly
		if(isArray(node)){
			for(var i=0; i < node.length; i++){
				parseNode(node[i], parentNode);
			}
			recursion--;
		}
		
		if (recursion === 0) {
		    
		    var fs = require('fs');
		    
		    fs.writeFile('./config.xml',xml, function(err, data) {
                if(err)
                    myconsole.log(err);
               
                if (err) throw err;
                 {   myconsole.log('It\'s saved!');
                
                
                    cb(xml);
                 }
            });
		    
		    
		}
	};
	parseNode(json, root); // fire up the parser!
};