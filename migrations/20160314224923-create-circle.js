'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Circles', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(function(){
      return queryInterface.addIndex('Circles', ['circle_id', 'uuid'], {
        indexName: "LookupIndex"
      })      
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Circles').then(function(){
      return queryInterface.removeIndex('Circles', 'LookupIndex')
    });
  }
};