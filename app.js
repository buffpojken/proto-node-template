var winston 		= require('winston'); 
var express			= require('express'); 
var bodyParse		= require('body-parser'); 
var multer 			= require('multer'); 
var path 				= require('path')
var glob 				= require('glob');
var _ 					= require('underscore'); 

GLOBAL.logger = new (winston.Logger)({
  transports: [
  	new (winston.transports.Console)({
  		timestamp: true
  	})
  ]
});

// Create an express-app
var app					 = express(); 

// Setup app with http body parsing, multibody (file upload) management, and a static folder.
app.use(bodyParse.urlencoded({extended: true})); 
app.use(multer())
app.use(express.static(path.join(__dirname, 'public'))); 

// Hook up a single template engine (we could easily use consolidate to have multiple view engines if desired)
app.set('views', './views');
app.set('view engine', 'ejs');

glob(path.join(__dirname, "controllers", "*.js"), function(error, files){
	if(error){
		logger.error(error); 
		process.exit(1); 
	}
	_.each(files, function(file){
		var pack = require(file); 
		app.use(pack.route, pack.controller);
	});
})

module.exports = app