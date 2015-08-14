var express = require('express');
var app = express();

app.get("/", function(req, res){
	res.send("yo this is our instigatr app!")
});


app.listen(3000);