'use strict';
module.exports = function(sequelize, DataTypes)
{
    var post = sequelize.define('post',
    {
        userId: DataTypes.INTEGER,
        text:
        {
            type: DataTypes.TEXT,
            validate: { len: [10, 600] }
        }
    },
    {
        classMethods:
        {
            associate: function(models)
            {
                // associations can be defined here
                models.post.belongsTo(models.user);
                models.post.belongsToMany(models.user, {through: "usersForPosts", as: "usersFor"});
                models.post.belongsToMany(models.user, {through: "usersAgainstPosts", as: "usersAgainst"});
                models.post.hasMany(models.vote);
                models.post.hasMany(models.message);
                models.post.belongsToMany(models.tag, {through: "postsTags"});
            }
        },
        instanceMethods:
        {
            totalRating: function(callback)
            {                
                // preserve current value of this
                var thisPost = this;
                
                // define reduce function
                var doTotal = function(previous, vote)
                {
                    console.log("o(?.?)o .... doTotal vote["+vote.id+"].value =", vote.value, ".userId =", vote.userId);
                    // console.log("o(?.?)o .... doTotal", previous, "+", vote.value);
                    previous += vote.value;
                    // console.log("o(!.!)o .... doTotal returning", previous);
                    return previous;
                }
                
                if (thisPost.votes === undefined && callback === undefined)
                {
                    throw new Error("Post "+thisPost.id+" Votes Data Not Loaded and No Callback: Must provide callback argument when calling post.totalRating method without votes eager-loaded.");
                }
                else if (callback !== undefined)
                {                    
                    console.log("o(^_^)o .... totalRating method called on post "+thisPost.id+" with callback defined; loading votes fresh from database now (asynchronous).");
                    
                    sequelize.models.vote.findAll({where: {postId: thisPost.id}}).then(function(votes)
                    {
                        // console.log("o(?.?)o .... votes", votes);
                        
                        thisPost.votes = votes;
                        
                        // console.log("o(!v!)o .... New rating for post "+thisPost.id+" =", thisPost.votes.reduce(doTotal, 0));
                        callback(thisPost.votes.reduce(doTotal, 0));
                    });
                    
                    return "check callback";
                }
                else
                {
                    return thisPost.votes.reduce(doTotal, 0);
                }
            }
        }
    });
    return post;
};
