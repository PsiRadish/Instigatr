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
lers/tagsController.js'));

app.use('/tags', require('./control
// DebateChat CLASS
function DebateChat(postId)
{
    this.postId = postId;
    
    this.champion = {for: null, against: null};
    this.votesOnChampion = {for: {}, against: {}};
    this.usersInLine = {for: [], against: []};
}
DebateChat.prototype.removeUserFromLine = function(user, side)
{
    if (side !== 'for' && side !== 'against')
        throw new Error("DebateChat.prototype.removeUserFromLine: Second parameter must be 'for' or 'against'.");
    
    var thisLine = this.usersInLine[side];
    
    var removedUser = null;
    thisLine.forEach(function(userInLine, index)
    {
        if (userInLine.id == user.id)
        {
            removedUser = thisLine.splice(index, 1);
            return;
        }
    });
    
    return removedUser;
}
DebateChat.prototype.getPlaceInLine = function(user, side)
{
    var findex = -1;
    
    this.usersInLine[side].forEach(function(userInLine, index)
    {
        if (user.id === userInLine.id)
        {
            findex = index;
            return;
        }
    });
    
    if (findex == -1)
        return null;
    return getOrdinal(findex + 1);
}
DebateChat.prototype.getChampName = function(side)
{   // checks for null champ here so don't have to elsewhere
    if (this.champion[side] == null)
        return null;
    else
        return this.champion[side].name;
}
DebateChat.prototype.getIsChamp = function(user, side)
{   // checks for null champ here so don't have to elsewhere
    if (this.champion[side] == null)
        return false;
    else
        return this.champion[side].id == user.id;
}
DebateChat.prototype.getConfidenceInChampion = function(side)
{
    if (side !== 'for' && side !== 'against')
        throw new Error("DebateChat.prototype.getConfidenceInChampion: Second parameter must be 'for' or 'against'.");
    
    var votesOnThisChampion = this.votesOnChampion[side];
    
    var confidence = 0;
    for (var userId in votesOnThisChampion)
    {
        confidence += votesOnThisChampion[userId];
    }
    
    return confidence;
}
var debateChats = {};


// https://ecommerce.shopify.com/c/ecommerce-design/t/ordinal-number-in-javascript-1st-2nd-3rd-4th-29259
function getOrdinal(number)
{
    var suffixes = ["th","st","nd","rd"]
    var slack = number % 100;
    return number + (suffixes[(slack - 20) % 10] || suffixes[slack] || suffixes[0]);
}


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
                else
                    socket.side = null;
                
                // have queues and champions been instantiated for this post?
                if (!(postId in debateChats))
                {
                    debateChats[postId] = new DebateChat(postId); // make 'em
                }
                
                // CHAT INITIALIZATION RESPONSE
                socket.emit('startChat_Response', req.session.userId, socket.side, debateChat.getChampName('for'), debateChat.getChampName('against'));
            }
            else
            {
                console.log(err.stack);

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
        if (!socket.user) // not logged in
            return;
        
        debateChat = debateChat.champion[socket.side];
        
        if (side != socket.side) // side changed
        {   // keep track of which list(s) change
            var forChanged = false;
            var againstChanged = false;
            
            if (socket.inLine) // was in line
            {
                debateChat.removeUserFromLine(socket.user.id, socket.side);
                socket.inLine = false;
                handleLineShift(socket.side);
            }
            if (debateChat.getIsChamp(socket.user, socket.side)) // was champ
            {
                debateChat.champion[socket.side] = null;
                handleLineShift(socket.side);
            }
            
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
    
    // function changeChampion(side, userNewChamp)
    // {
    //     debateChat = debateChats[socket.post.id];
        
    //     if (debateChat.champion[socket.side] != null &&
    //         debateChat.champion[socket.side].id == socket.user.id)
    //     {
    //         socket.emit('kickedFromChampion');
    //     }
    //     else if (userNewChamp.id == socket.user.id)
    //     {
            
    //         socket.emit('becomeChampion');
    //     }
    // }
    function handleLineShift(side)
    {
        var debateChat = debateChats[socket.post.id];
        
        if (debateChat.champion[side] == null && debateChat.usersInLine[side].length > 0)
        {
            debateChat.champion[side] = debateChat.usersInLine[side].shift();
        }
        
        sio.sockets.clients(socket.post.id).forEach(function(loopSocket)
        {
            if (loopSocket.user && loopSocket.inLine)
            {
                
            }
        });
    }
    
    // ENTER QUEUE
    socket.on('enterQueue', function()
    {
        if (!socket.user || !socket.side || socket.inLine) // no login or no side or already in line
            return;
        
        debateChat = debateChats[socket.post.id];
        
        // no champion already, move right in
        if (debateChat.champion[socket.side] == null && debateChat.usersInLine[socket.side].length == 0)
        {
            debateChat.champion[socket.side] = socket.user;
            socket.emit('becomeChampion');
            
            sio.to(socket.post.id).emit('champUpdate', debateChat.getChampName('for'), debateChat.getChampName('against'));
        }
        else // get in line
        {
            debateChat.usersInLine[socket.side].push(socket.user);
            socket.inLine = true;
            socket.emit('updateQueue', debateChat.getPlaceInLine(socket.user, socket.side));
        }
    });
    
    // NEW MESSAGE FROM A CHAT ROOM
    socket.on('newMessage', function(content)
    {
        debateChat = debateChats[socket.post.id];
        
        // console.stampedLog("==========SIDE\n",socket.side);
        if (socket.user && socket.side && debateChat.getIsChamp(socket.user, socket.side))
        {
            socket.user.createMessage({postId: socket.post.id, content: content, side: socket.side}).then(function(message)
            {
                // Emit new chat message to all clients
                sio.to(socket.post.id).emit('chatUpdate', socket.user.name, content, socket.side);
            });
        }
    });

    socket.on('disconnect', function()
    {
        console.log('client disconnected');
        
        var debateChat = debateChats[socket.post.id];
        
        if (socket.inLine)
        {
            debateChat.removeUserFromLine(socket.user.id, socket.side);
            socket.inLine = false;
            handleLineShift(socket.side);
        }
        else if (debateChat.getIsChamp(socket.user, socket.side)) // was champ
        {
            debateChat.champion[socket.side] = null;
            sio.to(socket.post.id).emit('champUpdate', debateChat.getChampName('for'), debateChat.getChampName('against'));
            handleLineShift(socket.side);
        }
    });
});


// app.listen(3000);
var port = process.env.PORT || 3000;
http.listen(port, function()
{
    console.log('Server started on ' + port);
});
