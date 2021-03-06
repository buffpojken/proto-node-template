var express 			= require('express'); 
var router 				= express.Router();
var db 						= require('./../models'); 

// Return HTML based on a template.
router.get('/', function(req, res){
	// Load circle here...
	res.render('editor/index')
});

router.get('/editor/graph', function(req, res){
	db.Circle.fetch(100).then((value) => {
		res.send(value);
	}).catch(function(err){
		console.log(err);
		res.status(500);
	});
});

router.post('/editor/node', function(req, res){
	db.Circle.addNode(req.body, 100).then((value) => {
		res.send({});
	});
});

router.put('/editor/node/:id', function(req, res){
	db.Circle.updateNode(req.body, 100).then((value) => {
		res.send({});
	});
})

router.put('/editor/node/url/:id', function(req, res){
	db.Circle.updateUrl(req.body, 100).then((value) => {
		res.send({});
	});
})

router.delete('/editor/node/:id', function(req, res){
	db.Circle.removeNode(req.body).then((value) => {
		res.send({});
	});
});

router.post("/editor/edge", function(req, res){
	db.Circle.addEdge(req.body,100).then((value) => {
		res.send({});
	});
});

router.delete("/editor/edge/:id", function(req, res){
	db.Circle.removeEdge(req.body).then((value) => {
		res.send({});
	});
});


module.exports = {
	route: "/", 
	controller: router
}