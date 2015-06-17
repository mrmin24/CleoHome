/*
 * GET home page.
 */
 
exports.index = function(req, res){
   
  res.render('index.html');
}

exports.stylesheet = function(req, res){
   
  res.sendFile('/stylesheets/CleoHome_Main.css');
}