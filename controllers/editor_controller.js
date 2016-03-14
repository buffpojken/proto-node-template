var express 			= require('express'); 
var moment 				= require('moment');
var router 				= express.Router();
var db 						= require('./../models'); 

// Return HTML based on a template.
router.get('/', function(req, res){
	// Load circle here...
	res.render('editor/index', {monkey: moment().format()})
});

router.post('/editor/node', function(req, res){
	console.log(req.body);
	db.Circle.addNode(req.body).then((value) => {
		res.send({});
	});

});

router.put('/editor/node/:id', function(req, res){
	console.log(req.body)
	db.Circle.updateNode(req.body).then((value) => {
		res.send({});
	});
})

router.delete('/editor/node/:id', function(req, res){
	console.log(req.body)
	db.Circle.removeNode(req.body).then((value) => {
		res.send({});
	});
});

router.post("/editor/edge", function(req, res){
	console.log(req.body);
	db.Circle.addEdge(req.body).then((value) => {
		res.send({});
	});
});

router.delete("/editor/edge/:id", function(req, res){
	console.log(req.body);
	db.Circle.removeEdge(req.body).then((value) => {
		res.send({});
	});
});


module.exports = {
	route: "/", 
	controller: router
}