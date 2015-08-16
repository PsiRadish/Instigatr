'use strict';
module.exports = function(sequelize, DataTypes) {
  var postsVotes = sequelize.define('postsVotes', {
    postId: DataTypes.INTEGER,
    voteId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return postsVotes;
};