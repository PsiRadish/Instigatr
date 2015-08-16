var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/',function(req, res){
	db.post.findAll({include:[db.user]}).then(function(posts){
			res.render('main/home.ejs',{posts:posts});
	});
});


module.exports = router;