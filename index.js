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
var io = require('socket.io')(http);
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
app.use(function(req,res,next)
{
  res.locals.alerts = req.flash();
  
  req.session.userId = 2; // FOR TESTING ONLY BRO
  
  if (req.session.userId)
  {
    // console.log("Getting session user from database");
    db.user.findById(req.session.userId).then(function(user)
    {
      // console.log("auto-user", user);
      if (user)
      {
        req.currentUser = user;
        res.locals.currentUser = user;
      }
      else
      {
        req.currentUser = false;
        res.locals.currentUser = false;
      }
      next();
    });
  } else
  {
    req.currentUser = false;
    res.locals.currentUser = false;
    next();
  }
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


io.on('connection', function(socket)
{
  socket.on('newMessage', function(msg)
  {
    console.log('MESSAGE==============================');
    console.log(msg);
    
    db.user.findById(msg.userId).then(function(user)
    {
        if (user)
        {
            db.post.findById(msg.postId).then(function(post)
            {
                if (post)
                {
                    var side = 'for';  // TEMPORARY, TODO: keep real track of sides etc.
                    
                    io.emit('chatUpdate', {authorName: user.name, side: 'for', content: msg.content});
                }
                else
                {
                    // req.flash('warning', 'That post does not exist.')
                    // res.redirect('/404');
                }
            });
        }
        else
        {
            // req.flash('warning', 'That user does not exist.')
            // res.redirect('/404');
        }
    });
  });
});


// app.listen(3000);
var port = process.env.PORT || 3000;
http.listen(port, function()
{
  console.log('Server started on ' + port);
});
