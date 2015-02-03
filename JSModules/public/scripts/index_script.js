    
    var socket = io();
    var eventdroptext = 10;
    
    var names = [];
    var eventdata = [];
   var dates = [];
   var alarmTriggers = [];
  var Rows = 0;
    var numEvents2 = 20;      
    var btnPress = false;
    var config;
  
   showAllEvents(numEvents2,false);
  

    
   $(function(){

    $(".dropdown-menu li a").click(function(){

      eventdroptext = $(this).text();
      $("#dropdownMenu1").text(eventdroptext );
     document.getElementById('dropdownMenu1').innerHTML +=  '<span class="caret"></span>';

        });

    });
    
     function switchHomeTab(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 col-lg-12');
        $("#Event_Panel").removeClass().addClass('col-xs-12 ');
        $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-4');
       // $("#event_dropdown_label").removeClass().addClass('hidden');
       //$("#event_dropdown_btn").removeClass().addClass('hidden');
        $("#event_controls").removeClass().addClass('well hidden');
        $("#alarm_controls").removeClass().addClass('well hidden');
        $("#Settings_Panel").removeClass().addClass('hidden');
        document.getElementById('checkbox4').checked = true;
         btnPress = false;
            $( "#accordion2" ).accordion({ active: false});
        $( "#accordion" ).accordion({active: false });
     }
     
     function settings(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 col-lg-12');
        $("#Event_Panel").removeClass().addClass('col-xs-12 ');
        $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-4');
       // $("#event_dropdown_label").removeClass().addClass('hidden');
       //$("#event_dropdown_btn").removeClass().addClass('hidden');
        $("#event_controls").removeClass().addClass('well hidden');
        $("#alarm_controls").removeClass().addClass('well hidden');
        $("#Settings_Panel").removeClass().addClass('col-xs-12 show');
        document.getElementById('checkbox4').checked = true;
         btnPress = false;
         
         
            
     }
    
  function checkbox4Click(){
      btnPress = false;
      
  }
     
     
     
     function switchEventsTab(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-2');
       // $("#event_dropdown_label").removeClass().addClass('show');
       // $("#event_dropdown_btn").removeClass().addClass('show');
        $("#event_controls").removeClass().addClass('well show');
        $("#alarm_controls").removeClass().addClass('well hidden');
        $("#Settings_Panel").removeClass().addClass('hidden');
         
     }
     
     function switchAlarmTab(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel").removeClass().addClass('col-xs-12');
        $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-4');
         $("#event_controls").removeClass().addClass('well hidden');
         $("#alarm_controls").removeClass().addClass('well show');
         $("#Settings_Panel").removeClass().addClass('hidden');
         
         
        // $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-2');
       // $("#event_dropdown_label").removeClass().addClass('show');
       // $("#event_dropdown_btn").removeClass().addClass('show');
       // $("#event_controls").removeClass().addClass('well show');
        
         
     }
     
     
     
     function showAllEvents(numEvents,btnpress){
        
         if(btnPress){
            document.getElementById("checkbox4").checked = true;
        }
         //console.log("getting events" + eventdroptext);
          btnPress = btnpress;
            
        
            var radioFragment = document.getElementById('event_container');
        
            radioFragment.innerHTML = "" ;
            eventdata.length = 0;

              dates.length = 0;
              
         if(!numEvents){
             socket.emit('getEvents',{numEvents:eventdroptext},function(err,data){});
         }else{
             socket.emit('getEvents',{numEvents:numEvents},function(err,data){});
         }
            
     }
     
     
     
     socket.on('sendEvents',function(data){
         var done = false;
          var rows = $('#event_container tr').length+1;
      
        
       
         Rows++;
        // console.log(Rows);
       
        if (document.getElementById("checkbox1").checked == true) 
        {
        
            if(data['Alarm'] == "Alarm")
            { 
                var newHtml = '<tr class = "danger"><td>'+ rows +'</td><td>'+data['Event_Type'] +'</td><td>'+ data['Event']+'</td><td>'+ data['Time'] +'</td></tr>';
                
            }else
            {
                var newHtml = '<tr><td>'+ rows +'</td><td>'+data['Event_Type'] +'</td><td>'+ data['Event']+'</td><td>'+ data['Time'] +'</td></tr>';
                
               
            }
            var radioFragment = document.getElementById('event_container');
            radioFragment.innerHTML =  newHtml + radioFragment.innerHTML ;
        
           
        
        }
     
         if((btnPress && Rows == eventdroptext) || (!btnPress && Rows == (numEvents2 - 1)) ){
             done = true;
             Rows = 0;
             
         }
        addEventGraph(data,done,true,"default",function(){ });
        
        
         
     });
     
     function addEventGraph(data,done,widetime,type,callback){
         //console.log(data['Event']);
         
         var oneMin = 60 * 1000;
         var startDate, endDate;
        
         var event = {};
         var stringarr = data['Event'].split(" - ");
         var stringarr2 = stringarr[0].split(" ");
         
        //console.log(stringarr2);
       // console.log(eventdata);
         var watchwords = ['Opened','Armed','Disarmed','Alarm!','Door'];
         var notwatchwords = ['Main Partition LED State','Alarm Connection Status'];
        
         if(notwatchwords.indexOf(stringarr[0]) == -1){
             console.log(stringarr[0]);
             if(watchwords.indexOf(stringarr[1]) > -1 || watchwords.indexOf(stringarr2[1]) > -1 || watchwords.indexOf(stringarr2[2]) > -1 || type == 'alarm'){
                var index = null;
               
                for(var j in eventdata){
                    
                    
                    if(eventdata[j]['name'] == stringarr[0]){
                        index = j;
                       // console.log(index);
                       // console.log(j);
                        break;
                    }
                
                   
                }
               // console.log(index);
                 dates.push(new Date(data['Time']));
                if(index > -1 && index != null){
                    eventdata[index].dates.push(new Date(data['Time']));
                }else{
                    
                    event.name =  stringarr[0];
                    event.dates = [];
                   
                    event.dates.push(new Date(data['Time']));
                    
                    eventdata.push(event);    
                }
                
                
                
            }
         }
         
       
            if((done && btnPress == false) || (done && document.getElementById('checkbox4').checked && btnPress == true)){
                
                if(btnPress){
                    document.getElementById('checkbox4').checked = false;
                }
                if(widetime){
                startDate=new Date(Math.min.apply(null,dates)-oneMin);
                endDate=new Date(Math.max.apply(null,dates)+oneMin);    
                
                
                setupEventGraph(startDate,endDate,type);
                
                }else
                {
                 setupEventGraph(null,null,type);   
                }
            }
        
        callback();
        
     }
     
     
     function showImportantEvents(){
         //console.log("getting events" + eventdroptext);
        if(btnPress){
            document.getElementById("checkbox4").checked = true;
        }
          eventdata.length = 0;

              dates.length = 0;
            var radioFragment = document.getElementById('event_container');
            radioFragment.innerHTML = "" ;
         socket.emit('getImportantEvents',{numEvents:eventdroptext},function(err,data){
            
             
             
         });
         
     }
     
     
     
     socket.on('sendImportantEvents',function(data){
          var done = true;
         var rows = $('#event_container tr').length+1;
          
        
        if (document.getElementById("checkbox3").checked == true) 
        {
         if(data['Alarm'] == "Alarm")
        { 
            var newHtml = '<tr class = "danger"><td>'+ rows +'</td><td>'+data['Event_Type'] +'</td><td>'+ data['Event']+'</td><td>'+ data['Time'] +'</td></tr>';
        }else
        {
            var newHtml = '<tr class = "warning"><td>'+ rows +'</td><td>'+data['Event_Type'] +'</td><td>'+ data['Event']+'</td><td>'+ data['Time'] +'</td></tr>';
            
        }
        
        var radioFragment = document.getElementById('event_container');
        radioFragment.innerHTML =  newHtml + radioFragment.innerHTML ;
        }
        
        
        
             
            
             
          if(data['Alarm'] == "Alarm")
        {
            addEventGraph(data,done,true,"alarm",function(){ });
        }
        else
        {
           addEventGraph(data,done,true,"important",function(){ }); 
        }
         
     });
     
     
     
     function showLastAlarm(){
         
        if(btnPress){
            document.getElementById("checkbox4").checked = true;
        }
        socket.emit('getLastAlarm',function(err,data){
            
             
             
         });
         
         
     }
     
     function armDisarmAlarm(type){
         //console.log("Arm / Disarm");
        socket.emit('armDisarmAlarm',type,function(err,data){   });
         
         
     }
     
     
     socket.on('bypassedZones', function(data) {
        
         
         for(var i in data){
                         
                        
           $('#zone0'+  data[i]).addClass("bypass-warning");
         //console.log('#zone0'+data[i]); 
        }
                    
       
    });
    
    
     
     function bypassAlarm(){
         
        var zones = [];
       
        
        $('button.active').each(function(){
            
             zones.push(this.id.substring(5,7));
            
             
        });
           // console.log(zones);  
           
        socket.emit('bypassZone',zones,function(err,ack,bypassedZones,cancelBypass){
            if(err){
                
                
            }else if(ack){
              //  console.log(bypassedZones);
              //  console.log(cancelBypass);
                for(var i in bypassedZones){
                    
                     
                   $('#zone0'+bypassedZones[i]).removeClass("active").addClass("bypass-warning");
                 
                }
                for(var i in cancelBypass){
                    
                     
                   $('#zone0'+cancelBypass[i]).removeClass("active bypass-warning ");
                 
                }
               
            } 
           
        });
         
        
        
         
         
     }
     
     socket.on('lastAlarmEvents',function(data){
         
         var rows = $('#event_container tr').length+1;
         
        if(data['Alarm'] == "Alarm")
        { 
            var newHtml = '<tr class = "danger"><td>'+ rows +'</td><td>'+data['Event_Type'] +'</td><td>'+ data['Event']+'</td><td>'+ data['Time'] +'</td></tr>';
        }else
        {
            var newHtml = '<tr><td>'+ rows +'</td><td>'+data['Event_Type'] +'</td><td>'+ data['Event']+'</td><td>'+ data['Time'] +'</td></tr>';
            
        }
        var radioFragment = document.getElementById('event_container');
        radioFragment.innerHTML =  newHtml + radioFragment.innerHTML ;


     });
     
    
    
    socket.on('AlarmZoneEventHandler', function(data) {
        if (document.getElementById("checkbox4").checked == true) 
        {
            addEventGraph(data,true,false,"default",function(){ });
        }
        if (document.getElementById("checkbox1").checked == true) 
        {
             
            addEvent(data['Type'],data['Event'],data['Time'],false);
             
        }
    });
    
    socket.on('AlarmPartitionEventHandler', function(data) {
    
        
        if (document.getElementById("checkbox2").checked == true) {
    
           addEvent(data['Type'],data['Event'],data['Time'],false);
        }
    });
    
    socket.on('ImportantEventHandler', function(data) {
    
         if (document.getElementById("checkbox4").checked == true) 
        {
            addEventGraph(data,true,false,"important",function(){ });
        }
        if (document.getElementById("checkbox3").checked == true) {
    
           addEvent(data['Type'],data['Event'],data['Time'],true);
        }
    });
    
    
    socket.on('AlarmZoneStatusEvent', function(data) {
    
    
        if (data['Description'] && data['Description'].substring(0,5) != "Spare" && (data['Description'].indexOf("Arm") === -1) && document.getElementById('zone' + data['Zone']) == null) 
        {
            
            addElement(data['Zone'],data['Description'],data['Current_State']);
          
            
        }
        
    
    
    });
    
    socket.on("alarmTrigger",function(data){
       console.log(data);
      showAlarmAlerts(data);
        
        
    });
    
     socket.on('AlarmZoneEvent', function(data) {
    
    
         checkUncheck('zone' + data['Zone'], data['Current_State']);
        
    
    
    });
    
    socket.on('AlarmPartitionStatusEvent', function(data){
    
        document.getElementById('partition1').innerHTML = data['Current_State'];
        
        if(data['Current_State'] == "Disarmed")
      {
          
          clearBypassStatus();
          
           socket.emit('clearBypassZone');
      }else if(data['Current_State'] == "Armed in Stay Mode"){
          $('#partition1').removeClass().addClass("label label-warning");
          
      }else if(data['Current_State'] == "Armed in Away Mode"){
          $('#partition1').removeClass().addClass("label label-danger");
          
      }else if(data['Current_State'] == "Ready"){
          $('#partition1').removeClass().addClass("label label-success");
          
      }
      
    
    });
    
    socket.on('AlarmPartitionEvent', function(data){
    
      document.getElementById('partition1').innerHTML = data['Current_State'];
      //console.log(data['Current_State']);
      if(data['Current_State'] == "Disarmed")
      {
          
          clearBypassStatus();
           socket.emit('clearBypassZone');
      }else if(data['Current_State'] == "Armed in Stay Mode"){
          $('#partition1').removeClass().addClass("label label-warning");
          
      }else if(data['Current_State'] == "Armed in Away Mode"){
          $('#partition1').removeClass("label-default label-success").addClass("label label-danger");
          
      }else if(data['Current_State'] == "Ready"){
          $('#partition1').removeClass().addClass("label label-success");
          
      }
      
    
    });
    
    socket.on('disconnect',function(){
        
       document.getElementById('blackout').style.display = 'inline-block'; 
        
    });
    
    socket.on('reconnect',function(){
        
       document.getElementById('blackout').style.display = 'none'; 
       location.reload(true);
       
       //res.redirect('/')
        
    });
    
    
     socket.on('keypadLedState', function(data){
        // console.log(data);
       if(data['Connected']){
           $('#alarm_connected').removeClass().addClass("label label-success");
           document.getElementById('alarm_blackout').style.display = 'none'; 
        }else{
          $('#alarm_connected').removeClass().addClass("label label-danger"); 
          document.getElementById('alarm_blackout').style.display = 'inline-block'; 
        }
       
        if(data['Bypass'])
        {
            $('#bypass').removeClass().addClass("label label-warning");
        }else{
          $('#bypass').removeClass().addClass("label label-default"); 
        }
        
        if(data['Memory'])
        {
            $('#memory').removeClass().addClass("label label-danger");
        }else{
           $('#memory').removeClass().addClass("label label-default"); 
        }
        
        if(data['Armed'])
        {
           $('#armed').removeClass().addClass("label label-danger");
           
           if(data['Night']){
            //console.log(data['Night']);
            $('#partition1').removeClass("label-default").addClass("btn-purple");
        
           
            }else {
           
                //console.log(data['Night']);
                $('#partition1').removeClass("btn-purple").addClass("label-default");
            }
            
            
            
            
        }else{
           $('#armed').removeClass().addClass("label label-default");
           
            if(data['Ready'])
            {
                $('#partition1').removeClass().addClass("label label-success");
            }else{
                $('#partition1').removeClass().addClass("label label-default"); 
            }
        }
        
       
        
        
        
        
     });
     
     socket.on('AlarmConnectionState',function(data){
         if(data['Status'] == 18){
             if(data['Connected'] == 1){
                $('#alarm_connected').removeClass().addClass("label label-success");
             }else{
               $('#alarm_connected').removeClass().addClass("label label-warning");  
             }
           document.getElementById('alarm_blackout').style.display = 'none'; 
        }else{
          $('#alarm_connected').removeClass().addClass("label label-danger"); 
          document.getElementById('alarm_blackout').style.display = 'inline-block'; 
        }
     });
     
     
     
        socket.on('battery',function(state){
            
            if(state){
                $('#battery').removeClass("label-danger").addClass("label-success");
            }else{
                $('#battery').removeClass("label-success").addClass("label-danger");
            }
            
            
        });
       
               
        socket.on('ac',function(state){
            
            if(state){
                $('#ac').removeClass("label-danger").addClass("label-success");
            }else{
                $('#ac').removeClass("label-success").addClass("label-danger");
            }
        });   
        
        
        socket.on('nightModeState',function(state){
            
            if(state){
                $('#night').removeClass("label-default").addClass("btn-purple");
            }else{
                $('#night').removeClass("btn-purple").addClass("label-default");
            }
        });   
            
        
       // console.log(data);
    
    
    socket.on("sendUsers",function(users){
        //console.log(users);
        var newusers = document.getElementById('userTableBody');
        var newHtml;
        for(var i in users){
            
              newHtml = '<tr><td>'+ users[i].id  +'</td><td>'+ users[i].username  +'</td></tr>';
              
             newusers.innerHTML += newHtml;
          
        }
       
       var table = $('#users_table').DataTable();
     
        $('#users_table tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        } );
     
        $('#Usr_Delete_Btn').click( function () {
            table.row('.selected').remove().draw( false );
        } );
        
        
    }) ;   
    
    socket.on('config',function(config_receive){
        
       // console.log(config_receive);
        config = config_receive;
        updateConfigPage();
        
        
    });
    
    
    
    //LOCAL FUNCTION START///////////////////////////////////////////////////////////////////////////////////////////////////////
    function updateConfigPage(){
        
       //console.log( $('#DNSEmail_Check').attr("checked"));
       
       //Server
       $('#DNSUpdate_Check').prop('checked',config.server[0].dnsupdate[0] == "true") ;
       $('#DNSEmail_Check').prop('checked',config.server[0].dnsemail[0] == "true");
       $('#DNSInt').val(config.server[0].dnsinterval[0]) ;
       
       //Email
       
       $('#EmailFrom').val(config.email[0].from[0]) ;
       $('#EmailTo').val(config.email[0].to[0]) ;
       $('#EmailCC').val(config.email[0].cc[0]) ;
       
       //Alarm
       
       $('#EnvisPass').val(config.alarm[0].envisPassword[0]) ;
       $('#AlmPass').val(config.alarm[0].password[0]) ;
       $('#AlmPrt').val(config.alarm[0].port[0]) ;
       $('#AlmIP').val(config.alarm[0].ip[0]) ;
       $('#AlmZones').val(config.alarm[0].zones[0]) ;
       $('#AlmPart').val(config.alarm[0].partitions[0]) ;
       $('#AlmAwayZone').val(config.alarm[0].awayArmZone[0]) ;
       $('#AlmStayZone').val(config.alarm[0].stayArmZone[0]) ;
       
       //Database
       
       $('#DBName').val(config.database[0].name[0]) ;
       $('#DBHost').val(config.database[0].host[0]) ;
       $('#DBUsername').val(config.database[0].user[0]) ;
       $('#DBPass').val(config.database[0].password[0]) ;
       
       
       //Authentication
       $('#tokentimeout').val(config.authentication[0].timeout[0]) ;
       
        
    }
    
    function saveConfig(){
       // config2 = {server:[],email:[],alarm:[],database:[],authentication:[]};
        //Server
       config.server[0].dnsupdate[0] = $('#DNSUpdate_Check').prop('checked').toString() ;
       config.server[0].dnsemail[0] = $('#DNSEmail_Check').prop('checked').toString();
       config.server[0].dnsinterval[0] = $('#DNSInt').prop('value') ;
       
       //Email
       
       config.email[0].from[0] = $('#EmailFrom').prop('value') ;
       config.email[0].to[0] = $('#EmailTo').prop('value') ;
       config.email[0].cc[0] = $('#EmailCC').prop('value') ;
       
       //Alarm
       
       config.alarm[0].envisPassword[0] = $('#EnvisPass').prop('value') ;
       config.alarm[0].password[0] = $('#AlmPass').prop('value') ;
       config.alarm[0].port[0] = $('#AlmPrt').prop('value') ;
       config.alarm[0].ip[0] = $('#AlmIP').prop('value') ;
       config.alarm[0].zones[0] = $('#AlmZones').prop('value') ;
       config.alarm[0].partitions[0] = $('#AlmPart').prop('value') ;
       config.alarm[0].awayArmZone[0] = $('#AlmAwayZone').prop('value') ;
       config.alarm[0].stayArmZone[0] = $('#AlmStayZone').prop('value') ;
       
       //Database
       
       config.database[0].name[0] = $('#DBName').prop('value') ;
       config.database[0].host[0] = $('#DBHost').prop('value') ;
       config.database[0].user[0] = $('#DBUsername').prop('value') ;
       config.database[0].password[0] = $('#DBPass').prop('value') ;
       
       
       //Authentication
       config.authentication[0].timeout[0] = $('#tokentimeout').prop('value') ;
        
        console.log(config.toString());
        
         socket.emit('updateconfig',config,function(err,ack){                  //testing purposes only
         
        });
    }
    
    
    
    
    
    $(document).ready(function() {
        
        socket.emit('getusers',function(){
        
        
        
        });
    } );
    
    
    
    
    function showAlarmAlerts(data){
        eventdata.length = 0;

              dates.length = 0;
        btnPress = true;
        document.getElementById('alarm_alert').style.display = 'inline-block'; 
         document.getElementById('Alarm_Alert_Btn_Container').style.display = 'inline-block'; 
        addEventGraph(data,true,true,"alarm",function(){ });
    }
    
    function restoreAlarmTrigger(){
         btnPress = false;
          document.getElementById('checkbox4').checked = true;
        document.getElementById('alarm_alert').style.display = 'none'; 
         document.getElementById('Alarm_Alert_Btn_Container').style.display = 'none'; 
        
    }
    
    function checkUncheck(item, state){
    
       
       
        
        if (state == 1) {
           
            var elem = document.getElementById(item);
            if(elem){
               //elem.style.color = "red";
                $('#'+item).removeClass("btn-default").addClass("btn btn-danger");
                 
            }            
        }
        else if (state == 2) {
    
            var elem = document.getElementById(item);
            if(elem){
                //elem.style.color = "black";
                $('#'+item).removeClass("btn-danger").addClass("btn btn-default");
            }
        }
        
        /*
       
       if (state == 1) {
            var elem = document.getElementById(item);
            if(elem){
                elem.style.color = "red";
                elem.checked = true;
            }            
        }
        else if (state == 2) {
    
            var elem = document.getElementById(item);
            if(elem){
                elem.style.color = "black";
                elem.checked = false;
            }
        }*/
    
    
    
    }
    
    function addElement(zone,description,state){
        
        
        if(state == 1)
        {
          // var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4  col-lg-2 btn btn-danger"> <input  type="checkbox" autocomplete="off" id="zone'+zone +'" name="zone'+zone +'" value="true" checked>'+description +'</label>'
           var newHtml = '<span class = "col-xs-6 col-md-4 col-lg-2" ><button id="zone'+zone +'" name="zone'+zone +'" type="button" class="btn btn-danger fullwidth" data-toggle="button" aria-pressed="false" autocomplete="off">'+description +'</button></span>';
        }
        else
        {
            
            var newHtml = '<span class = "col-xs-6 col-md-4 col-lg-2"><button id="zone'+zone +'" name="zone'+zone +'" type="button" class="btn btn-default fullwidth" data-toggle="button" aria-pressed="false" autocomplete="off"  >'+description +'</button></span>';
            
           // var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4 col-lg-2 btn btn-primary"> <input  type="checkbox" autocomplete="off" id="zone'+zone +'" name="zone'+zone +'" value="true">'+description +'</label>'
        }
        
        var radioFragment = document.getElementById('zone_container');
        radioFragment.innerHTML += newHtml;
         

        return ;
    }
    
    function addEvent(type,event,time,important){
       
        var rows = $('#event_container tr').length+1;
         
       if(important){
           
           var newHtml = '<tr class = "warning"><td>'+ rows+'</td><td>'+ type +'</td><td>'+ event +'</td><td>'+ time +'</td></tr>';
       }
       else
       {
        var newHtml = '<tr><td>'+ rows+'</td><td>'+ type +'</td><td>'+ event +'</td><td>'+ time +'</td></tr>';
       }
        var radioFragment = document.getElementById('event_container');
        radioFragment.innerHTML = newHtml + radioFragment.innerHTML;


        return ;
        
        
        
    }
    
    
    function clearBypassStatus(){
        
        $('button.bypass-warning').each(function(){
           // console.log(this.id);
             $('#'+this.id).removeClass("bypass-warning active");
            
             
            });
            
            return
    }
    
    
    
     
    function setupEventGraph(startTime,endTime,type){
     var chartPlaceholder = document.getElementById('chart_placeholder');
     var legend = $('legend').width();
   var widthnow = $(window).width()-legend;
   //console.log($('legend').width());
    
    var now = Date.now();   
    var oneHour = 60 * 60 * 1000;
    var oneMin = 60 * 1000;
    var fiveMin = 60 * 1000*5;
   // var endTime = Date.now() ;
    //var startTime = endTime - fiveMin;
    
    if(!startTime){startTime = new Date(now-fiveMin)};
    if(!endTime){endTime = new Date(now+fiveMin)};
    
    var color = d3.scale.category20();
    
  
    var graph = d3.chart.eventDrops()
        .start(startTime)
        .end(endTime)
        
        .eventColor(
            
            function (datum, index) {
                if(type == "default"){
                    colors = '#000000';
                }
                else if(type == "important"){
                 colors = '#66FF33';   
                }else if(type == 'alarm'){
                    colors = '#FF0000';   
                }
            return colors;
        })
        .width($(window).width()-100)
        .margin({ top: 60, left: 200, bottom: 30, right: 20 })
        .axisFormat(function(xAxis) {
            xAxis.ticks(5);
        })
        .hasBottomAxis(true)
        .eventHover(function(el) { 
            var series = el.parentNode.firstChild.innerHTML;
            var timestamp = d3.select(el).data()[0]
            document.getElementById('legend').innerHTML = 'Hovering [' + timestamp + '] in series "' + series + '"'; 
        });
        var element = d3.select(chartPlaceholder).datum(eventdata);
    graph(element);
     //console.log($('legend').width());
    return;
    
    
               
    }
    
    
    /**************************************************************************************************/
    function test(){
        
        socket.emit('test',function(err,ack){                  //testing purposes only
         return    
        });
        
        }
        
    /*****************************************************************************************************/
    
  $('#datepicker .input-daterange').datepicker({
     
    format: "dd/mm/yyyy",
    autoclose: true,
    todayHighlight: true
});
      


function showdatepicker1(){
    $('#datepicker1').datepicker('show')

       
}
function showdatepicker2(){
    $('#datepicker2').datepicker('show')

       
}