
// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
//var dbconfig = require('./database');
var config = require('../GetConfig.js');
var myconsole = require('../myconsole.js');

var config2 = config.data.xml.database[0];


try {
	
var pool = mysql.createPool({


	host     : config2.host[0],
	  user     : config2.user[0],
	  password : config2.password[0],
	  database: config2.name[0],
	  users_table: config2.users_table[0]


});
/* code */
} catch (e) {myconsole.log(e);}


// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// home PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		//myconsole.log(req.session.cookie.maxAge);
	//	if(req.session.cookie.maxAge == false || req.session.cookie.maxAge == null){
			
		//	res.redirect('/login');
			
	//	}else{
			//	res.render('index.ejs'); // load the index.ejs file
			/*if(req.headers.host == "10.0.0.21"){
				res.redirect('/home');
			}else{
				res.redirect('/home');
			}*/ 
			
		if(req.cookies.Username && req.cookies.Token){
			
		
			checktoken(req,function(isloggedin){
				
				if(isloggedin){
					 
					res.redirect('/home');
				}else{
					res.redirect('/login');
				}
				
				
			});
		
		}else{
			res.redirect('/login');
		}
		
	});
	
	function checktoken(req,callback){
		
		var token = req.cookies.Token;
		var validlogin = false;
		
	
		try{
		
		pool.getConnection(function(err2, connection){
		//	myconsole.log(connection);
		if(err2){	myconsole.log(err2);}
                connection.query("select Token from user_logins where Username = '" + req.cookies.Username +  "'",function(err2, rows){
                    connection.release();
                    if (err2)
                        return done(err2);
                    if (!rows.length) {
                        myconsole.log("Invalid Login: User not found in login list");
                        req.cookies.Username = false;
            	  		req.cookies.Token = false;
                       validlogin = false; // req.flash is the way to set flashdata using connect-flash
                        
                    }
                    
                    var users = [];
                    for(var i in rows){
                    	users.push(rows[i]['Token']);
                    }
                   // myconsole.log(users);					// enable to see tokens
                    
                    // if the user is found but the password is wrong
                    if (users.indexOf(token) == -1)
                    {
                        myconsole.log("Invalid login: Token incorrect");
                        clearusertokens(req.cookies.Username,null);
                        req.cookies.Username = false;
            	  		req.cookies.Token = false;   								//  - clear database for user
                        validlogin = false; 
                        
                    }else{
                    myconsole.log("Login token accepted");
                    // all is well, return successful user						//issue new token    --- future feature
                    validlogin = true;
                    }
                    
                    callback(validlogin);
                });
            });
		}
		catch(e){myconsole.log(e);}
            
		
	}
	
	function clearusertokens(user,token){
		pool.getConnection(function(err2, connection){
			if(!token)
                connection.query("DELETE from user_logins where Username = '" + user +  "'",cleartoken);
           else
           		connection.query("DELETE from user_logins where Token = '" + token +  "' AND Username = '" + user + "'" ,cleartoken);
           		
           		function cleartoken(err2, rows){
           		connection.release();
           			if (err2)
                        return done(err2);
                    else
                    {
                    	myconsole.log("User tokens deleted for user " + user);
                    }
                        
                        
           
                	
                }
		});
		
		
		
	}

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	
	

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
           // successRedirect : '/home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            var  token;
            var timeout = 1000 * 60 * 60 * 24 * config.data.xml.authentication[0].timeout[0];
           require('crypto').randomBytes(32, function(ex, buf) {
          	token = buf.toString('hex');
	    
   		           
   		            

            if (req.body.remember) {
            	myconsole.log("remember me");	
            
          
	            	myconsole.log(token);
	         
           
					res.cookie('Username', req.user.username, { maxAge: timeout, httpOnly: true });
					res.cookie('Token', token, { maxAge: timeout,httpOnly: true });
				//	res.cookie('Session_id', 3, { maxAge: timeout });
					
					pool.getConnection(function(err2, connection){
                
    
                        var insertQuery = "INSERT INTO user_logins ( Username, Token ) values ('" + req.user.username + "','" + token  + "')";
    
                        connection.query(insertQuery,function(err2, rows) {
                            newUserMysql.id = rows.insertId;
    
                            return done(null, newUserMysql);
                        });
                    
                   connection.release(); 
                });
            
	              //req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
          
            } else {
            	myconsole.log("No Remember Me");
            	 res.clearCookie('Username');
            	  res.clearCookie('Token');
            	 // res.clearCookie('Session_id');
              req.session.cookie.expires = false;
            }
   		            	
   		            
        res.redirect('/home');
   	});
   });
    
    
  
    
    
    
    
  /*app.post("/login", passport.authenticate('local',
    { failureRedirect: '/login',
      failureFlash: true }), function(req, res) {
        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
      res.redirect('/');
});*/

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup',isLoggedIn, function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



	
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	
//	function home(checklogin){
	
//	if(checklogin){
		app.get('/home', function(req, res) {
			
			if(req.cookies.Username && req.cookies.Token){
			
		
				checktoken(req,function(isloggedin){
					
					if(isloggedin){
						 
						res.render('home.ejs', {
							user : req.user // get the user out of session and pass to template
						});
					}else{
						res.redirect('/login');
					}
				
				
				});
			
			}else{
				isLoggedIn(req,res,function(){
				res.render('home.ejs',{
					user : req.user // get the user out of session and pass to template
				});
				});
			}
			
		});
	//}else
	//{
	//	app.get('/home', function(req, res) {
	//		res.render('home.ejs', {
		//		user : req.user // get the user out of session and pass to template
		//	});
	//	});
//	}
	
	
//	}
		// =====================================
	// home SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	
/*	app.get('/home', isLoggedIn, function(req, res) {
		res.render('home.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});*/

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		clearusertokens(req.cookies.Username, req.cookies.Token);
		req.session.cookie.expires = false;
		res.clearCookie('Username');
   	  	res.clearCookie('Token');
  	    res.clearCookie('Session_id');
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
