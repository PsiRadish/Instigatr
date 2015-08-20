var db = require('../models');
var express = require('express');
var router = express.Router();

//adding Request module for news API search
var request = require('request');

// --- POST SHOW
router.get('/:id/show', function(req, res)
{

    //news - API call
    var searchTerm = req.query.q;
    // var searchTerm_Alchemy = req.query.z;
    // console.log("Alchemy search: " + searchTerm_Alchemy);

    if (searchTerm !== "undefined"){
        var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';

        var queryData = {
        q: searchTerm,
        pages:10,
        sort:'newest',
        'api-key':process.env.NYT_API_KEY,
        }
     }
     //else if (searchTerm_Alchemy !== "undefined") {
    //     console.log("Alchemy works!!!!");
    // }
    //end news - API call

    db.post.find({where: {id: req.params.id}, include: [db.user, {model: db.message, include: [db.user]}]}).then(function(post)
    {
        if (post)
        {
            
            //news - API call
            var searchTerm = req.query.q;

            if (searchTerm !== "undefined"){
                var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json';

                var queryData = {
                q: searchTerm,
                pages:10,
                sort:'newest',
                'api-key':process.env.NYT_API_KEY,
                }
             }

            //end news - API call
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
