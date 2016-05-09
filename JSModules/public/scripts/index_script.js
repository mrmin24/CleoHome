    
    const Access_Type = 5;
    const Irrigation_Type = 6; 
    const Motion_Type = 7;
    const Power_Type = 10;
    const Network_Type = 20;
     const Virtual_Type = 15;
     const Virtual_Alarm_Type = 18;
    
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
    var selectedRow;
    var selectedRuleRow;
     var tabData;
     var distinct2 = [];
   
   const Last_Seen_Error = 601000;
   
    showAllEvents(numEvents2,false);
  var Items = null;
  
    j = 1;
    
    setUpDropdowns();
   
   $(function(){

    $(".dropdown-menu li a").click(function(){

      eventdroptext = $(this).text();
      console.log($(this));
          $("#dropdownMenuEvents").text(eventdroptext );
         document.getElementById('dropdownMenuEvents').innerHTML +=  '<span class="caret"></span>';

        });
        
     
 

    });
    
    $( document ).ready(function() {
       
        setUpDropdowns();
        getWeather();
        getPower();
         
    });
    
    
           
    function checkVisible(tab){   //check which containers must show on tab
      //  console.log(tabData);
        
         var unique = {};
         var container = [];
         
         
         for( var i in tabData ){
             
         
              
                 if(tabData[i].D1 == tab){
                   $("#"+ tabData[i].D2+"_Panel_Auto").removeClass().addClass('col-xs-12 col-lg-12');
                  container.push(tabData[i].D2);
                 }
                 else{
                    if(container.indexOf(tabData[i].D2) == -1)
                    $("#"+ tabData[i].D2+"_Panel_Auto").removeClass().addClass('hidden');
                }
                 unique[tabData[i].D2] = 0;
            // }
          
         }
         
         switchDefault();
        
        
        if(tab == 'Alarm'){
            
            switchAlarmTab();  //remove later
        }
        
        
        return;
        
    }
    
        
        
     function switchDefault(){                                                                //used to switch back from static tabs
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 col-lg-12');
        $("#Event_Panel").removeClass().addClass('col-xs-12 ');
        $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-4');
       
        $("#event_controls").removeClass().addClass('well hidden');
        $("#alarm_controls").removeClass().addClass('well hidden');
        $("#Settings_Panel").removeClass().addClass('hidden');
       
         
         $("#Nodes_Panel").removeClass().addClass('hidden');
         
          $("#Rules_Panel").removeClass().addClass('hidden');
          $("#Graphs_Panel").removeClass().addClass('hidden');
        document.getElementById('checkbox4').checked = true;
         btnPress = false;
            $( "#accordion2" ).accordion({ active: false});
        $( "#accordion" ).accordion({active: false });
        
        
        return;
     }
     
     
     
     function settings(){
         getusers();
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 col-lg-12');
        $("#Event_Panel").removeClass().addClass('col-xs-12 ');
        $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-4');
       // $("#event_dropdown_label").removeClass().addClass('hidden');
       //$("#event_dropdown_btn").removeClass().addClass('hidden');
        $("#event_controls").removeClass().addClass('well hidden');
        $("#alarm_controls").removeClass().addClass('well hidden');
        
         $("#Nodes_Panel").removeClass().addClass('hidden');
         
          $("#Rules_Panel").removeClass().addClass('hidden');
          $("#Graphs_Panel").removeClass().addClass('hidden');
        $("#Settings_Panel").removeClass().addClass('col-xs-12 show');
        document.getElementById('checkbox4').checked = true;
         btnPress = false;
         
         
         // $("[id$=_Panel_Auto]").removeClass().addClass('hidden');
          
          
          return;
     }
    
      function checkbox4Click(){
          btnPress = false;
          
          
          return;
          
      }
     
  
     function switchAlarmTab(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-2');
       // $("#event_dropdown_label").removeClass().addClass('show');
       // $("#event_dropdown_btn").removeClass().addClass('show');
        $("#event_controls").removeClass().addClass('well hidden');
        $("#alarm_controls").removeClass().addClass('well show');
        $("#Settings_Panel").removeClass().addClass('hidden');
         
         $("#Nodes_Panel").removeClass().addClass('hidden');
         $("#Rules_Panel").removeClass().addClass('hidden');
         $("#Graphs_Panel").removeClass().addClass('hidden');
         
         $("[id$=_Panel_Auto]").removeClass().addClass('hidden');
         
         
         return;
         
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
         
         $("#Nodes_Panel").removeClass().addClass('hidden');
         $("#Rules_Panel").removeClass().addClass('hidden');
         $("#Graphs_Panel").removeClass().addClass('hidden');
         
         $("[id$=_Panel_Auto]").removeClass().addClass('hidden');
         
         return;
         
      }
     
      function switchNodesTab(){
         $("#Alarm_Panel").removeClass().addClass('col-xs-12 ');
         $("#Event_Panel").removeClass().addClass('col-xs-12');
        $("#Event_Panel_Title").removeClass().addClass('panel-title col-xs-3  col-lg-4');
         $("#event_controls").removeClass().addClass('well hidden');
         $("#alarm_controls").removeClass().addClass('well hidden');
         $("#Settings_Panel").removeClass().addClass('hidden');
          
         $("#Nodes_Panel").removeClass().addClass('col-xs-12');
          $("#Rules_Panel").removeClass().addClass('hidden');
          $("#Graphs_Panel").removeClass().addClass('hidden');
          
           $("[id$=_Panel_Auto]").removeClass().addClass('hidden');
         socket.emit("getNodesStatus",function(){});
         
         
         return;
     }
     
     function switchRulesTab(){
         getrules();
         $("#Alarm_Panel").removeClass().addClass('hidden ');
         $("#Event_Panel").removeClass().addClass('hidden');
        $("#Event_Panel_Title").removeClass().addClass('hidden');
         $("#event_controls").removeClass().addClass('well hidden');
         $("#alarm_controls").removeClass().addClass('well hidden');
         $("#Settings_Panel").removeClass().addClass('hidden');
         
         $("#Nodes_Panel").removeClass().addClass('hidden');
         $("#Rules_Panel").removeClass().addClass('col-xs-12');
         $("#Graphs_Panel").removeClass().addClass('hidden');
         
       //   $("[id$=_Panel_Auto]").removeClass().addClass('hidden');
          
          return;
         
     }
     
     function switchGraphsTab(){
         console.log("Graphs");
        // getgraphs();
         $("#Alarm_Panel").removeClass().addClass('hidden ');
         $("#Event_Panel").removeClass().addClass('hidden');
        $("#Event_Panel_Title").removeClass().addClass('hidden');
         $("#event_controls").removeClass().addClass('well hidden');
         $("#alarm_controls").removeClass().addClass('well hidden');
         $("#Settings_Panel").removeClass().addClass('hidden');
        
         $("#Nodes_Panel").removeClass().addClass('hidden');
         $("#Rules_Panel").removeClass().addClass('hidden');
         $("#Graphs_Panel").removeClass().addClass('col-xs-12');
         
         
          $("[id$=_Panel_Auto]").removeClass().addClass('hidden');
          
          
          return;
         
     }
     
     
     $('#rulesAddModal').on('shown.bs.modal', function (e) {
      // do something...
      console.log("WHY");
        socket.emit('getItems',function(){ });
        
        
        
        
     
        socket.on('sendItems',function(items,alarm_items){ 
         //$('#item_options').value = '';
         
         Items = items;
         AlarmItems = alarm_items;
         for(var i = 0;i<items.length;i++)
         {
             $('#item_options').append('<li><a href="#">'+items[i]['Item_Name']+'</a></li>');
             $('#item_options_action').append('<li><a href="#">'+items[i]['Item_Name']+'</a></li>');
        
           // console.log(items[i]['Item_Name']);
         }
         
         for(var i = 0;i<AlarmItems.length;i++)
         {
             $('#item_options').append('<li><a href="#">'+AlarmItems[i]['Description']+'</a></li>');
             $('#item_options_action').append('<li><a href="#">'+AlarmItems[i]['Description']+'</a></li>');
        
           // console.log(items[i]['Item_Name']);
         }
         
         setUpDropdowns();
         
     });
    });
     
    
    
    $('#addAND').on( 'click', function() {
        j++;
        //var tablerowhtml = '<tr><td><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Item<span class="caret"></span></button><ul class="dropdown-menu scrollable-menu" role="menu" id="item_options" aria-labelledby="dropdownMenu1"><!--<li><a href="#">Action</a></li><li><a href="#">Another action</a></li><li><a href="#">Something else here</a></li><li><a href="#">Separated link</a></li>--></ul></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td></tr>';
        $("#if_Statements").append('<tr><th colspan="5" id="operator'+j+'"><strong>AND</strong></th></tr>');
        $("#if_Statements").append('<tr><td><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenuReq'+j+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Item <span class="caret"></span></button><ul class="dropdown-menu scrollable-menu" role="menu" id="item_options'+j+'" aria-labelledby="dropdownMenuReq'+j+'"></ul></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="equalsValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="greaterValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="lessValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="notEqualValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td align="center"><div class="input-group" style="display:inline-block; "><input id="secondaryRuleCheck'+j+'" type="checkbox" class="big-checkbox"></div></td><td><img src = "/resources/deleteicon.png" class="btnDelete" /></td></tr>');
        for(var i = 0;i<Items.length;i++)
         {
             $('#item_options'+j).append('<li><a href="#">'+Items[i]['Item_Name']+'</a></li>');
             
        
            console.log(Items[i]['Item_Name']);
         }
          for(var i = 0;i<AlarmItems.length;i++)
         {
          $('#item_options'+j).append('<li><a href="#">'+AlarmItems[i]['Description']+'</a></li>');
         
         }
        setUpDropdowns();
        
    });
    
    $('#addOR').on( 'click', function() {
       
        j++;
        //var tablerowhtml = '<tr><td><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Item<span class="caret"></span></button><ul class="dropdown-menu scrollable-menu" role="menu" id="item_options" aria-labelledby="dropdownMenu1"><!--<li><a href="#">Action</a></li><li><a href="#">Another action</a></li><li><a href="#">Something else here</a></li><li><a href="#">Separated link</a></li>--></ul></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td></tr>';
        $("#if_Statements").append('<tr><th colspan="5" id="operator'+j+'"><strong>OR</strong></th></tr>');
        $("#if_Statements").append('<tr><td><div class="dropdown"><button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenuReq'+j+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Item <span class="caret"></span></button><ul class="dropdown-menu scrollable-menu" role="menu" id="item_options'+j+'" aria-labelledby="dropdownMenuReq'+j+'"></ul></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="equalsValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="greaterValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="lessValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td><div class="input-group" style="display:inline-block; "><input type="text" id="notEqualValueReq'+j+'" class="form-control" placeholder="value" aria-describedby="basic-addon2"></div></td><td align="center"><div class="input-group" style="display:inline-block; "><input id="secondaryRuleCheck'+j+'" type="checkbox" class="big-checkbox"></div></td><td><img src = "/resources/deleteicon.png" class="btnDelete" /></td></tr>');
        for(var i = 0;i<Items.length;i++)
         {
             
             $('#item_options'+j).append('<li><a href="#">'+Items[i]['Item_Name']+'</a></li>');
             
        
            console.log(Items[i]['Item_Name']);
         }
         
          for(var i = 0;i<AlarmItems.length;i++)
         {
          $('#item_options'+j).append('<li><a href="#">'+AlarmItems[i]['Description']+'</a></li>');
         
         }
          setUpDropdowns();
         
       
    });
    
   
    
    function setUpDropdowns(){
       

            $(".dropdown-menu li a").click(function(){
                $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
                 $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
        
           });
        
        $(".btnDelete").bind("click", DeleteRow);
        
        
        return;
    }
    
    
    function saveRule(){
        
        var ruleData = {};
        
        
         ruleData['description'] = document.getElementById('ruleDescription').value;
        var k = 1;
        var next = 1;
        while(next<=j)
        {
            if($('#operator'+ next).text() || k == 1)
            {
               
            
            
                ruleData['dropdownMenuReq'+k] = $('#dropdownMenuReq'+next).text();
                ruleData['equalsValueReq'+k] = $('#equalsValueReq'+next).val();
                ruleData['greaterValueReq'+k] = $('#greaterValueReq'+next).val();
                ruleData['lessValueReq'+k] = $('#lessValueReq'+next).val();
                ruleData['notEqualValueReq'+k] = $('#notEqualValueReq'+next).val();
                ruleData['secondaryRuleCheck'+k] = $('#secondaryRuleCheck'+next).is(':checked')? 1:0;
                
                if(k > 1)
                {
                  ruleData['operator'+ k] = $('#operator'+ next).text();  
                    
                }
            }else
            {
                k--;
            }
            k++;
            next++;
            
        }
        
        
        ruleData['dropdownMenuAction1'] = $('#dropdownMenuAction1').text();
        ruleData['ActionValue1'] = $('#ActionValue1').val();
        ruleData['ActionOnValue1'] = $('#ActionOnValue1').val();
        ruleData['length'] = k-1;
        
        socket.emit('saveRule',ruleData);
        console.log(ruleData);
        
        return;
    }
    
    function deleteRule(){
			console.log("delete");
			console.log(selectedRuleRow[0].children[0].innerHTML);
		//	console.log(selectedRuleRow[0].children[1].innerHTML);
			socket.emit("deleteRule",selectedRuleRow[0].children[0].innerHTML);
			
            return;
		}
    
     function getWeather(){
        
        socket.emit('getWeather');
        return;
        
    }  
    
    function getPower(){
         
        socket.emit('getPower');
        
        return;
        
    }  
    
    
    
    socket.on('sendWeather',function(temp,wind,rain){
       
     $('#temp').html(temp);
     $('#wind').html(wind);
     $('#rain').html(rain);
     
        
    });
    
    socket.on('sendPower',function(pow1,pow2){
       
     $('#device128').html(pow1 + "A / " + (((pow1)*230)/1000).toFixed(2)  + 'KW');   //  document.getElementById('device' + data['Id']).innerHTML = data['Current_State'] + "A / " + (((data['Current_State'])*230)/1000).toFixed(2)  + 'KW';
     $('#device129').html(pow2 + "A / " + (((pow2)*230)/1000).toFixed(2)  + 'KW'); 
     
        
    });
    
    
    
    
    socket.on('speak',function(msg){
       
     speak(msg);
    
     
        
    });
    
    
    
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
         var watchwords = ['Opened','Armed','Disarmed','Alarm!','Door','Gate'];  //graph only graphs these event items if words are in description
         var notwatchwords = ['Main Partition LED State','Alarm Connection Status'];
        
         if(notwatchwords.indexOf(stringarr[0]) == -1){
             console.log(stringarr[0]);
             if(watchwords.indexOf(stringarr[1]) > -1 || watchwords.indexOf(stringarr2[1]) > -1 || watchwords.indexOf(stringarr2[2]) > -1 || type == 'alarm' ){
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
     
     socket.on('gatewayConnected',function(status){
        console.log("Gateway = " + status);
         if(status){
              $("#gatewayStatus").removeClass().addClass('label label-success');
         }else{
              $("#gatewayStatus").removeClass().addClass('label label-danger');
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
         console.log(type);
        socket.emit('armDisarmAlarm',type,function(err,data){
            
            if(err){
                console.log(err);
            }
            else
            {
                console.log(data);
            }
        });
         
         
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
     
     
     function panicAlarm(){
         socket.emit('panic',function(){});
         
     }
     
      socket.on("user_deleted",function(){
        
         $("<div>User Deleted!</div>" ).dialog();
    });
    
    socket.on("user_token_deleted",function(){
        //console.log("test");
         $( "<div>User Token Deleted!</div>" ).dialog();
        
    });
    
    socket.on("ruleDeleted",function(){
       
         $(" <div title='Rule Deleted'>Rule Deleted!</div>" ).dialog();
        //console.log(selectedRuleRow);
        selectedRuleRow.remove();
        
    });
     
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
    
   
    socket.on('PageTabs',function(data){
        
        tabData = data;
       // console.log(data);
        
            var unique = {};
            var distinct = [];
             var newHtml = '';
             
             var unique2 = {};
           
             var newHtml2 = '';
            for( var i in data ){
             if( typeof(unique[data[i].D1]) == "undefined"){
              distinct.push(data[i].D1);
              //console.log(distinct);
              
             }
             unique[data[i].D1] = 0;
              
            }
            
            
            for( var i in distinct ){ 
                
               newHtml += '<li onclick=checkVisible("'+distinct[i]+'")><a href="#" data-toggle="tab" >' + distinct[i] + '</a></li>';
             }
               //switch' + distinct[i]+ 'Tab()
                var radioFragment = document.getElementById('tabs');
                radioFragment.innerHTML =  newHtml + radioFragment.innerHTML ;
                 
         
            
            
        
            for( var i in data ){
             if( typeof(unique2[data[i].D2]) == "undefined"){
              distinct2.push(data[i].D2);
              //console.log(distinct);
              
             }
             unique2[data[i].D2] = 0;
              
            }
            
            
            for( var i in distinct2 ){ 
                
               newHtml2 += ' <div class = "col-xs-12 " id="'+ distinct2[i] +'_Panel_Auto">' 
                
                    + '<div class="panel panel-default"><div class="panel-heading"><strong>'+ distinct2[i] +'</strong>'
                            + '</div><div class="panel-body" id="'+ distinct2[i] +'_container"></div></div></div>'  ;
                            
                             
             }
               
            var eventHTML = ' <div class = "col-xs-12 "  id="Event_Panel">' + $("#Event_Panel").html(); + '</div';
           // console.log(eventHTML);
            
            $("#Event_Panel").remove();
          
                
             var radioFragment = document.getElementById('body');
                
             radioFragment.innerHTML =   radioFragment.innerHTML + newHtml2 + eventHTML ;
           
       
        
        
        
            checkVisible("Home");  
    });
    
    
    
    
    
    
    
    socket.on('DeviceStatusEvent', function(data) {     //get all items to populate page
        
        
        
        
      console.log(data);
         
              var newHtml = '';
              
                if(data.Current_State == 1)
                {
                  // var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4  col-lg-2 btn btn-danger"> <input  type="checkbox" autocomplete="off" id="zone'+zone +'" name="zone'+zone +'" value="true" checked>'+description +'</label>'
                   if(data.Item_Enabled_Value == 1){
                     newHtml = '<span class= "col-xs-12 col-md-6 col-lg-2 "><button id="device'+ data.Id +'" name="device'+ data.Id +'" type="button" class="btn btn-success btn.lg btn-block " data-toggle="button" aria-pressed="false" autocomplete="off" onclick="deviceSwitch('+ data.Id +')"><strong>'+ data.Device +'</strong></button></span>';
                   }
                   else
                   {
                     newHtml = '<span class= "col-xs-12 col-md-6 col-lg-2 "><button id="device'+ data.Id +'" name="device'+ data.Id +'" type="button" class="btn btn-danger btn.lg btn-block" data-toggle="button" aria-pressed="false" autocomplete="off" onclick="deviceSwitch('+ data.Id +')"><strong>'+ data.Device +'</strong></button></span>';
                   }
                }
                else
                {
                    
                     newHtml = '<span class= "col-xs-12 col-md-6 col-lg-2 "><button id="device'+ data.Id +'" name="device'+ data.Id  +'" type="button" class="btn btn-default btn.lg btn-block" data-toggle="button" aria-pressed="false" autocomplete="off" onclick="deviceSwitch('+ data.Id +')" ><strong>'+ data.Device +'</strong></button></span>';
                
                   // var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4 col-lg-2 btn btn-primary"> <input  type="checkbox" autocomplete="off" id="zone'+zone +'" name="zone'+zone +'" value="true">'+description +'</label>'
                }
                
              //  console.log(data.Item_Container + " " + data.Id);
                var radioFragment = document.getElementById(data.Item_Container + '_container');
                radioFragment.innerHTML += newHtml;
       
    
    });
    
    
    
     socket.on('NodeStatusEvent', function(data) {
         //console.log(new Date().getTime() - data['Current_State']);
         var time = new Date().getTime() - data['Current_State'];
          lastseen = (time/1000/60).toString();
          lastseen =  lastseen.substring(0, lastseen.indexOf('.'));
         
         if(time > Last_Seen_Error)
        {
         
         $('#node'+data['Id']).removeClass('btn btn-success').addClass('btn btn-danger');
        }else
        {
         $('#node'+data['Id']).removeClass("btn btn-danger").addClass('btn btn-success ');
        }
        
        
        $('#nodebadge'+data['Id']).html( lastseen);
        
        
        
     });
    
    socket.on("alarmTrigger",function(data){
       console.log(data);
      showAlarmAlerts(data);
        
        
    });
    
     socket.on('AlarmZoneEvent', function(data) {
    
    
         checkUncheck('zone' + data['Zone'], data['Current_State']);
        
    
    
    });
    
    socket.on('DeviceEvent', function(data) {
    
    
         checkUncheckDevice('device' + data['Id'], data['Current_State'],data['Item_Enabled_Value']);
        
    
    
    });
    
    socket.on('SensorEvent', function(data) {
    
    
       // console.log(data);
        document.getElementById('device' + data['Id']).innerHTML = data['Current_State'] + "A / " + (((data['Current_State'])*230)/1000).toFixed(2)  + 'KW';
    
    
    });
    
    
    
    
    socket.on('AlarmPartitionStatusEvent', function(data){
    
        document.getElementById('partition1').innerHTML = data['Current_State'];
        
        if(data['Current_State'] == "Disarmed")
      {
          
          clearBypassStatus();
          
          socket.emit('clearBypassZone');
           //socket.emit('clearNightMode');
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
          //  socket.emit('clearNightMode');
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
     
     
     
      /*  socket.on('battery',function(state){
            
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
        */
        
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
         newusers.innerHTML = '';
        var newHtml;
        for(var i in users){
            
              newHtml = '<tr><td>'+ users[i].id  +'</td><td>'+ users[i].username  +'</td></tr>';
              
             newusers.innerHTML += newHtml;
          
       if(i == users.length - 1)
        setusertable();
        }
        
        
    }) ;   
    
    
    
    socket.on("sendRules",function(rules){
        //console.log(rules);
        var newrules = document.getElementById('rulesTableBody');
         newrules.innerHTML = '';
        var newHtml;
        for(var i in rules){
            
              newHtml = '<tr><td>'+ rules[i].Id  +'</td><td>'+ rules[i].Comments  +'</td></tr>';
              
             newrules.innerHTML += newHtml;
          
       if(i == rules.length - 1)
        setrulestable();
        }
        
        
    }) ;  
    
    
    
    
    
    function graphd3(data,axis_text){
        
        //var data = {"step_plot_4": {"x_axis": ["12-Jul-14", "14-Jul-14", "16-Jul-14", "18-Jul-14", "20-Jul-14", "22-Jul-14", "24-Jul-14", "26-Jul-14", "28-Jul-14", "30-Jul-14", "01-Aug-14"], "y_axis": [0, 3.7399996781255571, 4.1165090983021901, 5.2234708249494757, 3.3339103629814177, 3.7140085760060746, 4.3276262114041755, 6.8512925627236267, 3.6917800293224392, 4.3655969051243977, 4.0856638509855392]}}  


        /* Format data into a D3.js acceptable format. */
            var parseDate = d3.time.format("%d-%b-%y %H:%M:%S %p").parse,
                bisectDate = d3.bisector(function(d) { return d.x; }).left;
        
            var graph_data = data["step_plot_4"];
            var x_axis = graph_data["x_axis"];
            //var x_axis2 = graph_data["x_axis2"];
            var y_axis = graph_data["y_axis"];
        
            var formatted_data = [];
            for (var i = 0; i < x_axis.length; i++){
                formatted_data[i] = {"x": parseDate(x_axis[i]), "y": +y_axis[i]};
            };
        
        
            /* Graph related details */
            var margin = {top: 20, right: 40, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
        
            var x = d3.time.scale()
                    .range([0, width]);
        
            var y = d3.scale.linear()
                    .range([height, 0]);
        
            var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
        
            var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");
        
            var line = d3.svg.line()
                    .x(function (d) {
                           return x(d.x);
                       })
                    .y(function (d) {
                           return y(+d.y);
                       })
                    .interpolate("step-after");   //https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-line
        
            var svg = d3.select("#graphs_container").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
            svg.append("clipPath").attr("id", "canvasClip")
            .append("rect")
            .attr("height", height)
            .attr("width", width)
        
            x.domain(d3.extent(x_axis, function (d) {
                return parseDate(d);
            }));
        
            y.domain([d3.min(y_axis) - d3.min(y_axis)/10, d3.max(y_axis) + d3.max(y_axis)/10]);
        
            svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("Date");
        
            svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(axis_text);
        
            svg.append("path")
                    .datum(formatted_data)
                    .attr("class", "line")
                    .attr("d", line)
            .attr("clip-path", "url(#canvasClip)")
        
            var focus = svg.append("g")
              .attr("class", "focus")
              .style("display", "none");
        
            focus.append("circle")
              .attr("r", 4.5);
        
            focus.append("text")
              .attr("x", 9)
              .attr("dy", ".35em");
        
            svg.append("rect")
              .attr("class", "overlay")
              .attr("width", width)
              .attr("height", height)
              .on("mouseover", function() { focus.style("display", null); })
              .on("mouseout", function() { focus.style("display", "none"); })
              .on("mousemove", mousemove);
        
            function mousemove() {
              var x0 = x.invert(d3.mouse(this)[0]),
                  i = bisectDate(formatted_data, x0, 1),
                  d0 = formatted_data[i - 1],
                  d1 = formatted_data[i],
                  d = x0 - d0.x > d1.x - x0 ? d1 : d0;
              focus.attr("transform", "translate(" + x(d.x) + "," + y(d.y) + ")");
              focus.select("text").text(d.y);
          }
  
  
  
    }
    
    
    socket.on("sendGraphs",function(graphs){
        
     
      //  console.log(graphs.sort());
        var data2 = [[],[]];
        var nodes = [];
        var ports = [];
        var nodes_ports = [];
        function compareNode(a,b) {
            node1 = JSON.parse(a.Event).node;
            node2 = JSON.parse(b.Event).node;
            
          if (node1 > node2)
            return 1;
          if (node1 < node2)
            return -1;
          return 0;
        }
        
        function comparePort(a,b) {
            port1 = JSON.parse(a.Event).port;
            port2 = JSON.parse(b.Event).port;
           
          if (port1 > port2)
            return 1;
          if (port1 < port2)
            return -1;
          return 0;
        }
        
        
        //*** This code is copyright 2002-2003 by Gavin Kistner, !@phrogz.net
//*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
//*** Reuse or modification is free provided you abide by the terms of that license.
//*** (Including the first two lines above in your source code satisfies the conditions.)

// Include this code (with notice above ;) in your library; read below for how to use it.

function customFormat(formatString,date){
	var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
	var dateObject = date;
	YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
	MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
	MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
	DD = (D=dateObject.getDate())<10?('0'+D):D;
	DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
	th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
	formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

	h=(hhh=dateObject.getHours());
	if (h==0) h=24;
	if (h>12) h-=12;
	hh = h<10?('0'+h):h;
	AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
	mm=(m=dateObject.getMinutes())<10?('0'+m):m;
	ss=(s=dateObject.getSeconds())<10?('0'+s):s;
	return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
}

        
        function compare(a,b) {
             node1 = JSON.parse(a.Event).node;
            node2 = JSON.parse(b.Event).node;
            
          if (node1 > node2)
            return 1;
          if (node1 < node2)
            return -1;
         
         if(node1 == node2)
         {
            port1 = JSON.parse(a.Event).port;
            port2 = JSON.parse(b.Event).port;
           
          if (port1 > port2)
            return 1;
          if (port1 < port2)
            return -1;
            
          if(port1 == port2){
              
            time1 = a.TimeStamp;
            time2 = b.TimeStamp;
           
          if (time1 > time2)
            return 1;
          if (time1 < time2)
            return -1;
            
            if(time1 == time2){
              id1 = a.Id;
              id2 = b.Id;
               
              if (id1 > id2)
                return 1;
              if (id1 < id2)
                return -1;
                
                return 0;
                
            }    
         
              
          }  
            
            
          
         }
         
          
          
          
          
             
        }
        
       // graphs.sort(compareNode);
        
       // graphs.sort(comparePort);
        graphs.sort(compare);
       // console.log(graphs);
        var old_node = -1;
        var old_port = -1;
        var count = -1;
        var count2 = -1;
        var newdata = [];
        var labels = [[],[]];
        var axis = "";
        
        for(var j = 0;j < graphs.length;j++){
            var node2 = JSON.parse(graphs[j].Event).node;
           
            if(node2 != old_node){
                nodes.push(j);
                old_node = node2;
                
             while(JSON.parse(graphs[j].Event).node == old_node){
                 port =  JSON.parse(graphs[j].Event).port;
                
                   old_port = port;
                   
                  while(JSON.parse(graphs[j].Event).port == old_port){
                      if(graphs[j].Type == 'Power'){
                       newdata.push(parseInt((JSON.parse(graphs[j].Event).value * 230).toFixed(2)));  //power multiply
                       axis = "watt";
                      }
                      if(graphs[j].Type == 'RainRate'){
                          newdata.push(parseInt((JSON.parse(graphs[j].Event).value * 2).toFixed(2)));  //rain factor
                          axis = "mm";
                         // console.log(newdata);
                      }
                       j++;
                     
                       if(j < graphs.length){
                             continue;
                         }
                         else
                         {  
                             break;
                         }
                         
                  }
                  
                
                     
                      count++; 
                      
                   
                function pushArray(arr, arr2) {
                    arr.push.apply(arr, arr2);
                }
                 
                
              
                 if(j < graphs.length){
                    
                       //console.log(newdata); 
                      pushArray(data2[count],newdata);
                      newdata.length = 0;
                      nodes_ports.push([old_node,port]);
                     
                     continue;
                 }
                 else
                 {  // console.log(newdata);
                      pushArray(data2[count],newdata);
                      newdata.length = 0;
                     
                     
                      old_port = -1;
                     break;
                 }
                 
             }
             
                
            } 
            
        }
        
        
            for(var k = 0;k < data2[0].length;k++){
               
                var d = new Date(graphs[k].TimeStamp);
                labels[0][k] = customFormat("#DD#-#MMM#-#YY# #h#:#mm#:#ss# #AMPM#",d);
              
            }
   
       
   
        
   var data3 = {"step_plot_4": {"x_axis": labels[0], "y_axis": data2[0] }}
 
   
  
   
        graphd3(data3,axis);  
        
     
    }) ;  
    
    
  
    socket.on('config',function(config_receive){
        
       // console.log(config_receive);
        config = config_receive;
        updateConfigPage();
        
        
    });
    
    function refreshIP(){
         socket.emit('refreshIP');
        
    }
    
    
    
    
    
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
       
       //PushOver
       $('#pushUser').val(config.pushOver[0].user[0]) ;
       $('#pushToken').val(config.pushOver[0].token[0]) ; 
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
       
       //PushOver
       config.pushOver[0].user[0] = $('#pushUser').prop('value') ;
       config.pushOver[0].token[0] = $('#pushToken').prop('value') ;
        
        console.log(config.toString());
        
         socket.emit('updateconfig',config,function(err,ack){                  //testing purposes only
         
        });
    }
    
   
    
    
    
    
    
    function getusers(){
        
        socket.emit('getusers',function(){  });
    }
    
    function getrules(){
        
        socket.emit('getrules',function(){  });
    }
    
    
    function getgraphs(type){
        console.log(type);
        socket.emit('getgraphs',type,function(){  });
    }
    
    
    function setusertable(){
        
        var table = new $('#users_table').DataTable();
     
        $('#users_table tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedRow = $(this);
                
            }
        } );
     
        $('#Usr_Delete_Btn').click( function () {
           socket.emit("delete_user",selectedRow[0].children[0].innerHTML,selectedRow[0].children[1].innerHTML);
            
            
        } );
        
        $('#Usr_Token_Delete_Btn').click( function () {
           socket.emit("delete_user_token",selectedRow[0].children[1].innerHTML);
            
            
        } );
        
        
        
    }
    
    
    function setrulestable(){
        
        var table = new $('#rules_table').DataTable();
     
        $('#rules_table tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                selectedRuleRow = $(this);
                
            }
        } );
     
       
        
        $('#Rules_Edit_Btn').click( function () {
           //socket.emit("delete_user_token",selectedRow[0].children[1].innerHTML);
            //console.log(selectedRow[0].children[0].innerHTML);
            //table.row('.selected').remove().draw( false );
            
        } );
        $('#Rules_Add_Btn').click( function () {
           // $('#rulesAddModal').appendTo("body").modal('show');
           //$('#rulesAddModal').modal('show');
           //socket.emit("delete_user_token",selectedRow[0].children[1].innerHTML);
            //console.log(selectedRow[0].children[0].innerHTML);
            //table.row('.selected').remove().draw( false );
            
        } );
        
        
        
    }
    
    
    
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
        
        
       
       
    
    }
    
    function addElement(zone,description,state){    //remove when alarm is auto generated
        
        
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
    
   
    function checkUncheckDevice(item, state,enabledState){
    
       
       
        
        if (state == 1) {
           
            var elem = document.getElementById(item);
            if(elem){
               //elem.style.color = "red";
               if(enabledState == 1){
                $('#'+item).removeClass("btn-default").addClass("btn btn-success");
               }else{
                   $('#'+item).removeClass("btn-default").addClass("btn btn-danger");
               }
                 
            }            
        }
        else if (state == 0) {
    
            var elem = document.getElementById(item);
            if(elem){
                //elem.style.color = "black";
                $('#'+item).removeClass("btn-success btn-danger").addClass("btn btn-default");
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
    
    
    
    function deviceSwitch(Id){
        
            console.log("Switch :" + Id);
            socket.emit('deviceSwitch',Id);
            
            
        
    }
    
    
    
    function addNodes(id,device,state/*,NodeID,NodePort*/){
       // console.log(new Date().getTime() - state);
      //  console.log( state);
      var time = new Date().getTime() - state;
      lastseen = (time/1000/60).toString();
      lastseen =  lastseen.substring(0, lastseen.indexOf('.'));
        if(time > Last_Seen_Error)
        {
          // var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4  col-lg-2 btn btn-danger"> <input  type="checkbox" autocomplete="off" id="zone'+zone +'" name="zone'+zone +'" value="true" checked>'+description +'</label>'
           var newHtml = '<span class = "col-xs-6 col-md-4 col-lg-2" ><button id="node'+ id +'" name="node'+ id +'" type="button" class="btn btn-danger fullwidth" data-toggle="button" aria-pressed="false" autocomplete="off" style="white-space: normal" >'+ device +'    ' + '<span class="badge" id = "nodebadge'+id+'">'+ lastseen + ' </span> </button></span>';
        }
        else
        {
            
            var newHtml = '<span class = "col-xs-6 col-md-4 col-lg-2"><button id="node'+ id +'" name="node'+ id +'" type="button" class="btn btn-success fullwidth" data-toggle="button" aria-pressed="false" autocomplete="off"  style="white-space: normal" >'+ device +'    '+ '<span class="badge" id = "nodebadge'+id+'">'+ lastseen + ' </span> </button></span>';
            
           // var newHtml = '<label id="labelzone'+zone +'" class="col-xs-6 col-md-4 col-lg-2 btn btn-primary"> <input  type="checkbox" autocomplete="off" id="zone'+zone +'" name="zone'+zone +'" value="true">'+description +'</label>'
        }
        
        
        
        
        var radioFragment = document.getElementById('nodes_container');
        radioFragment.innerHTML += newHtml;
        // console.log( radioFragment.innerHTML);

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
    
    
    function DeleteRow(){
        
        var par = $(this).parent().parent(); 
       
         var par2 = $(this).parent().parent().prev()[0]; 
         par.remove();
         
        
        
         par2.remove();
         
       
        
        
    }; 
    
    
    function speak(message){
        
      var msg = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(msg);

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
       // $( "<div>hello!</div>" ).dialog();
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
