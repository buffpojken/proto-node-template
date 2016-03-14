'use strict';

var Promise     = require('bluebird'); 
var neo4j       = require('neo4j');

var neo         = new neo4j.GraphDatabase({
    // Support specifying database info via environment variables,
    // but assume Neo4j installation defaults.
    url: process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] ||
        'http://neo4j:ninjamagick@localhost:7474',
});


module.exports = function(sequelize, DataTypes) {
  var Circle = sequelize.define('Circle', {
    name:             DataTypes.STRING, 
    description:      DataTypes.TEXT
  }, {
    classMethods: {
      addNode: function(node){
        return new Promise(function(resolve, reject){
          const query = [
            "CREATE (node:Node {uuid:{uuid}, name:{name}, x:{x}, y:{y}})", 
            "return node"
          ].join("\n"); 
          neo.cypher({
            query: query, 
            params: {
              uuid:   node.id, 
              name:   "An example node", 
              x:      node.position.x, 
              y:      node.position.y
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
            "create unique (st)-[:PATH]->(en) return st, en"
          ].join("\n"); 
          neo.cypher({
            query: query, 
            params: {
              source:  data.source,
              target:  data.target
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
          neo.cypher({
            query: query, 
            params: {
              id:      node.id,
              data: {
                uuid:   node.id,
                name:   "An example node", 
                x:      node.position.x, 
                y:      node.position.y
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