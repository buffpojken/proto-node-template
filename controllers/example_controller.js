var express 			= require('express'); 
var moment 				= require('moment');
var router 				= express.Router();

// Return HTML based on a template.
router.get('/', function(req, res){
	res.render('editor/index', {monkey: moment().format()})
});

// Return raw json.
router.get("/monkey", function(req, res){
	res.send({laser: "kalle"});
});

module.exports = {
	route: "/laser", 
	controller: router
}