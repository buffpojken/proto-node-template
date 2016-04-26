'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'circles',
      'url',
      {
        type: Sequelize.STRING(2048),
        allowNull: true
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('circles', 'url');
  }
};
