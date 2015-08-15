var db = require('./models');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var ejsLayouts = require('express-ejs-layouts')

//configuring express
var app = express();
app.set('view engine','ejs');

//middleware
app.use(ejsLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));
//controllers
app.use('/', require('./controllers/mainController.js'));


app.get("/", function(req, res){
	res.send("yo this is our instigatr app!")
});


app.listen(3000);
