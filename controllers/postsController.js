var db = require('../models');
var express = require('express');
var router = express.Router();

//adding Request module for news API search
var request = require('request');

// --- POST SHOW
router.get('/:id/show', function(req, res)
{
    db.post.find(
    {
        where: { id: req.params.id },
        include:
        [
            db.user,
            db.vote,
            db.tag,
            // db.message
            {
                model: db.message,
                include: [db.user]
            }
        ],
        order:
        [
            [ db.message, 'createdAt', 'ASC' ]
        ]
    }).then(function(post)
    {
        if (post)
        {
            var tagsArr = []
            post.tags.map(function(tag){
                tagsArr.push(tag.name);
            });
            if(tagsArr[0]){
                var searchTerm = tagsArr.join();
                // console.log('*********************************************');
                // console.log(searchTerm);
                // console.log('*********************************************');
            }else{
                // console.log('*********************************************');
                // console.log(post.text);
                // console.log('*********************************************');
                var searchTerm = post.text.slice();
            }


            var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';

            var queryData = {
                q: searchTerm,
                pages: 10,
                sort: 'newest',
                'api-key': process.env.NYT_API_KEY,
            }
            // news API call
            request({
                url: url,
                qs: queryData
            }, function(error, response, data){
                var newsJSON = JSON.parse(data);
                // console.log(newsJSON.response.docs[0]);
                searchTerm = null;
                // searchTerm_Alchemy = null;
                res.render("posts/showPost.ejs", {titleSuffix: post.text, post: post, newsJSON: newsJSON});
            });
            // request({
            //     url: url,
            //     qs: queryData
            // }, function(error, response, data){
            //     var newsJSON = JSON.parse(data);
            //     // console.log(newsJSON.response.docs[0]);
            //     // searchTerm_Alchemy = null;
            //     res.render("posts/show.ejs", {titleSuffix: post.text, post: post, newsJSON: newsJSON});
            // });
            // end news API call

        } else
        {
            res.redirect("/404");
        }
    }).catch(function(err)
    {   // TODO: Acquire idea of what kind of errors show up here and something smart to do with them
        console.log(err);
        // res.send(err);
    });
});

// AJAX request from a debate page for news search results
router.get('/news',function(req, res)
{
    var searchTerm = req.query.q;
    var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
    var queryData = 
    {
        q: searchTerm,
        pages: 7,
        sort: 'newest',
        'api-key': process.env.NYT_API_KEY,
    }
    // news API call
    request(
    {
        url: url,
        qs: queryData
    }, function(error, response, data)
    {
        var newsJSON = JSON.parse(data);
        // console.log(newsJSON.response.docs[0]);
        searchTerm = null;
        // searchTerm_Alchemy = null;
        // res.send(newsJSON);
        
        // return rendered HTML that will be jQuery'd into page
        res.render("posts/news.ejs", {newsJSON: newsJSON, layout: 'ajaxLayout'});
    });
});


router.post('/', function(req, res)
{
    var tagStr = req.body.tags;
    // var tagsArr = tagStr.split(',');
    var tagsArr = tagStr.split(/[,#]/);
    
    // filter out empty and whitespace-only strings
    tagsArr.filter(function(tag)
    {
        return tag.trim().length;
    });
    
    db.user.findById(req.currentUser.id).then(function(user)
    {
        user.createPost(
        {
            text: req.body.text
        }).then(function(post)
        {
            for (i = 0; i < tagsArr.length; i++)
            {
                // if (tagsArr[i].charAt(0) === '#')
                // {
                //     var tagName = tagsArr[i].slice(1, tagsArr[i].length);
                // }
                // else
                // {
                //     var tagName = tagsArr[i];
                // };
                var tagName = tagsArr[i].trim();
                
                db.tag.findOrCreate({where: {name: tagName}}).spread(function(tag, created)
                {
                    post.addTag(tag);
                });
            };
            
            res.redirect('/posts/'+post.id+'/show');
        });
    });
});

// up or down vote posted via AJAX
// router.get('/vote', function(req, res)
router.post('/vote', function(req, res)
{
    var value = parseInt(req.body.val);
    var postId = parseInt(req.body.postId);
    
    // console.log("DDDDDDDDEBATE QUALITY VOTE ::: value ", value);
    console.log("o('.')o .... User", req.currentUser.id, "casting vote value", value);
    // console.log("DDDDDDDDEBATE QUALITY VOTE ::: postId", postId);
    
    db.user.findById(req.currentUser.id).then(function(user)
    {
        if (!user)
        {
            res.send("Invalid user ID."); // TODO: proper HTTP error response
            return;
        }
        
        db.post.findById(postId).then(function(post)
        {
            if (!post)
            {
                res.send("Invalid post ID."); // TODO: proper HTTP error response
                return;
            }
            
            db.vote.findOrCreate({where: {userId: user.id, postId: post.id}}).spread(function(vote, created)
            {
                if (created) console.log("o(@.@)o .... NEW VOTE CREATED");
                
                vote.value = value;
                vote.save().then(function()
                {
                    console.log("o(?.?)o .... Vote", vote.id, "value after save:", value);
                    
                    post.totalRating(function(newRating) // get the updated rating (asynchronous)
                    {
                        console.log("o(?!_!?)o .. New rating for post", postId, "=", newRating);
                        
                        res.send({newRating: newRating});
                    });
                });
            });
        });
    });
});
// db.post.find({where: {id: postId}, include: [{model: db.vote, include: [db.user]}]}).then(function(post){


module.exports = router;
