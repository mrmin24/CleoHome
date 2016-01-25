
var db = require('./dbhandler');
var evaluate = require('../JSModules/Rule_Items_Evaluate');
var pushOver = require('./public/scripts/pushOver.js');
var intervaltime = 10 * 60 * 1000;



var mySensorio = require('socket.io-client');
var mySensorsocket = mySensorio.connect('http://localhost:'+ 44606);

var backup = 0;
const wingate = 939493;
const rietvlei = 961331;
const elardus = 1005976;
const moreletta = 8030071;

function start() {
    checkWeather(wingate);
    timerweather = setInterval(function(){

        checkWeather(wingate);

    },intervaltime);
    
}

function checkWeather(city){
    var http2 = require('http');
   
   
   // var header = { 'Authorization': auth};
    //'Host': 'https://ydns.eu/api/v1/update/?host=example.ydns.eu&ip='+ip,
   //api.openweathermap.org/data/2.5/weather?id=939493&APPID=fb7193e60adbb5ea7f2e618235d69cff
    var options = {//961331
      host: 'api.openweathermap.org',
      path: '/data/2.5/weather?id='+city+'&APPID=fb7193e60adbb5ea7f2e618235d69cff',//&ip='+ip.substring(0,15),
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
  	    //console.log(chunk);
  	    
  	    chunk = JSON.parse(chunk)
        if(chunk['cod'] == 200){
    		console.log('Weather Update: ' + chunk["wind"]['speed']);
    		
    		logData("Wind Speed", chunk["wind"]['speed']);
    		logData("Temperature",(chunk["main"]['temp_max']-273).toFixed(2));
    		//console.log('DNS Proxy Update: OK');
    		backup = 0;
        }else
        {
            
            error();
        }
  	});
  

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      
      error();
      
      
      
    });
  });

    req.end();	
//callback2();
}

function error(){
    
    if(backup == 0){
        backup++;
          console.log('checking backup ' + backup);
        checkWeather(elardus);
        
      }else if(backup == 1){
          backup++;
          console.log('checking backup ' + backup);
        checkWeather(moreletta);
        
      }else if(backup == 2){
          backup++;
          console.log('checking backup ' + backup);
        checkWeather(rietvlei);
        
      }else{
          console.log("No more backup weather locations available");
          logData("Wind Speed", 0);
          logData("Temperature",0);
      }
      
}

function logData(item,weatherData){
    
    
     data = {'Select':'Id','whereClause':'Item_Name = ' + '"' + item + '"'};
        
        db.getdata('Items',data,function(err,result){
           
           if(err){
               
               console.log(err);
           }else if(result){
               
             
             data = {'Set':'Item_Current_Value','Where':'Id','Current_State':weatherData ,'Name':result[0].Id};
                                
            db.update('Items',data,function(err,result){
                
                if(err){
                    console.log(err);
                }
            });   
            evaluate.evaluateChange(result[0].Id,weatherData,function(node,port,state,cancelTime,func){
                   eval(func);                                  
                 if(node && port && state){
                  mySensorsocket.emit('deviceSwitch',node,port,state);
                 }
                 
                 if(cancelTime){
                                 
                     mySensorsocket.emit('switchOff',node,port,0,cancelTime);
                 }
             //console.log(data_receive[0]);
             });
            }     
            
        });
         
}


           
exports.start = start;  