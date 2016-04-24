"use strict";
class Editor{

	constructor(options){
		this.options = options;
		this.graph = new Graph(document.getElementById('editor'), {
			onNodeAdded: 		this.onNodeAdded.bind(this),
			onEdgeAdded: 		this.onEdgeAdded.bind(this), 
			onNodeMoved: 		this.onNodeMoved.bind(this),
			onNodeRemoved: 	this.onNodeRemoved.bind(this), 
			onEdgeRemoved: 	this.onEdgeRemoved.bind(this)
		});

		this.remote = new Remote("editor", {}); 
		this.contentEditor = new ContentEditor(this);
	}

	build(){
		const _t = this;
		
		this.remote.get("graph").then((data) => {
			console.log(data);
			var urls = _.chain(data)
				.filter(function(item){
					return item.group == 'nodes' && item.data.url != '';
				})
				.map(function(item){
					return item.data.url;
				})
				.uniq()
				.value();

			if (urls.length > 0) {
				setTimeout(function(){
					_t.contentEditor.load(urls);
				}, 1);
			}

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

		});
	}

	setTool(){
		this.currentTool = new AddNodeTool(this)
	}

	// Tool API for Graph Manipulation - NOT to be confused with callbacks used for persistence!
	addNode(position){
		this.graph.addNode(position, this.generateElementID());
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

	onNodeAdded(node){
		this.remote.post("node", {
			id: 				node.id(), 
			position: 	node.position()
		}).then(value => {
			console.log("node added...");
		}).catch(error => {
			console.error(error);
		});
	}

	onEdgeAdded(source, targets, added){
		this.remote.post("edge", {
			source: source.id(), 
			target: targets.id()
		}).then(result => {
			console.log("edge added")
		}).catch(error => {

		});
	}

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
		this.contentEditor.open(element);
		console.log("manage content editing for...")
	}

	// Utils

	generateElementID(){
		var d = new Date().getTime();
		 if(window.performance && typeof window.performance.now === "function"){
		     d += performance.now(); //use high-precision timer if available
		 }
		 var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		     var r = (d + Math.random()*16)%16 | 0;
		     d = Math.floor(d/16);
		     return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		 });
		 return uuid;
	}

}

class ContentEditor {
	constructor(editor) {
		const _t = this;

		this.editor = editor;
		this.embed_url = document.getElementById('embed_url');
		this.preview = document.getElementById('preview');
		this.remote = new Remote("embed", {});
		this.current_element = false;

		this.cache = {};

		this.embed_url.addEventListener('keyup', function(evt) {
			if (evt.keyCode == 13) {
				var url = _t.embed_url.value;
				_t.editor.remote.put("node/url", {
					id: 	_t.current_element.id(),
					url: 	url
				}).then(result => {
					console.log("node moved")
				}).catch(error => {

				});
				_t.render(url);
			}
		});
	}

	load(urls) {
		const _t = this;
		this.remote.get('', {urls: urls}).then((data) => {
			_.each(data, function(embed, key){
				_t.cache[urls[key]] = data[key];
			});
		}).catch((err) => {
			console.log(err);
		});
	}

	open(element) {
		this.current_element = element;

		this.preview.innerHTML = '';

		var url = element.data('url');
		this.embed_url.value = url;
		if (url) {
			this.render(url);
		}
	}

	render(url) {
		const _t = this;

		if (this.cache[url] !== undefined) {
			console.log('hit!', url);
			this._render(this.cache[url]);
		} else {
			console.log('miss!', url);
			this.remote.get('', {urls: [url]}).then((data) => {
				_t.cache[url] = data[0];
				_t._render(data[0]);
			}).catch((err) => {
				console.log(err);
			});
		}
	}

	_render(embed) {
		this.preview.innerHTML = '<iframe src="' + embed.url + '" width="' + embed.width + '" height="' + embed.height + '" frameborder="0" allowfullscreen />';
	}

}


$(function(){
	var editor = new Editor(); 
	editor.build();
	editor.setTool();
});