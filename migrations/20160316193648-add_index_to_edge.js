'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('Edges', ['source_id', 'target_id', 'circle_id'], {
      indexName: "EdgeLookupIndex"
    }).then(function(){
      return queryInterface.addIndex('Edges', ['circle_id'], {
        indexName: "EdgeCircle"
      })
    })   
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('Edges', 'EdgeLookupIndex');
  }
};
