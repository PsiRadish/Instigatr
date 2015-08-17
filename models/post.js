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
            },
            totalRating: function()
            {
                if (typeof this.votes == 'undefined')
                    throw{ name: "DataNotLoaded Error", message: "Trying to count votes when votes have not been loaded for post "+this.id };
                
                return this.votes.reduce(function(previous, vote)
                {
                    previous += vote.value;
                }, 0);
            }
        }
    });
    return post;
};
