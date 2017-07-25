var Stream = require('node-rtsp-stream');


try{
  stream = new Stream({
    name: 'name',
    streamUrl: 'rtsp://192.168.2.200:554/user=admin&password=Cam33557722&channel=1&stream=0.sdp?real_stream',
    wsPort: 9999
  });

}catch(e){console.log(e)}