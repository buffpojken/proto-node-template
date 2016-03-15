"use strict";
class Editor{

	constructor(options){
		this.options = options;
		this.graph = new Graph(document.getElementById('editor'), {
//			onNodeAdded: 		this.onNodeAdded.bind(this),
//			onEdgeAdded: 		this.onEdgeAdded.bind(this), 
			onNodeMoved: 		this.onNodeMoved.bind(this),
			onNodeRemoved: 	this.onNodeRemoved.bind(this), 
			onEdgeRemoved: 	this.onEdgeRemoved.bind(this)
		});

		this.remote = new Remote("editor", {}); 
	}

	build(){
		const _t = this;
		
		this.remote.get("graph").then((data) => {
			this.graph.build(data);			

			// These are inherently temporal - and will be moved onto the graph-lib interface!
			// This abstraction is in order to support multi-modal tools for graph editing should
			// this be desired. It also allows for unit-testing the graph-manipulation regardless of
			// which graph-lib implementation is actually used?
			this.graph.cy.on('tap', 'node', function(e){
				if(_t.currentTool){
					_t.currentTool.nodeClick(e.cyTarget, _t.graph, e)
				}
			});

			this.graph.cy.on('tap', 'edge', function(e){
				if(_t.currentTool){
					_t.currentTool.edgeClick(e.cyTarget, _t.graph, e)
				}			
			})

			this.graph.cy.on('tap', function(e){			
				if(e.cyTarget != _t.graph.cy){return;}
				if(_t.currentTool){
					_t.currentTool.graphClick(_t.graph, e)
				}
			});

		})

	}

	setTool(){
		this.currentTool = new AddNodeTool(this)
	}

	// Tool API for Graph Manipulation - NOT to be confused with callbacks used for persistence!
	addNode(position){
		this.graph.addNode(position);
	}

	removeNode(element){
		this.graph.removeNode(element)
	}

	removeEdge(edge){
		this.graph.removeEdge(edge)		
	}

	// Callbacks for persisting stuff! Note that this is entirely independent of the graph-library actually used (since id/position can 
	// easily be converted into separate arguments, using whatever data-model the final graph-lib uses)
	// (Note - make sure this uses a queue-model later on, to ensure proper order of operations even on unreliable connections!)

	// onNodeAdded(node){
	// 	this.remote.post("node", {
	// 		id: 				node.id(), 
	// 		position: 	node.position()
	// 	}).then(value => {
	// 		console.log("node added...");
	// 	}).catch(error => {
	// 		console.error(error);
	// 	});
	// }

	// onEdgeAdded(source, targets, added){
	// 	this.remote.post("edge", {
	// 		source: source.id(), 
	// 		target: targets.id()
	// 	}).then(result => {
	// 		console.log("edge added")
	// 	}).catch(error => {

	// 	});
	// }

	onNodeMoved(node){
		this.remote.put("node", {
			id: 				node.id(), 
			position: 	node.position()
		}).then(result => {
			console.log("node moved")
		}).catch(error => {

		});
	}

	onNodeRemoved(node){
		this.remote.delete("node", {
			id: 				node.id()
		}).then(result => {
			console.log(result);
		}).catch(error => {

		});
	}

	onEdgeRemoved(edge){
		this.remote.delete("edge", {
			source: 		edge.source().id(),
			target: 		edge.target().id()
		}).then(result => {
			console.log(result);
		}).catch(error => {

		});
	}

	// Content Management

	openContentEditor(element){
		this.contentEditor = true
		console.log("manage content editing for...")
	}

}


$(function(){
	var editor = new Editor(); 
	editor.build();
	editor.setTool();
});