'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('edges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      source_id: {
        type: Sequelize.STRING,
        allowNull: false, 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE", 
        references:{
          model: 'circles', 
          key: "uuid"
        }
      },
      target_id: {
        type: Sequelize.STRING,
        allowNull: false, 
        onDelete: "CASCADE", 
        onUpdate: "CASCADE", 
        references:{
          model: 'circles', 
          key: "uuid"
        }
      },
      circle_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('edges');
  }
};