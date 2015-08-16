var db = require('./models');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejsLayouts = require('express-ejs-layouts')
var session = require('express-session');
var flash = require('connect-flash');

//configuring express
var app = express();
app.set('view engine','ejs');

//middleware
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
//controllers
app.use('/', require('./controllers/mainController.js'));
app.use(session({
  secret:'hdsvhioadfgnioadfgnoidfagoibna',
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

app.use('/',require('./controllers/mainController.js'));
app.use('/auth',require('./controllers/auth.js'));



app.get("/", function(req, res){
	res.send("yo this is our instigatr app!")
});


app.listen(3000);
