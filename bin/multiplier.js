#!/usr/bin/env node
"use strict";
var program = require('commander'); 
var db 			= require('./../models');
var _ 			= require('underscore'); 
var Promise = require('bluebird');
var uuid 		= require('node-uuid'); 
var async 	= require('async');

program.version('0.0.1')

program.command('duplicate').description("Clone a graph structure in neo4j").option('-d, --count <n>', "Number of duplicate", parseInt).
option('-c, --circle_id <k>', "Circle Id").action(function(command){
	let base_id = 1000;
	db.Circle.fetch(command.circle_id.toString()).then((value) => {


		var queue = async.queue(function(el, callback){
			if(el.group == "nodes"){
				db.Circle.addNode({
					id: el.id, 
					position: {
						x: el.renderedPosition.x, 
						y: el.renderedPosition.y
					}
				}, el.current_id).then(() => {
					callback();
				});
			}else{
				db.Circle.addEdge({
					source: el.data.source, 
					target: el.data.target
				}, el.current_id).then(() => {
					callback();
				})
			}
		})

		_(command.count).times((idx) => {
			let current_id = (base_id+idx).toString();

			let id_map = {}; 

			_.each(value, function(el, idx){

				var k = JSON.parse(JSON.stringify(el));

				k.current_id = current_id

				if(k.group == "nodes"){
					id_map[el.data.id] = uuid.v4()
					k.data.uuid 	= id_map[k.data.id]
					k.id 				= k.data.uuid
				}else{
					k.data.source = id_map[k.data.source]
					k.data.target = id_map[k.data.target]
				}

				queue.push(k, function(err){
					if(err){
						console.error(err);
					}else{
						console.log("Sent item: "+idx+" for "+current_id);
					}
				})
			});
		});

		queue.drain = function(){
			console.log("Done...");
		}

	});
});


program.parse(process.argv);