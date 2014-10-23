var socket = io();
            
            

            $('form').submit(function() {
                socket.emit('chat message', $('#m').val());
                $('#m').val('');
                return false;
            });


            socket.on('ConnectionStatus', function(data) {
                document.getElementById('statusbar').innerHTML = data['item'] + ' = ' + data['status'] + '   ';
            });


            socket.on('AlarmZoneEventHandler', function(data) {

                //if(document.getElementById("checkbox2").checked == true && data['Event'].substring(data['Event'].length-3,data['Event'].length-2) != 3 && data['Event'].substring(data['Event'].length-3,data['Event'].length-2) != 4 && data['Event'].substring(data['Event'].length-3,data['Event'].length-2) != 5){

                if (document.getElementById("checkbox1").checked == true) {

                    if ($('#messages').children().length < 10) {
                        $('#messages').append($('<li>').text(data['Event'] + ' ' + data['Time']));
                    }
                    else {

                        $('#messages li').eq(0).remove();
                        $('#messages').append($('<li>').text(data['Event'] + ' ' + data['Time']));
                    }
                }
            });

            socket.on('AlarmPartitionEventHandler', function(data) {

                //if(document.getElementById("checkbox2").checked == true && data['Event'].substring(data['Event'].length-3,data['Event'].length-2) != 3 && data['Event'].substring(data['Event'].length-3,data['Event'].length-2) != 4 && data['Event'].substring(data['Event'].length-3,data['Event'].length-2) != 5){

                if (document.getElementById("checkbox2").checked == true) {

                    if ($('#messages').children().length < 10) {
                        $('#messages').append($('<li>').text(data['Event'] + ' ' + data['Time']));
                    }
                    else {

                        $('#messages li').eq(0).remove();
                        $('#messages').append($('<li>').text(data['Event'] + ' ' + data['Time']));
                    }
                }
            });


            socket.on('AlarmZoneEvent', function(data) {


                if (data['Description']) {

                    document.getElementById('labelzone' + data['Zone']).innerHTML = '<input type="radio" id="zone' + data['Zone'] + '" name="zone' + data['Zone'] + '" value="false">' + data['Description'];

                }

                if (data['Alarm_Event']) {
                    document.getElementById('labelzone' + data['Zone']).color = 'red';
                    if ($('#messages').children().length < 10) {
                        $('#messages').append($('<li>').text('Zone ' + data['Zone'] + ' went into alarm at ' + data['Alarm_Event']));
                    }
                    else {

                        $('#messages li').eq(0).remove();
                        $('#messages').append($('<li>').text('Zone ' + data['Zone'] + ' went into alarm at ' + data['Alarm_Event']));
                    }

                }





                checkUncheck('zone' + data['Zone'], data['Current_State']);

            });

            socket.on('AlarmPartitionEvent', function(data) {

                document.getElementById('partition1').innerHTML = data['Current_State'];



            });


            // $('#messages').append($('<li>').text(data['Zone'] + ' ' +data['Current_State']));


            //     <link rel="stylesheet" href="../CSS/Bootstrap/css/bootstrap.min.css">





            function checkUncheck(item, state) {

                if (state == 1) {
                    var elem = document.getElementById(item);
                    elem.style.color = "red";
                    elem.checked = true;

                }
                else if (state == 2) {

                    var elem = document.getElementById(item);
                    elem.style.color = "black";
                    elem.checked = false;

                }



            }


            /* function alarmcheck(){
        if(document.getElementById("checkbox1").checked == true)      
        {      
            socket.emit('AlarmConnect');     
        }      
        else if(document.getElementById("checkbox1").checked == false)      
        {      
            socket.emit('AlarmDisconnect');          
        }    

        
        
    }
    
    function eventcheck(){
        if(document.getElementById("checkbox2").checked == true)      
        {      
            socket.emit('EventConnect');     
        }      
        else if(document.getElementById("checkbox2").checked == false)      
        {      
           socket.emit('EventDisconnect');     
        } 
        
        
    }*/