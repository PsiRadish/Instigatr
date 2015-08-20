var db = require('../models');
var express = require('express');
var router = express.Router();

//adding Request module for news API search
var request = require('request');

// --- POST SHOW
router.get('/:id/show', function(req, res)
{

    //news - API call
    // var searchTerm = 'clinton';
    // var searchTerm_Alchemy = req.query.z;
    // console.log("Alchemy search: " + searchTerm_Alchemy);

    // if (searchTerm !== "undefined"){
    //     var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
    
    //     var queryData = {
    //     q: searchTerm,
    //     pages:10,
    //     sort:'newest',
    //     'api-key':process.env.NYT_API_KEY,
    //     }
    //  }
     //else if (searchTerm_Alchemy !== "undefined") {
    //     console.log("Alchemy works!!!!");
    // }
    //end news - API call

    db.post.find({where: {id: req.params.id}, include: [db.user, db.tag, {model: db.message, include: [db.user]}]}).then(function(post)
    {
        if (post)
        {          
                    var   tagsArr=[]
                    post.tags.map(function(tag){
                        tagsArr.push(tag.name);
                    });
            if(tagsArr[0]){
                    var searchTerm = tagsArr.join();
                    console.log('*********************************************');
                    console.log(searchTerm);
                    console.log('*********************************************');
                }else{
                    console.log('*********************************************');
                    console.log(post.text);
                    console.log('*********************************************');
                    var searchTerm = post.text.slice();
                }
                
                var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
                
                var queryData = {
                q: searchTerm,
                pages:10,
                sort:'newest',
                'api-key':process.env.NYT_API_KEY,
                }
                // news API call
                request({
                    url:url,
                    qs:queryData
                }, function(error, response, data){
                    var newsJSON = JSON.parse(data);
                    // console.log(newsJSON.response.docs[0]);
                    searchTerm = null;
                    // searchTerm_Alchemy = null;
                    res.render("posts/show.ejs", {titleSuffix: post.text, post: post, newsJSON: newsJSON});
                });
                // request({
                //     url:url,
                //     qs:queryData
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

router.get('/news',function(req, res){
    var searchTerm = req.query.q;
    var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';
                    var queryData = {
                    q: searchTerm,
                    pages:7,
                    sort:'newest',
                    'api-key':process.env.NYT_API_KEY,
                    }
                    // news API call
                    request({
                        url:url,
                        qs:queryData
                    }, function(error, response, data){
                        var newsJSON = JSON.parse(data);
                        // console.log(newsJSON.response.docs[0]);
                        searchTerm = null;
                        // searchTerm_Alchemy = null;
                        res.send(newsJSON);
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


router.get('/vote',function(req, res){
    var value = parseInt(req.query.val);
    var pid = req.query.postId;
    db.user.findById(req.currentUser.id).then(function(user){
                    db.vote.findOrCreate({where:{userId:user.id,postId:pid}}).spread(function(vote,created){
                        vote.value = value;
                        vote.save().then(function(){
                            res.send(vote);
                        });
                });
            });
});
// db.post.find({where:{id:pid},include:[{model:db.vote, include:[db.user]}]}).then(function(post){


module.exports = router;
