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
            totalRating: function(refresh)
            {
                // default refresh to false
                if (refresh === undefined) refresh = false;
                
                // define reduce function
                var doTotal = function(previous, vote)
                {
                    previous += vote.value;
                    return previous;
                }
                
                if (this.votes === undefined || refresh)
                {
                    if (this.votes === undefined)
                    {
                        // throw new Error("Data Not Loaded: Trying to count votes for post "+this.id+" when votes have not been loaded.");
                        console.log("o('.')o .. totalRating method called on post "+this.id+" without votes loaded. Loading votes now.");
                    }
                    else
                        console.log("o(^_^)o .. totalRating method called with refresh true on post "+this.id+". Reloading votes.");
                    
                    sequelize.models.vote.findAll({where: {postId: postId}}).then(function(votes)
                    {
                        this.votes = votes;
                        return this.votes.reduce(doTotal, 0);
                    });
                }
                
                return this.votes.reduce(doTotal, 0);
            }
        }
    });
    return post;
};
