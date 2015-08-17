'use strict';
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define('post', {
    userId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.post.belongsTo(models.user);
        models.post.belongsToMany(models.user, {through: "usersForPosts", as: "usersFor"});
        models.post.belongsToMany(models.user, {through: "usersAgainstPosts", as: "usersAgainst"});
        models.post.hasMany(models.vote);
      }
    }
  });
  return post;
};
