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
app.set('view engine','ejs');

// Facebook login
var FACEBOOK_APP_ID = "479685875542955"
var FACEBOOK_APP_SECRET = "88ab9c267cc59a84380b7860ac19334e";



//middleware
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
//controllers
app.use('/', require('./controllers/mainController.js'));


// facebook

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {

       return done(null, profile);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){

 });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){

  });

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// user login / signup
app.use(session({
  secret:'instigatr2000000001232',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use(function(req,res,next){
  if(req.session.user){
    db.user.findById(req.session.user).then(function(user){
      req.currentUser = user;
      next();
    });

  }else{
    req.currentUser = false;
    next();
  }
});

app.use(function(req,res,next){
  res.locals.currentUser = req.currentUser;
  res.locals.alerts = req.flash();
  next();
});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
app.use('/',require('./controllers/mainController.js'));
app.use('/auth',require('./controllers/auth.js'));


app.use('/posts', require('./controllers/postsController.js'));


// app.get("/", function(req, res){
// 	res.send("yo this is our instigatr app!")
// });

app.listen(3000);
