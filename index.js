var db = require('./models');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

//configuring express
var app = express();
app.set('view engine','ejs');

//middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:false}));


app.get("/", function(req, res){
	res.send("yo this is our instigatr app!")
});


app.listen(3000);
