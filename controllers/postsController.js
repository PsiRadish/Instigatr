
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
            res.render("posts/show.ejs", {post: post});
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

module.exports = router;
