'use strict';
module.exports = function(sequelize, DataTypes)
{
    var post = sequelize.define('post',
    {
        userId: DataTypes.INTEGER,
        text: DataTypes.TEXT
    },{
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
            }
        },
        instanceMethods:
        {
            totalRating: function()
            {
                if (typeof this.votes == 'undefined')
                    throw new Error("Data Not Loaded: Trying to count votes for post "+this.id+" when votes have not been loaded.");
                
                return this.votes.reduce(function(previous, vote)
                {
                    previous += vote.value;
                    return previous;
                }, 0);
            }
        }
    });
    return post;
};
