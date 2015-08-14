var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/',function(req, res){
	res.render('main/home.ejs');
});


module.exports = router;