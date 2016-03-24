var express 			= require('express');
var router 				= express.Router();
var db 						= require('./../models'); 

// Return HTML based on a template.
router.get('/', function(req, res){
	// Load circle here...
	res.render('content/index')
});

module.exports = {
	route: "/content", 
	controller: router
}