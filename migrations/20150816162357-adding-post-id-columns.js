'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'votes',
      'postId',
      Sequelize.INTEGER
      );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'votes',
      'postId'
      );
  }
};
