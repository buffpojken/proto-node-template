'use strict';

var Promise     = require('bluebird'); 
var neo4j       = require('neo4j');
var _           = require('underscore')

var neo         = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:ninjamagick@localhost:7474',
});

var circle_id = "123"

module.exports = function(sequelize, DataTypes) {
  var Circle = sequelize.define('Circle', {
    name:             DataTypes.STRING, 
    description:      DataTypes.TEXT
  }, {
    classMethods: {
      fetch: function(node){
        return new Promise(function(resolve, reject){
          const query = [
            "MATCH (item {circle_id:{circle_id}}) RETURN item UNION MATCH (source)-[rel:PATH {circle_id:{circle_id}}]->(target) RETURN collect([target.uuid, source.uuid, id(rel)]) as item"
          ].join("\n"); 
          neo.cypher({
            query:        query,
            params: {
              circle_id:  circle_id
            }
          }, function(err, results){
            if(err){
              reject(err)
            }else{
              resolve(Circle.munge(results))
            }
          });
        });
      },
      munge: function(graphset){  
        return new Promise(function(resolve, reject){          
          const relationData = graphset.pop();
          let nodes = _.map(graphset, function(result){
            const item = result.item;
            if(item._id != null){
              return {
                group: 'nodes', 
                data: {
                  id: item.properties.uuid,       
                  uuid: item.properties.uuid
                }, 
                renderedPosition: {
                  x: item.properties.x, 
                  y: item.properties.y
                }
              }
            }
          });
          let relations = _.map(relationData.item, function(relation){
            return {
                group: 'edges',
                data: {
                  id:     relation[2],
                  source: relation[0],
                  target: relation[1]
                }
              }
          })
          resolve(nodes.concat(relations));
        });
      },
      addNode: function(node){
        return new Promise(function(resolve, reject){
          const query = [
            "CREATE (node:Node {uuid:{uuid}, name:{name}, x:{x}, y:{y}, circle_id:{circle_id}})", 
            "return node"
          ].join("\n"); 
          neo.cypher({
            query: query, 
            params: {
              uuid:       node.id, 
              name:       "An example node", 
              x:          node.position.x, 
              y:          node.position.y, 
              circle_id:  circle_id
            }
          }, function(err, results){
            if(err){
              reject(err)
            }else{
              resolve(results);
            }
          });
        });
      },
      addEdge: function(data){
        return new Promise(function(resolve, reject){
          const query = [
            "match (st:Node {uuid:{source}})",
            "match (en:Node {uuid:{target}})", 
            "create unique (st)-[:PATH {circle_id:{circle_id}}]->(en) return st, en"
          ].join("\n"); 
          neo.cypher({
            query: query, 
            params: {
              source:     data.source,
              target:     data.target, 
              circle_id:  circle_id
            }
          }, function(err, results){
            if(err){
              reject(err)
            }else{
              resolve(results);
            }
          });
        });
      }, 
      updateNode: function(node){
        return new Promise(function(resolve, reject){
          const query = [
            "match (node:Node {uuid:{id}})",
            "set node = {data}"
          ].join("\n"); 
          console.log(node);
          neo.cypher({
            query: query, 
            params: {
              id:      node.id,
              data: {
                uuid:       node.id,
                name:       "An example node", 
                circle_id:  circle_id,
                x:          node.position.x, 
                y:          node.position.y
              }
            }
          }, function(err, results){
            if(err){
              reject(err)
            }else{
              resolve(results);
            }
          });
        });
      }, 
      removeEdge: function(data){
        return new Promise(function(resolve, reject){
          const query = [
            "match (st:Node {uuid:{source}})",
            "match (en:Node {uuid:{target}})",
            "match (st)-[rel:PATH]-(en) DELETE rel"
          ].join("\n"); 
          neo.cypher({
            query: query, 
            params: {
              source:     data.source,
              target:     data.target
            }
          }, function(err, results){
            if(err){
              reject(err)
            }else{
              resolve(results);
            }
          });
        });
      },
      removeNode: function(data){
        return new Promise(function(resolve, reject){
          const query = [
            "match (st:Node {uuid:{source}}) DETACH DELETE st",
          ].join("\n"); 
          neo.cypher({
            query: query, 
            params: {
              source:     data.id,
            }
          }, function(err, results){
            if(err){
              reject(err)
            }else{
              resolve(results);
            }
          });
        });
      },
      associate: function(models) {
        // associations can be defined here
      }
    }, 
    instanceMethods: {

    }
  });
  return Circle;
};