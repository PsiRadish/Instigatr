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
],function(err, Jane, A, postDiamonds, postMileHighClub)
{
    console.log("FOR", Jane.postsFor);
    console.log("AGAINST", Jane.postsAgainst);
    // console.log(A.get());
    // console.log(postDiamonds.get());
    // console.log(postMileHighClub.get());
    
    // async.series(
    // [
    //     function(callback)
    //     {
    //         A.createMessage(
    //         {
    //             postId: postMileHighClub.id,
    //             content: "I was just trying to be friendly and I ended up on the couch for a week!",
    //             side: 'for'
    //         }).then(function(message)
    //         {
    //             callback(null);
    //         });
    //     },function(callback)
    //     {
    //         Jane.createMessage(
    //         {
    //             postId: postMileHighClub.id,
    //             content: "I WAS FLYING THE PLANE!!!",
    //             side: 'against'
    //         }).then(function(message)
    //         {
    //             callback(null);
    //         });
    //     }
    // ],function(err)
    // {
        
    // });
    
    // async.waterfall(
    // [
    //     // function(callback)
    //     // {
    //     //     db.vote.findOrCreate({where: {userId: Jane.id, postId: postDiamonds.id, value: 1}}).spread(function(vote, created)
    //     //     {
    //     //         callback(null);
    //     //     });
    //     // },function(callback)
    //     // {
    //     //     db.vote.findOrCreate({where: {userId: Jane.id, postId: postMileHighClub.id, value: -1}}).spread(function(vote, created)
    //     //     {
    //     //         callback(null);
    //     //     });
    //     // },function(callback)
    //     // {
    //     //     db.vote.findOrCreate({where: {userId: A.id, postId: postDiamonds.id, value: 1}}).spread(function(vote, created)
    //     //     {
    //     //         callback(null);
    //     //     });
    //     // },function(callback)
    //     // {
    //     //     db.vote.findOrCreate({where: {userId: A.id, postId: postMileHighClub.id, value: 1}}).spread(function(vote, created)
    //     //     {
    //     //         callback(null);
    //     //     });
    //     // },
    //     function(callback)
    //     {
    //         db.post.find({where: {id: 1}, include: [db.vote]}).then(function(post)
    //         {
    //             callback(null, post);
    //         });
    //     },function(post1, callback)
    //     {
    //         db.post.find({where: {id: 2}/*, include: [db.vote]*/}).then(function(post)
    //         {
    //             console.log(post1.get(), post.get());
    //             callback(null, post1, post);
    //         });
    //     }
    // ], function(err, post1, post2)
    // {
    //     if (err)
    //         console.log(err);
    //     else
    //     {
    //         console.log(post1.text, "rating", post1.totalRating());
    //         console.log(post2.text, "rating", post2.totalRating());
    //     }
    // });
});

