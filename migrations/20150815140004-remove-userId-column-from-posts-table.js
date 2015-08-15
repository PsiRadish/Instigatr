'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'posts',
      'userId'
    );
  },

  down: function (queryInterface, Sequelize) {

      // Add reverting commands here.
      // Return a promise to correctly handle asynchronicity.

      return queryInterface.addColumn(
      'posts',
      'userId',
      Sequelize.STRING
    );
  }
};
