'use strict';
module.exports = function(sequelize, DataTypes) {
  var Edge = sequelize.define('Edge', {
    source_id: DataTypes.STRING, 
    target_id: DataTypes.STRING, 
    circle_id: DataTypes.INTEGER
  }, {
    tableName: 'edges',
    createdAt: "createdat", 
    updatedAt: "updatedat",
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Edge;
};