var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    db.post.findAll({include: [db.user, db.vote, db.tag, db.message, { model: db.user, as: 'usersFor' }, { model: db.user, as: 'usersAgainst' }], order: [['createdAt', 'DESC']], limit: 8, offset: 0}).then(function(posts){
        postsSort = posts.sort(function(a, b){
            return b.totalRating() - a.totalRating()
        });
        
        res.render('main/home.ejs', {postsSort: postsSort}); //, posts: posts});
  });
});

// AJAX request from home page for more posts to list
router.get('/more', function(req, res)
{
    var offset = req.query.offset;
    db.post.findAll(
    {
        include:
        [
          db.user, db.vote, db.tag, db.message,
          { model: db.user, as: 'usersFor' },
          { model: db.user, as: 'usersAgainst' }
        ],
        order: [['createdAt', 'DESC']],
        limit: 8,
        offset: offset
    }).then(function(posts)
    {
        postsSort = posts.sort(function(a, b)
        {
            return b.totalRating() - a.totalRating()
        });
        // ratings = postsSort.map(function(post)
        // {
        //     return post.totalRating();
        // });
        // res.send({postsSort: postsSort, ratings: ratings});
        
        // return rendered HTML that will be jQuery'd into page
        res.render("main/home.ejs", {postsSort: postsSort, layout: 'ajaxLayout'});
    });
});

router.get('/chronological', function(req, res){
    db.post.findAll({include: [db.user, db.vote, db.tag, db.message, { model: db.user, as: 'usersFor' }, { model: db.user, as: 'usersAgainst' }], order: [['createdAt', 'DESC']]}).then(function(posts){
            res.render('main/chron.ejs', {posts: posts, titleSuffix: 'Latest'});
  });
});

router.get('/allTimeTop', function(req, res){
    db.post.findAll({include: [db.user, db.vote, db.tag, db.message, { model: db.user, as: 'usersFor' }, { model: db.user, as: 'usersAgainst' }]}).then(function(posts){
            postsSort = posts.sort(function(a, b){
                return b.totalRating() - a.totalRating()
            });
            res.render('main/allTime.ejs', {posts: postsSort, titleSuffix: 'All Time Top Ranked'});
  });
});

router.get('/about', function(req, res)
{
    res.render('main/about.ejs', {titleSuffix: 'About'});
});

router.get('/404', function(req, res)
{
    res.render('main/404.ejs', {titleSuffix: '404'});
});

// router.get('/userData', function(req, res)
// {
//     // res.send({id: req.session.user});
//     console.log("Received userData request.");
//     res.json({id: req.session.userId});
// });


module.exports = router;
