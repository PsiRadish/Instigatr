var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	db.post.findAll({include:[db.user, db.vote, db.tag], order:[['createdAt','DESC']],limit:8,offset:0}).then(function(posts){
			postsSort = posts.sort(function(a,b){
				return b.totalRating() - a.totalRating()
			});
			res.render('main/home.ejs',{postsSort:postsSort,posts:posts});
  });
});

router.get('/chronological', function(req, res){
	db.post.findAll({include:[db.user, db.vote, db.tag], order:[['createdAt','DESC']]}).then(function(posts){
			res.render('main/chron.ejs',{posts:posts});
  });
});

router.get('/allTimeTop', function(req, res){
	db.post.findAll({include:[db.user, db.vote, db.tag]}).then(function(posts){
			postsSort = posts.sort(function(a,b){
				return b.totalRating() - a.totalRating()
			});
			res.render('main/allTime.ejs',{posts:postsSort});
  });
});

router.get('/404', function(req, res)
{
    res.render('main/404.ejs');
});

router.get('/userData', function(req, res)
{
    // res.send({id: req.session.user});
    console.log("Received userData request.");
    res.json({id: req.session.userId});
});

module.exports = router;
