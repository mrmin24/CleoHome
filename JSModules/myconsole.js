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




function dumpError(err) {
  if (typeof err === 'object') {
    if (err.message) {
      console.log('\nMessage: ' + err.message)
    }
    if (err.stack) {
      console.log('\nStacktrace:')
      console.log('====================')
      console.log(err.stack);
    }
  } else {
    console.log('dumpError :: argument is not an object');
  }
}



exports.dumpError = dumpError;
exports.log = log;