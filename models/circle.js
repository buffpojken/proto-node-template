'use strict';
var _         = require('underscore');

var circle_id = 100; 

module.exports = function(sequelize, DataTypes) {
  var Circle = sequelize.define('Circle', {
    name: DataTypes.STRING, 
    url: DataTypes.STRING,
    x: DataTypes.FLOAT, 
    y: DataTypes.FLOAT, 
    circle_id: DataTypes.INTEGER, 
    uuid: DataTypes.STRING, 
  }, {
    tableName: 'circles',
    createdAt: "createdat", 
    updatedAt: "updatedat",
    classMethods: {
      fetch: function(circle_id){
        return Promise.all([Circle.findAll({where:{circle_id: circle_id}}), this.db.Edge.findAll({where:{circle_id: circle_id}})]).then(function(elements){
          return Circle.munge(elements[0].concat(elements[1]));
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
                  uuid:   el.uuid,
                  url:    el.url || ''
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
        return Circle.create({
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
        return Circle.update({
          x: parseFloat(node.position.x), 
          y: parseFloat(node.position.y)
        }, {
          where: {
            uuid: node.id
          }
        })
      }, 
      updateUrl: function(node, circle_id){
        return Circle.update({
          url: node.url,
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
        return Circle.destroy({
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
  return Circle;
};