var db = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  db.post.findAll({include:[db.user, db.vote, db.tag, db.message, { model: db.user, as: 'usersFor' }, { model: db.user, as: 'usersAgainst' }], order:[['createdAt','DESC']],limit:8,offset:0}).then(function(posts){
      postsSort = posts.sort(function(a,b){
        return b.totalRating() - a.totalRating()
});
      res.render('about.ejs', {posts:postsSort})
      });
});


module.exports = router;
