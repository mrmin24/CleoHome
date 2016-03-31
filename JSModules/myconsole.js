var debug = 0;

process.argv.forEach(function (val, index, array) {
  if(index == 2){
     
     debug = val;
  }
});

function log(data) {
   // console.log(debug);
    if(debug > 0)
        console.log(data);
    
}

exports.log = log;