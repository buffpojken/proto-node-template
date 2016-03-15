"use strict"; 

// Small utility for wrapping asynchronous, Promise-based server-communication. Can be independently tested :) 
class Remote{

	constructor(url, options){
		this.baseURL = url; 
		this.options = $.extend({

		}, options); 
		return this;
	}

	get(url){
		var url = `${this.baseURL}/${url}`
		return new Promise(function(resolve, reject){
			$.ajax({
				url: url, 
				type: 'GET', 
				dataType: 'json',
				success: function(data){
					resolve(data)
				}, 
				error: function(){
					reject();
				}
			})
		});
	}

	post(url, data){
		var url = `${this.baseURL}/${url}`
		return new Promise(function(resolve, reject){
			$.ajax({
				url: url, 
				data: data, 
				type: 'POST', 
				dataType: 'json',
				success: function(){
					resolve()
				}, 
				error: function(){
					reject();
				}
			})
		});
	}

	put(url, data){
		var url = `${this.baseURL}/${url}/${data.id}`
		return new Promise(function(resolve, reject){
			$.ajax({
				url: url, 
				data: data, 
				type: 'PUT', 
				dataType: 'json',
				success: function(){
					resolve()
				}, 
				error: function(){
					reject();
				}
			})
		});		
	}

	delete(url, data){
		var url = `${this.baseURL}/${url}/${data.id}`
		return new Promise(function(resolve, reject){
			$.ajax({
				url: url, 
				data: data, 
				type: 'DELETE', 
				dataType: 'json',
				success: function(){
					resolve()
				}, 
				error: function(){
					reject();
				}
			})
		});
	}

}