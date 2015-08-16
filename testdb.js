var db    = require('./models');
var async = require('async');

async.waterfall(
[
    function(callback)
    {
        db.user.find({where: {id: 1}, include: [{ model: db.post, as: 'postsFor' }, { model: db.post, as: 'postsAgainst' }]}).then(function(user)
        {
            callback(null, user);
        });
    },function(Jane, callback)
    {
        db.user.find({where: {id: 2}, include: [db.post]}).then(function(user)
        {
            callback(null, Jane, user);
        });
    },function(Jane, A, callback)
    {
        db.post.find({where: {id: 1}, include: [db.user]}).then(function(post)
        {
            callback(null, Jane, A, post);
        });
    },function(Jane, A, postDiamonds, callback)
    {
        db.post.find({where: {id: 2}, include: [db.user]}).then(function(post)
        {
            callback(null, Jane, A, postDiamonds, post);
        });
    }
], function(err, Jane, A, postDiamonds, postMileHighClub)
{
    console.log("FOR", Jane.postsFor);
    console.log("AGAINST", Jane.postsAgainst);
    // console.log(A.get());
    // console.log(postDiamonds.get());
    // console.log(postMileHighClub.get());
});
