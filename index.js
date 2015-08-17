var db = require('./models');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejsLayouts = require('express-ejs-layouts')
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy


//configuring express
var app = express();
var http = require('http').Server(app);
// var io = require('socket.io')(http);
app.set('view engine','ejs');

// Facebook login
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

//middleware
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

// auto-load current user into req and res
app.use(function(req,res,next){
  // req.session.user = 8;
  if(req.session.user){
    db.user.findById(req.session.user.id).then(function(user){
      req.currentUser = user;
      res.locals.currentUser = user;
      next();
    });
  }else{
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
  res.locals.alerts = req.flash();
});

// facebook

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback"
//     // callbackURL: "/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function () {

//        return done(null, profile);
//     });
//   }
// ));

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login');
// }

app.use('/',require('./controllers/mainController.js'));
app.use('/auth',require('./controllers/authController.js'));

app.use('/users', require('./controllers/usersController.js'));

app.use('/posts', require('./controllers/postsController.js'));


// app.get("/", function(req, res){
// 	res.send("yo this is our instigatr app!")
// });

// app.listen(3000);
var port = process.env.PORT || 3000;
http.listen(port, function()
{
  console.log('Server started on ' + port);
});
