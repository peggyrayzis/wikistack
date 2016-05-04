var express = require('express');
var router = express.Router();
// var models = require('./models');

router.get('/', function (req, res, next) {
	res.render('index', {});
	// res.send('got to GET /wiki/');
	// next()
});

// router.get('/', function(req, res, next) {
//   res.send('got to GET /wiki/');
// });

router.post('/', function(req, res, next) {
  res.send('got to POST /wiki/');
});

router.get('/add', function(req, res, next) {
  res.send('got to GET /wiki/add');
});

module.exports = router;
