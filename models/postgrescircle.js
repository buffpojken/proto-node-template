'use strict';
var _         = require('underscore');


var circle_id = 123; 

module.exports = function(sequelize, DataTypes) {
  var PostgresCircle = sequelize.define('PostgresCircle', {
    name: DataTypes.STRING, 
    x: DataTypes.FLOAT, 
    y: DataTypes.FLOAT, 
    circle_id: DataTypes.INTEGER, 
    uuid: DataTypes.STRING
  }, {
    classMethods: {
      fetch: function(circle_id){
        return Promise.all([PostgresCircle.findAll({where:{circle_id: 123}}), this.db.Edge.findAll({where:{circle_id: 123}})]).then(function(elements){
          return PostgresCircle.munge(elements[0].concat(elements[1]));
        })
      },
      munge: function(elements){
        return new Promise(function(resolve, reject){          
          resolve(_.map(elements, function(el){
            if(el.x){
              return {
                group: 'nodes', 
                data: {
                  id:     el.uuid, 
                  uuid:   el.uuid
                }, 
                renderedPosition: {
                  x:      el.x, 
                  y:      el.y
                }
              }
            }else{
              return {
                group: 'edges',
                data: {
                  id:       el.id, 
                  source:   el.source_id, 
                  target:   el.target_id
                }
              }
            }
          }));
        });
      },
      addNode: function(node, circle_id){
        return PostgresCircle.create({
          uuid:         node.id, 
          circle_id:    circle_id, 
          x:            parseFloat(node.position.x), 
          y:            parseFloat(node.position.y), 
          name:         "An example node"
        })      
      },
      addEdge: function(data, circle_id){
        return this.db.Edge.create({
          circle_id:    circle_id, 
          source_id:    data.source, 
          target_id:    data.target
        });
      }, 
      updateNode: function(node, circle_id){
        return PostgresCircle.update({
          x: parseFloat(node.position.x), 
          y: parseFloat(node.position.y)
        }, {
          where: {
            uuid: node.id
          }
        })
      }, 
      removeEdge: function(data){
        return this.db.Edge.destroy({
          where: {
            source_id: data.source, 
            target_id: data.target 
          }
        })
      },
      removeNode: function(data){
        return PostgresCircle.destroy({
          where: {
            uuid: data.id
          }
        })
      },
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PostgresCircle;
};