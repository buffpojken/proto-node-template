// This is only using jQuery for minimalistic event-management.
"use strict";

class Clipper{

	constructor(){
		this.getSelection = (window.getSelection ? this._getSelection : this._getIESelection)

		$("body").on('mouseup', () => {
			this.checkSelection();
		});

	}

	checkSelection(){
		const sel = this.getSelection();
		if(sel.toString() != ""){
			this.handleSelection(sel)
		}
	}

	handleSelection(range){
		if(range.startContainer.parentElement == range.endContainer.parentElement && range.startContainer.parentElement.nodeName == "P" && range.endContainer.parentElement.nodeName == "P"){
			const cnt = range.extractContents();
			const sp 	= document.createElement("span"); 
			sp.className = "highlight"
			sp.appendChild(cnt)
			range.startContainer.parentElement.insertBefore(sp, range.startContainer.splitText(range.startOffset))
			$(sp).on('click', (e) => {
				alert("ninja");
			})
		}else{
			console.log("mungo...")
		}
	}

	_getIESelection(){
		return document.selection.createRange();
	}

	_getSelection(){
		return window.getSelection().getRangeAt(0)
	}

}



$(function(){
	window.clipper = new Clipper();
})