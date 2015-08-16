'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    score: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.post);
        models.user.belongsToMany(models.post, {through: "usersForPosts", as: "postsFor"});
        models.user.belongsToMany(models.post, {through: "usersAgainstPosts", as: "postsAgainst"});
      }
    }
  });
  return user;
};
