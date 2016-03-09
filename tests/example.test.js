var request 			= require('supertest'); 
var assert 				= require("assert"); 
var app 					= require('./../app.js')

describe('The Example application', function(){

	it('should respond to /laser', function(done){
		request(app).get('/laser').set('Accept', 'text/html').expect(200).expect(function(res){
			// Some random, custom test of the content...
			assert(res.text.match(/time/))
		}).end(done)
	});

});


