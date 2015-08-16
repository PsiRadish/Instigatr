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
        
      }
    }
  });
  return post;
};