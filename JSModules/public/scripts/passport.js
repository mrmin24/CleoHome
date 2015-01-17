// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
//var dbconfig = require('./database');

var config = require('../../GetConfig.js');
var config2 = config.data.xml.database[0];
//console.log(config2.host[0]);

var pool = mysql.createPool({
  host     : config2.host[0],
  user     : config2.user[0],
  password : config2.password[0],
  database: config2.name[0],
  users_table: config2.users_table[0]
});


//var connection = mysql.createConnection(dbconfig.connection);

//connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
         pool.getConnection(function(err, connection){
            connection.query("select * from users where id = "+ id, function(err, rows){
                connection.release();
                done(err, rows[0]);
            });
         })
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            pool.getConnection(function(err, connection){
                connection.query("select * from users where username = '" + username + "'", function(err, rows) {
                    //connection.release();
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                        };
    
                        var insertQuery = "INSERT INTO users ( username, password ) values ('" + newUserMysql.username + "','" + newUserMysql.password + "')";
    
                        connection.query(insertQuery,function(err, rows) {
                            newUserMysql.id = rows.insertId;
    
                            return done(null, newUserMysql);
                        });
                    }
                   connection.release(); 
                });
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            pool.getConnection(function(err, connection){
                connection.query("select * from users where username = '" + username + "'",function(err, rows){
                    connection.release();
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        console.log("Invalid Login: User not found");
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                        
                    }
    
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                    {
                        console.log("Invalid login: Password incorrect");
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    }
                    // all is well, return successful user
                     
   		            
   		
                  return done(null, rows[0]);
                    
                });
            });
        })
    );
    
    /*
    passport.use(
        'remember-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'token',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, token, done) { // callback with email and password from our form
            pool.getConnection(function(err, connection){
                connection.query("select * from user_logins where Username = '" + username + "' AND Session_id = '" + session_id + "'",function(err, rows){
                    connection.release();
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        console.log("Invalid Login: User not found in login list");
                        return done(null, false); // req.flash is the way to set flashdata using connect-flash
                        
                    }
                    
                    
                    
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(token, rows[0].Token))
                    {
                        console.log("Invalid login: Token incorrect");
                        return done(null, false); // create the loginMessage and save it to session as flashdata
                    }
                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            });
        })
    );*/
    
    /*
    passport.use('remember-me',new RememberMeStrategy(
        function(token, done) {
            Token.consume(token, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
                return done(null, user);
            });
        },
        function(user, done) {
            var token = utils.generateToken(64);
            Token.save(token, { userId: user.id }, function(err) {
            if (err) { return done(err); }
                return done(null, token);
            });
        }
    ));*/
};
