var db = require('./models');
var async = require('async');
var express = require('express');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejsLayouts = require('express-ejs-layouts');
var session = require('express-session');
var flash = require('connect-flash');
// var favicon = require('serve-favicon');
// var passport = require('passport')
// var FacebookStrategy = require('passport-facebook').Strategy

// require('./stampedLog.js');

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
// app.use(favicon(__dirname + '/public/favicon.ico'));
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
  }).then(function(){
  
  res.locals.alerts = req.flash();
  
  // req.session.userId = 2; // FOR TESTING ONLY BRO
  
  if (req.session.userId)
  {
    // console.log("Getting session user from database");
    // db.user.findById(req.session.userId).then(function(user)
    db.user.find({where: {id: req.session.userId}, include: [db.vote]}).then(function(user)
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

// DebateChat CLASS
function DebateChat(post)
{
    this.post = post;
    
    // this.sockets = [];
    this.connections = 0;
    
    this.champion = {for: null, against: null};
    this.votesOnChampion = {for: {}, against: {}};
    this.socketsInLine = {for: [], against: []};
}
DebateChat.verifySideParam = function(side)
{
    if (side !== 'for' && side !== 'against')
        throw new Error("Invalid side argument: This method must be called with a `side` argument of 'for' or 'against'. Instead was: " + side);
}
DebateChat.prototype.removeUserSocketFromLine = function(user, side)
{
    DebateChat.verifySideParam(side);
    
    var thisLine = this.socketsInLine[side];
    
    var removedSocket = null;
    thisLine.forEach(function(socketInLine, index)
    {
        if (socketInLine.user.id == user.id)
        {
            removedSocket = thisLine.splice(index, 1);
            return;
        }
    });
    
    return removedSocket;
}
DebateChat.prototype.getPlaceInLine = function(user, side)
{
    DebateChat.verifySideParam(side);
    // console.log('================ getPlaceInLine');
    // console.log('---------- ID  ', user.id);
    // console.log('---------- NAME', user.name);
    // console.log('---------- SIDE', side);
    var findex = -1;
    
    // this.socketsInLine[side].forEach(function(userInLine, index)
    this.socketsInLine[side].forEach(function(socketInLine, index)
    {
        // console.log('.... INDEX', index);
        if (user.id === socketInLine.user.id)
        {
            // console.log('.... ID  ', userInLine.id);
            // console.log('.... NAME', userInLine.name);
            findex = index;
            return;
        }
    });
    
    return findex;
    // if (findex == -1)
    //     return null;
    // return getOrdinal(findex + 1);
}
DebateChat.prototype.getChampName = function(side)
{
    DebateChat.verifySideParam(side);
    
    // checks for null champ here so don't have to elsewhere
    if (this.champion[side] === null)
        return null;
    else
        return this.champion[side].name;
}
DebateChat.prototype.getIsChamp = function(user, side)
{
    if (side === null)
        return false;
    
    DebateChat.verifySideParam(side);
    
    // checks for null champ here so don't have to elsewhere
    if (this.champion[side] === null)
        return false;
    else
        return this.champion[side].id === user.id;
}
DebateChat.prototype.getConfidenceInChampion = function(side)
{
    DebateChat.verifySideParam(side);
    
    var votesOnThisChampion = this.votesOnChampion[side];
    
    var confidence = 0;
    for (var userId in votesOnThisChampion)
    {
        confidence += votesOnThisChampion[userId];
    }
    
    return confidence;
}
DebateChat.prototype.checkUpdateLine = function(side)
{
    DebateChat.verifySideParam(side);
    
    // console.log('===== QUEUE\n', this.socketsInLine[side]);
    
    // DO CHAMP PROMOTION IF NECESSARY AND POSSIBLE
    // no champ and there's someone in line
    if (this.champion[side] == null && this.socketsInLine[side].length)
    {   // promotion
        var champSocket = this.socketsInLine[side].shift();
        this.champion[side] = champSocket.user;
        this.votesOnChampion[side] = {}; // reset confidence votes
        champSocket.inLine = false;
        
        champSocket.emit('becomeChampion', side);
        sio.to(this.postId).emit('champUpdate', this.getChampName('for'), this.getChampName('against'));
    }
    
    // UPDATE PLACE IN LINE
    // debateChat.sockets.forEach(function(loopSocket)
    this.socketsInLine[side].forEach(function(lineSocket)
    {
        /* front of line and no champ
        if (i == 0 && this.champion[side] == null)
        {   // promotion
            this.champion[side] = this.socketsInLine[side].shift().user;
            this.votesOnChampion[side] = {}; // reset confidence votes
            lineSocket.inLine = false;
            
            lineSocket.emit('becomeChampion', lineSocket.side);
            sio.to(this.postId).emit('champUpdate', this.getChampName('for'), this.getChampName('against'));
            
            // and now we start all over
            // handleLineShift(side);
            return;
        }
        else
        {   // just update place in line
            lineSocket.emit('updateQueue', getOrdinal(this.getPlaceInLine(lineSocket.user, lineSocket.side) + 1), lineSocket.side);
        } */
        lineSocket.emit('updateQueue', getOrdinal(this.getPlaceInLine(lineSocket.user, lineSocket.side) + 1), lineSocket.side);
    });
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
    console.log('---><--- SOCKET CONNECT');
    // console.log(socket.request.res.locals.currentUser);
    
    req = socket.request;
    res = socket.request.res;
    
    socket.postId = null;
    
    // CHAT INITIALIZATION REQUEST
    socket.on('startChat', function(postId)
    {
        console.log("========= startChat");
        async.waterfall(
        [function(callback)
        {
            db.post.findById(postId).then(function(post)
            {
                if (post)
                {
                    socket.join(postId);
                    // socket.post = post;
                    socket.postId = post.id;
                    
                    callback(null, post);
                }
                else
                {
                    callback(new Error(req.route + ':' + req.url + ': Post '+postId+' not found.'));
                }
            }).catch(function(err)
            {
                callback(err);
            });
        },function(post, callback)
        {
            db.user.find(
            {
                where: {id: req.session.userId},
                include: [{ model: db.post, as: 'postsFor' }, { model: db.post, as: 'postsAgainst' }]
            }).then(function(user)
            {
                socket.user = user;
                callback(null, post);
            }).catch(function(err)
            {
                callback(err);
            });
        }],function(err, post) // end of waterfall
        {
            if (!err)
            {
                // have queues and champions been instantiated for this post?
                if (!(postId in debateChats))
                {
                    debateChats[postId] = new DebateChat(post); // construct 'em
                }
                // debateChats[postId].sockets.push(socket);
                debateChats[postId].connections += 1;
                
                if (socket.user)
                {
                    console.log(socket.user.name, 'connected to', postId);
                    
                    if (socket.user.postsFor.some(function(forPost) { return forPost.id === postId; })) // look for this post in the user's postsFor
                    {
                        socket.side = 'for';
                    }
                    else if (socket.user.postsAgainst.some(function(againstPost) { return againstPost.id === postId; })) // look for this post in the user's postsAgainst
                    {
                        socket.side = 'against';
                    }
                    else
                        socket.side = null;
                }
                else
                {
                    console.log('Unauthenticated user connected to', postId);
                    socket.side = null;
                }
                
                // CHAT INITIALIZATION RESPONSE
                socket.emit('startChat_Response', req.session.userId, socket.side, debateChats[postId].getChampName('for'), debateChats[postId].getChampName('against'));
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
        // console.log("======== choseSide received for", socket.user.name, side);
        
        if (!socket.user) // not logged in
            return;
        
        debateChat = debateChats[socket.postId];
        
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
            
            // PERFORM NECESSARY DATABASE ACTIONS FOR CHANGE OF SIDE
            async.series(
            [
                function(callback)
                {
                    if (removalFunc) // removal function specified
                    {
                        socket.user[removalFunc](debateChat.post).then(function()
                        {
                            callback(null);
                        });
                    }else
                        callback(null);
                },function(callback)
                {
                    if (addFunc) // add function specified
                    {
                        socket.user[addFunc](debateChat.post).then(function()
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
            ], function(err) // ALL DONE
            {
                if (!err)
                {
                    socket.emit('choseSide_Response', side);
                    if (socket.inLine) // was in line
                    {
                        debateChat.removeUserSocketFromLine(socket.user, socket.side);
                        socket.inLine = false;
                        // handleLineShift(socket.side);
                        debateChat.checkUpdateLine(socket.side);
                    }
                    else if (debateChat.getIsChamp(socket.user, socket.side)) // was champ
                    {
                        debateChat.champion[socket.side] = null;
                        // handleLineShift(socket.side);
                        debateChat.checkUpdateLine(socket.side);
                    }
                } else
                {
                    console.log(err.stack);
                }
            })
        }
    });
    
    // ENTER QUEUE
    socket.on('enterQueue', function()
    {
        if (!socket.user || !socket.side || socket.inLine) // no login or no side or already in line
        {
            return;
        }
        
        debateChat = debateChats[socket.postId];
        
        // no champion already, move right in
        if (debateChat.champion[socket.side] == null && debateChat.socketsInLine[socket.side].length == 0)
        {
            debateChat.champion[socket.side] = socket.user;
            debateChat.votesOnChampion[socket.side] = {};
            socket.emit('becomeChampion', socket.side);
            
            sio.to(socket.postId).emit('champUpdate', debateChat.getChampName('for'), debateChat.getChampName('against'));
        }
        else // get in line
        {
            console.log(socket.user.name, socket.user.id, 'getting in line', socket.side);
            /// THIS FAR OMG
            debateChat.socketsInLine[socket.side].push(socket);
            socket.inLine = true;
            socket.emit('updateQueue', getOrdinal(debateChat.getPlaceInLine(socket.user, socket.side) + 1), socket.side);
        }
    });
    
    // NEW MESSAGE FROM A CHAT ROOM
    socket.on('newMessage', function(content)
    {
        debateChat = debateChats[socket.postId];
        
        // console.stampedLog("==========SIDE\n",socket.side);
        if (socket.user && socket.side && debateChat.getIsChamp(socket.user, socket.side))
        {
            socket.user.createMessage({postId: socket.postId, content: content, side: socket.side}).then(function(message)
            {   // once message is persisted to the database
                // emit new chat message to all clients
                sio.to(socket.postId).emit('chatUpdate', socket.user.name, content, socket.side);
            });
        }
    });
    
    socket.on('disconnect', function()
    {
        console.log('--< * >-- DISCONNECT');
        
        if (socket.postId)
        {
            var debateChat = debateChats[socket.postId];
            
            if (socket.user)
            {
                // console.log('--< * >-- Name:', socket.user.name);
                
                if (socket.inLine) // was in line
                {
                    // console.log('--< * >--', socket.user.name, 'was in line.');
                    debateChat.removeUserSocketFromLine(socket.user, socket.side);
                    socket.inLine = false;
                    debateChat.checkUpdateLine(socket.side);
                }
                else if (debateChat.getIsChamp(socket.user, socket.side)) // was champ
                {
                    debateChat.champion[socket.side] = null;
                    sio.to(socket.postId).emit('champUpdate', debateChat.getChampName('for'), debateChat.getChampName('against'));
                    debateChat.checkUpdateLine(socket.side);
                }
                
                socket.user = null; // clear the reference, this socket is kaput
            }
            
            // debateChat.sockets.splice(debateChat.sockets.indexOf(socket), 1); // remove the socket from the list
            debateChat.connections -= 1;
            // if chat room empty now       // RACE CONDITION?
            // if (debateChat.connections == 0)
            // {   // clear references so they can be garbage collected
            //     debateChat.post = null;
                
            //     debateChat = null;
            //     debateChats[socket.postId] = null;
            // }
        }
    });
});


// app.listen(3000);
var port = process.env.PORT || 3000;
http.listen(port, function()
{
    console.log('Server started on ' + port);
});
