var express = require('express');
var app = express();
var morgan = require('morgan');
var swig = require('swig');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var makesRouter = require('./routes');
var models = require('./models')

// the typical way to use express static middleware.
var publicDir = path.join(__dirname, '/public')
var staticMiddleware = express.static(publicDir);
app.use(staticMiddleware);

swig.renderFile(__dirname + '/views/index.html', {}, function (err, output) {
	if (err) throw err;
	console.log(output);
});

// templating boilerplate setup
app.set('views', path.join(__dirname, '/views')); // where to find the views
app.set('view engine', 'html'); // what file extension do our templates have
app.engine('html', swig.renderFile); // how to render html templates
swig.setDefaults({
	cache: false
});

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({
	extended: true
})); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests



var server = app.listen(1300, function(){
	console.log("listening on port 1300")
})

// modular routing that uses io inside it
app.use('/', makesRouter);
