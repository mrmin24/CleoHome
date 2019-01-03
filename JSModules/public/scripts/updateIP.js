var getconfig = require('../../GetConfig.js');
var configure = getconfig.data;
var configure2 = configure.xml;
var myconsole = require('../../myconsole.js');
var pushOver = require('./pushOver.js');
var debug = 0;
var externalip = "127.0.0.1";
var oldip;
process.argv.forEach(function (val, index, array) {
  if(index == 2){
     
     debug = val;
  }
});

exports.update = function(){
    oldip = externalip;
         myconsole.log("Ip try");
       getip(function(ip){
        
        if(ip){
       externalip = ip;
       
        //myconsole.log("Ip Sent");
        //updatednshome(ip,function(){});
        	if(oldip != externalip)
        	{
        	     pushOver.push(ip);
        	     myconsole.log("Ip Sent");
             if(configure2.server[0].dnsupdate[0] == 'true')  {
        		   // updatedns(ip,function(){});
        		    updatednshome(ip,function(){});  
             }
    		 
    		 //if(configure2.server[0].dnsemail[0] == 'true')  
    		  //  sendemail("Your current IP is http://" + ip);   
    		    
    		// if(configure2.server[0].dnsproxy[0] == 'true')  
    		  // updatednsproxy(function(){});   
		       
		      oldip = externalip;   
        	
		    }
	
	}
        
        
    });
};
    
function getip(callback){
   
   require('http').request({
    hostname: 'myexternalip.com',
    path: '/raw',
    agent: false
    }, function(res) {
    if(res.statusCode != 200) {
        throw new Error('non-OK status: ' + res.statusCode);
    }
    res.setEncoding('utf-8');
    var ipAddress = '';
    res.on('data', function(chunk) {
        ipAddress += chunk;
      myconsole.log(chunk);
     pushOver.push(ipAddress);
     callback(ipAddress); 
        
    });
     
    res.on('end', function() {
     // ipAddress contains the external IP address
    });
    }).on('error', function(err2) {
    throw err2;
}).end();
   


}

function updatednshome(ip,callback2){
    
    var http2 = require('http');
    //var username = configure2.server[0].dnsusername[0];
   // var password = configure2.server[0].dnspassword[0];
    //var pass = configure2.server[0].dnspassword2[0];
    //var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
   // var header = { 'Authorization': auth};
    //curl "http://dyn.example.com:password@dyn.dns.he.net/nic/update?hostname=dyn.example.com&myip=192.168.0.1
   myconsole.log("Update DynU");
    var options = {
      host: 'https://api.dynu.com',  //wget "http://api.dynu.com/nic/update?myip=198.144.117.32&myipv6=2604:4400:a:8a::f4&username=someusername&password=098f6bcd4621d373cade4e832627b4f6"
      path: '/v2/dns \
        -H "accept:application/json" \
        -H "API-Key:cK8MRDSS9cKv97729gNM1DNX1aU98hUK"',//&ip='+ip.substring(0,15),
      port: 80,
      method: 'GET'
      //This is the only line that is new. `headers` is an object with the headers to request
    //  headers: header 
    };
    
  var req = http2.request(options, function(res) {
  //	myconsole.log('STATUS: ' + res.statusCode);
  //	myconsole.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    		myconsole.log('DynU DNS Update2: ' + chunk);
  	});
  });

req.on('error', function(e) {
  myconsole.log('problem with DynU request: ' + e.message);
});

// write data to request body
//req.write('data\n');
//req.write('data\n');
req.end();	
callback2();

}