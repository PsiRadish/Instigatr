var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/search/',function(req, res){
	var query = '%'+req.query.q+'%'
	db.tag.findAll({where: {name:{ilike:query}},include:[{
    	model: db.post,
    	include:[db.user, db.vote, db.tag, db.message, { model: db.user, as: 'usersFor' }, { model: db.user, as: 'usersAgainst' }]}]}).then(function(tags){
    	var posts=[]
    	tags.forEach(function(tag){
    	for(i=0;i<tag.posts.length;i++){
    	posts.push(tag.posts[i])
    	};
    });
    	res.render('tags/search',{posts:posts,query:query});
    	// res.send(q)
    });
});

router.get('/:id', function(req, res){

    db.tag.find({where:{id:req.params.id},include:[{
    	model: db.post,
    	include:[db.user, db.vote, db.tag, db.message, { model: db.user, as: 'usersFor' }, { model: db.user, as: 'usersAgainst' }]}]}).then(function(tag){
    	db.post.findAll().then(function(posts){
        res.render("tags/show",{tag:tag,posts:posts})
    	});
    });
});


module.exports = router;
