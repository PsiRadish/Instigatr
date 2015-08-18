var db = require('./models');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
// var passport = require('passport')
// var FacebookStrategy = require('passport-facebook').Strategy


//configuring express
var app = express();
var sessionStore = new session.MemoryStore();
var http = require('http').Server(app);
var sio = require('socket.io')(http);
app.set('view engine','ejs');

// Facebook login
// var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
// var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// ---- MIDDLEWARE ----
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(cookieParser());
var sessionMiddleware = session(
{
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  key: 'express.sid',
  resave: false,
  saveUninitialized: true
});
app.use(sessionMiddleware);
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
    if (typeof req.session.userId == 'undefined')
      req.session.userId = null;
    
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

function DebateChat(postId)
{
    this.postId = postId;
    
    this.userDebatingFor = null;
    this.confidenceInUserDebatingFor = 0;
    this.usersInLineFor = [];
    
    this.userDebatingAgainst = null;
    this.confidenceInUserDebatingAgainst = 0;
    this.usersInLineAgainst = [];
}
var debateChats = {};

// ======== SOCKET.IO ======== //
// add Express session data into socket object of socket.io
// (courtesy of http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x#answer-25618636)
sio.use(function(socket, next)
{
    sessionMiddleware(socket.request, socket.request.res, next);
});

// socket.io event listeners
sio.on('connection', function(socket)
{
    // console.log('SOCKET THING===========');
    // console.log(socket.request.res.locals.currentUser);
    socket.users = {};
    
    req = socket.request;
    res = socket.request.res;
    
    socket.on('startChat', function(postId)
    {
        db.user.findById(req.session.userId).then(function(user)
        {
            if (user)
            {
                db.post.findById(postId).then(function(post)
                {
                    if (post)
                    {
                        console.log('Ψ', 'User and post legit, populating socket with data');
                        socket.user = user;
                        
                        socket.room = postId;
                        socket.join(postId);
                        
                        socket.emit('startChat_Response', {userId: req.session.userId});
                    }
                    else
                    {
                        // req.flash('warning', 'That post does not exist.')
                        if (typeof res.locals.alerts.warning == 'undefined')
                            res.locals.alerts.warning = [];
                        
                        res.locals.alerts.danger.push('That post does not exist.');
                        // res.redirect('/404');
                    }
                });
            }
            else
            {
                // req.flash('warning', 'That user does not exist.')
                if (typeof res.locals.alerts.warning == 'undefined')
                    res.locals.alerts.danger = [];
                
                res.locals.alerts.warning.push('That user does not exist.');
                // res.redirect('/404');
            }
        });
        
        
    });
    socket.on('newMessage', function(postId, content)
    {
        console.log("Room", socket.room, typeof socket.room);
        // Emit new chat message to all clients
        sio.emit('chatUpdate', {authorName: user.name, side: 'for', content: content});
        
        
    });
});


// app.listen(3000);
var port = process.env.PORT || 3000;
http.listen(port, function()
{
    console.log('Server started on ' + port);
});
