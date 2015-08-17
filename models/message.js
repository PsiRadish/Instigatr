'use strict';
module.exports = function(sequelize, DataTypes) {
  var message = sequelize.define('message', {
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    side:
    {
      type: DataTypes.STRING,
      validate:
      {
        isIn: [['for', 'against']]
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        models.message.belongsTo(models.post);
        models.message.belongsTo(models.user);
      }
    }
  });
  return message;
};
