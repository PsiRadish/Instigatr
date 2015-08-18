var db = require('../models');
var express = require('express');
var router = express.Router();

// --- POST SHOW
router.get('/:id/show', function(req, res)
{
 
    db.post.find({where: {id: req.params.id}, include: [db.user, {model: db.message, include: [db.user]}]}).then(function(post)
    {
        if (post)
        {
            res.locals.titleSuffix = "Debate";
            db.post.findAll().then(function(posts){
                res.render("posts/show.ejs", {post: post,posts:posts});
            })
        } else
        {
            res.redirect("/404");
        }
    }).catch(function(err)
    {   // TODO: Acquire idea of what kind of errors show up here and something smart to do with them
        console.log(err);
        res.send(err);
    });
});


router.post('/',function(req, res){
    var tagStr = req.body.tags
    var tagsArr = tagStr.split(',')
    db.user.findById(req.currentUser.id).then(function(user){
        user.createPost({
            text:req.body.text
        }).then(function(post){
            for(i=0;i<tagsArr.length;i++){
                var tagnm=tagsArr[i]
                db.tag.findOrCreate({where:{name:tagnm}}).spread(function(tag,created){
                    post.addTag(tag);
                });
            };
            res.redirect('/posts/'+post.id+'/show');
        });
    });
});


module.exports = router;
