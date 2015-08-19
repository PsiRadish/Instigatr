// var db = require('../models');
// var express = require('express');
// var router = express.Router();

// router.get('/:id', function(req, res){

//     db.tag.find({where:{id:req.params.id},include:[db.post]}).then(function(tag){

//         db.post.findAll().then(function(posts){
//         res.render("tags/show",{tag:tag, posts:posts})
//       });
// });

//     	db.post.findAll().then(function(posts){
//         res.render("tags/show",{tag:tag,posts:posts})
//     	});
//     })



// module.exports = router;

var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res){

    db.tag.find({where:{id:req.params.id},include:[db.post]}).then(function(tag){
      db.post.findAll().then(function(posts){
        res.render("tags/show",{tag:tag,posts:posts})
      });
    })
});

module.exports = router;