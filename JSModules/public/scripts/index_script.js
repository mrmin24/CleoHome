    
    var socket = io();
    var eventdroptext = 10;
    
    
    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    
   /* $(".dropdown-menu li a").click( function() {
        eventdroptext = $(this).text();
        
        $("#dropdownMenu1").text(eventdroptext);
         //$("#dropdownMenu1").innerHTML +=  '<span class="caret"></span>';
        
        console.log(eventdroptext);
        //alert(eventdroptext);
    });*/
    
   $(function(){

    $(".dropdown-menu li a").click(function(){

      eventdroptext = $(this).text();
      $("#dropdownMenu1").text(eventdroptext );
     document.getElementById('dropdownMenu1').innerHTML +=  '<span class="caret"></span>';

        });

    });
    
     function switchHomeTab(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-7 col-lg-12');
        $("#Event_Panel").removeClass().addClass('col-xs-3 col-md-4');
        $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-4');
       // $("#event_dropdown_label").removeClass().addClass('hidden');
       //$("#event_dropdown_btn").removeClass().addClass('hidden');
        $("#event_controls").removeClass().addClass('well hidden');
     }
    
    function switchAlarmTab(){
         
         alert("yay");
     }
     
     
     function switchEventsTab(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-2');
       // $("#event_dropdown_label").removeClass().addClass('show');
       // $("#event_dropdown_btn").removeClass().addClass('show');
        $("#event_controls").removeClass().addClass('well show');
        
         
     }
     
     function showevents(){
         //console.log("getting events" + eventdroptext);
          
            var radioFragment = document.getElementById('event_container');
            radioFragment.innerHTML = "" ;
         socket.emit('getEvents',{numEvents:eventdroptext},function(err,data){
            
             
             
         });
         
     }
     
     
     
     socket.on('sendEvents',function(data){
         
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
     
     function showlastalarm(){
        socket.emit('getLastAlarm',function(err,data){
            
             
             
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
     
    
    socket.on('ConnectionStatus', function(data) {
       
    });
    
    
    socket.on('AlarmZoneEventHandler', function(data) {
    
       
        if (document.getElementById("checkbox1").checked == true) 
        {
            addEvent(data['Type'],data['Event'],data['Time']);
        }
    });
    
    socket.on('AlarmPartitionEventHandler', function(data) {
    
        
        if (document.getElementById("checkbox2").checked == true) {
    
           addEvent(data['Type'],data['Event'],data['Time']);
        }
    });
    
    
    socket.on('AlarmZoneStatusEvent', function(data) {
    
    
        if (data['Description'] && data['Description'].substring(0,5) != "Spare" && document.getElementById('labelzone' + data['Zone']) == null) 
        {
            
            addElement(data['Zone'],data['Description'],data['Current_State']);
            
        }
        
    
    
    });
    
     socket.on('AlarmZoneEvent', function(data) {
    
    
         checkUncheck('zone' + data['Zone'], data['Current_State']);
        
    
    
    });
    
    socket.on('AlarmPartitionStatusEvent', function(data) 
    {
    
        document.getElementById('partition1').innerHTML = data['Current_State'];
    
    });
    
    socket.on('AlarmPartitionEvent', function(data) 
    {
    
        document.getElementById('partition1').innerHTML = data['Current_State'];
    
    });
    
    
    
    function checkUncheck(item, state) {
    
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
        }
    
    
    
    }
    
    function addElement(zone,description,state){
        
        
        if(state == 1)
        {
            var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4  col-lg-2"> <input   type="radio" id="zone'+zone +'" name="zone'+zone +'" value="true" checked>'+description +'</label>'
        }
        else
        {
            var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4 col-lg-2"> <input   type="radio" id="zone'+zone +'" name="zone'+zone +'" value="true">'+description +'</label>'
        }
        
        var radioFragment = document.getElementById('zone_container');
        radioFragment.innerHTML += newHtml;
        

        return ;
    }
    
    function addEvent(type,event,time){
       
        var rows = $('#event_container tr').length+1;
         
       
            var newHtml = '<tr><td>'+ rows+'</td><td>'+ type +'</td><td>'+ event +'</td><td>'+ time +'</td></tr>';
    
        var radioFragment = document.getElementById('event_container');
        radioFragment.innerHTML = newHtml + radioFragment.innerHTML;


        return ;
        
        
        
    }
    