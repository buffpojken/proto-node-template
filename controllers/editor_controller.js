var express 			= require('express'); 
var moment 				= require('moment');
var router 				= express.Router();

// Return HTML based on a template.
router.get('/', function(req, res){
	// Load circle here...
	res.render('editor/index', {monkey: moment().format()})
});

router.post('/editor/node', function(req, res){
	console.log("create node...")
	console.log(req.body);
	res.send({});
});

router.put('/editor/node/:id', function(req, res){
	console.log("update node...");
	res.send({})
})

router.delete('/editor/node/:id', function(req, res){
	console.log("delete node"); 
	res.send({});
});

router.post("/editor/edge", function(req, res){
	console.log("create edge"); 
	res.send({})
});

router.delete("/editor/edge/:id", function(req, res){
	console.log("delete edge");
	res.send({});
});


module.exports = {
	route: "/", 
	controller: router
}