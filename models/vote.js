'use strict';
module.exports = function(sequelize, DataTypes) {
  var vote = sequelize.define('vote', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.vote.belongsTo(models.user);
        models.vote.belongsTo(models.post);
      }
    }
  });
  return vote;
};
