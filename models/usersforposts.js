'use strict';
module.exports = function(sequelize, DataTypes) {
  var usersForPosts = sequelize.define('usersForPosts',
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
  return usersForPosts;
};
