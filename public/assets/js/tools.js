"use strict";

class Tool{

	constructor(editor){
		this.editor = editor
	}

	graphClick(graph, e){
		console.log("graph click");
	}

	nodeClick(element, graph, e){
		this.editor.removeNode(element)
	}

	edgeClick(element, graph, e){
		this.editor.removeEdge(element)
	}

}

class AddNodeTool extends Tool{

	graphClick(graph, e){
		this.editor.addNode(e.cyRenderedPosition)
	}

	nodeClick(element, graph, e){
		if(e.originalEvent.shiftKey){
			super.nodeClick(element, graph, e);
		}else{
			alert("open content editor...")
		}
	}

	edgeClick(element, graph, e){
		if(e.originalEvent.shiftKey){
			super.edgeClick(element, graph, e);
		}
	}

}