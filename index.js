var db = require('./models');
var async = require('async');
var express = require('express');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
// var passport = require('passport')
// var FacebookStrategy = require('passport-facebook').Strategy

require('./stampedLog.js');

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

  db.post.findAll().then(function(posts){
    res.locals.postsLngth = posts.length
  });
  
  res.locals.alerts = req.flash();

  // req.session.userId = 2; // FOR TESTING ONLY BRO

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

app.use('/tags', require('./controllers/tagsController.js'));

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
DebateChat.prototype.removeUserIdFromLine = function(userId, whichLine)
{
    var thisLine;

    if (whichLine === 'for')
        thisLine = this.usersInLineFor;
    else if (whichLine === 'against')
        thisLine = this.usersInLineAgainst;
    else
        throw new Error("DebateChat.prototype.removeUserIdFromLine: Second parameter must be 'for' or 'against'.");

    var removedId = null;
    thisLine.forEach(function(user, index)
    {
        if (user.id == userId)
        {
            removedId = thisLine.splice(index, 1);
            return;
        }
    });

    return removedId;
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

    req = socket.request;
    res = socket.request.res;

    // CHAT INITIALIZATION REQUEST
    socket.on('startChat', function(postId)
    {
        async.series(
        [function(callback)
        {
            db.post.findById(postId).then(function(post)
            {
                if (post)
                {
                    socket.room = postId;
                    socket.join(postId);
                    socket.post = post;
                    callback(null);
                }
                else
                {
                    callback(new Error('Post '+postId+' not found.'));
                }
            }).catch(function(err)
            {
                callback(err);
            });
        },function(callback)
        {
            db.user.find(
            {
                where: {id: req.session.userId},
                include: [{ model: db.post, as: 'postsFor' }, { model: db.post, as: 'postsAgainst' }]
            }).then(function(user)
            {
                socket.user = user;
                callback(null);
            }).catch(function(err)
            {
                callback(err);
            });
        }],function(err)
        {
            if (!err)
            {
                if (socket.user)
                {
                    if (socket.user.postsFor.some(function(post) { return post.id === postId; }))
                    {
                        socket.side = 'for';
                    }
                    else if (socket.user.postsAgainst.some(function(post) { return post.id === postId; }))
                    {
                        socket.side = 'against';
                    }
                    else
                        socket.side = null;
                }
                // CHAT INITIALIZATION RESPONSE
                socket.emit('startChat_Response', req.session.userId, socket.side);
            }
            else
            {
                console.log(err);

                // if (typeof res.locals.alerts.danger == 'undefined')
                //     res.locals.alerts.danger = [];

                // res.locals.alerts.danger.push(err);
                // res.redirect('/404');
            }
        });
    });

    // CHOSE A SIDE FOR THE DEBATE
    socket.on('choseSide', function(side)
    {
        if (side != socket.side) // side changed
        {   // keep track of which list(s) change
            var forChanged = false;
            var againstChanged = false;

            var removalFunc = null;
            if (socket.side === 'for') // was For
            {
                removalFunc = 'removePostsFor'; // store this function to call later
                forChanged = true;
            }
            else if (socket.side === 'against') // was Against
            {
                removalFunc = 'removePostsAgainst'; // store this function to call later
                againstChanged = true;
            }

            var addFunc = null;
            if (side === 'for') // is For
            {
                addFunc = 'addPostsFor'; // store this function to call later
                forChanged = true;
            }
            else if (side === 'against') // is Against
            {
                addFunc = 'addPostsAgainst'; // store this function to call later
                againstChanged = true;
            }

            socket.side = side;

            async.series(
            [
                function(callback)
                {
                    if (removalFunc) // removal function specified
                    {
                        socket.user[removalFunc](socket.post).then(function()
                        {
                            callback(null);
                        });
                    }else
                        callback(null);
                },function(callback)
                {
                    if (addFunc) // add function specified
                    {
                        socket.user[addFunc](socket.post).then(function()
                        {
                            callback(null);
                        });
                    }else
                        callback(null);
                },function(callback)
                {
                    if (forChanged)
                    {   // get the new postsFor list
                        socket.user.getPostsFor().then(function(postsFor)
                        {   // update the list on socket copy of user
                            socket.user.postsFor = postsFor;
                            callback(null);
                        });
                    }else
                        callback(null);
                },function(callback)
                {
                    if (againstChanged)
                    {   // get the new postsFor list
                        socket.user.getPostsAgainst().then(function(postsAgainst)
                        {   // update the list on socket copy of user
                            socket.user.postsAgainst = postsAgainst;
                            callback(null);
                        });
                    }else
                        callback(null);
                }
            ], function(err)
            {
                socket.emit('choseSide_Response', side);
            })
        }
    });
    
    // NEW MESSAGE FROM A CHAT ROOM
    socket.on('newMessage', function(content)
    {
        // console.stampedLog("==========SIDE\n",socket.side);
        if (req.session.userId && socket.side) // can't contribute without being logged in and choosing a side
        {
            socket.user.createMessage({postId: socket.post.id, content: content, side: socket.side}).then(function(message)
            {
                // Emit new chat message to all clients
                sio.to(socket.room).emit('chatUpdate', socket.user.name, content, socket.side);
            });
        }
    });

    socket.on('disconnect', function()
    {
        console.log('user disconnected');
    });
});


// app.listen(3000);
var port = process.env.PORT || 3000;
http.listen(port, function()
{
    console.log('Server started on ' + port);
});

