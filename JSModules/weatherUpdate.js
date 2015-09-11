updateweather();

function updateweather(){
    var http2 = require('http');
   
   
   // var header = { 'Authorization': auth};
    //'Host': 'https://ydns.eu/api/v1/update/?host=example.ydns.eu&ip='+ip,
   
    var options = {
      host: 'api.openweathermap.org',
      path: '/data/2.5/weather?id=939493&APPID=fb7193e60adbb5ea7f2e618235d69cff',//&ip='+ip.substring(0,15),
     // host: 'www.trickbyte.com',
      //path: '/autoupdate.php?email=mariusminny@gmail.com&hash=ff157a4e40705b686babbcf03d3c54e3',//&ip='+ip.substring(0,15),
      // host: 'smartdns.cactusvpn.com',
      //path: '/index.php?smartkey=efcbfcb0efcbd8189fa123d2337c9645',//&ip='+ip.substring(0,15),
      
      port: '80'
      //This is the only line that is new. `headers` is an object with the headers to request
     // headers: header 
    };
    
  var req = http2.request(options, function(res) {
  //	console.log('STATUS: ' + res.statusCode);
  //	console.log('HEADERS: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
    		console.log('Weather Update: ' + chunk);
    		//console.log('DNS Proxy Update: OK');
  	});
  });

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();	
//callback2();
    
}