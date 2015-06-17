var email   = require("emailjs");
var server  = email.server.connect({
   user:    "cleopatraserver@gmail.com", 
   password:"Goog@Mar2014$", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

exports.server = server;