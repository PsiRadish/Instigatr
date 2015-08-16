'use strict';
module.exports = function(sequelize, DataTypes) {
  var usersAgainstPosts = sequelize.define('usersAgainstPosts',
  {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usersAgainstPosts;
};
