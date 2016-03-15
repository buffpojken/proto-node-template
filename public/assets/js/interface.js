// This is an interface between the editor and the graph library, in order
// to support switching the graph engine between various libraries.

// Issues 
// * The event-stack in cytoscape triggers a "grab" on "tap" - which means that we get an 
// erroneous "free" after tapping an event to open the content editor

 "use strict";

window.$empty = function(){};
class Graph{

	constructor(element, opts){
		this.element = element; 
		this.options = $.extend({}, {
			onNodeAdded: 		$empty,
			onEdgeAdded: 		$empty, 
			onNodeMoved: 		$empty, 
			onNodeRemoved: 	$empty, 
			onEdgeRemoved: 	$empty
		}, opts);
	}

	addNode(position){
		this.cy.add({
			group: 'nodes', 
			renderedPosition: position
		})
	}

	removeNode(element){
		this.cy.remove(element);
	}

	removeEdge(element){
		this.cy.remove(element)
	}

	build(el){
		this.cy = cytoscape({
				container: this.element, 
				elements:el,
				// elements: [
				// {
				// 	group: 'nodes', 
				// 	data: {
				// 		id: 'n1'	  			
				// 	}, 
				// 	position: {
				// 		x: 100, 
				// 		y: 100
				// 	}, 
				// }, 
				// {
				// 	group: 'nodes', 
				// 	data: {
				// 		id: 'n2'
				// 	}, 
				// 	position: {
				// 		x: 200, 
				// 		y: 100
				// 	}
				// }, 
				// {
				// 	group: 'edges',
				// 	data: {
				// 		id: 'e1', 
				// 		source: 'n1', 
				// 		target: 'n2'					
				// 	}
				// }
				// ], 
				layout: {
					name: 'preset', 
					fit: false
				},

		  style: [
		  {
		  	selector: 'node',
		  	style: {
		  		'content': 'data(id)'
		  	}
		  },
		  {
		  	selector: ':active', 
		  	style: {
		  		'overlay-opacity':0
		  	}
		  },
		  {
		  	selector: ':parent',
		  	style: {
		  		'background-opacity': 0.6
		  	}
		  }, 
		  {
		  	selector: 'edge', 
		  	style: {
		  		'line-color':'green', 
		  		'width': '1px'
		  	}
		  }
		  ]
		});

		this.cy.on('cyedgehandles.start', (e) => {
			this.draggingEdge = true;
		});

		this.cy.on('cyedgehandles.stop', (e) => {
			this.draggingEdge = false;
		});

		this.cy.on('add', 'node', (e) => {
			if(this.draggingEdge){return;}
			this.options.onNodeAdded(e.cyTarget);
		});

		this.cy.on('free', (e) => {
			if(!e.cyTarget.removed()){
				this.options.onNodeMoved(e.cyTarget)				
			}
		})

		this.cy.on('remove', 'node', (e) => {
			if(this.draggingEdge){return;}
			this.options.onNodeRemoved(e.cyTarget);
		});

		this.cy.on('remove', 'edge', (e) => {
			if(this.draggingEdge){return;}
			const edge = e.cyTarget
			if(!edge.source().removed() && !edge.target().removed()){
				this.options.onEdgeRemoved(e.cyTarget);
			}
		});

		this.cy.edgehandles({
			complete: this.options.onEdgeAdded, 
			toggleOffOnLeave: true
		});
	}

}