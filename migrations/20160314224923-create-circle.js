'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('circles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      x: {
        type: Sequelize.INTEGER
      }, 
      y: {
        type: Sequelize.INTEGER
      },
      circle_id: {
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING, 
        unique: true
      },
      createdat: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedat: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function(){
      return queryInterface.addIndex('circles', ['circle_id', 'uuid'], {
        indexName: "LookupIndex"
      })      
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('circles').then(function(){
      return queryInterface.removeIndex('circles', 'LookupIndex')
    });
  }
};