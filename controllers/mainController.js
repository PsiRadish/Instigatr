var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/',function(req, res){
	db.post.findAll({include:[db.user, db.vote]}).then(function(posts){
		res.render('main/home.ejs',{posts:posts});
	});
});

router.get('/404',function(req, res)
{
    res.render('main/404.ejs');
});

module.exports = router;
