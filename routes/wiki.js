var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function (req, res, next) {
	Page.findAll()
		.then(function(foundPages){
			res.render('index', {
				pages: foundPages
			})
		})

	// res.render('index', {});
	// res.redirect('/');
	// res.send('got to GET /wiki/');
	// next()
});

router.post('/', function(req, res, next) {
  var page = Page.build({
  	title: req.body.title,
  	content: req.body.pageContent,
  	status: req.body.status
  });
  page.save()
  	.then(function(savedPage){
  		res.redirect(savedPage.route);
  	}).catch(next);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({ 
    where: { 
      urlTitle: req.params.urlTitle 
    } 
  })
  .then(function(foundPage){
    res.render('wikipage', {
    	page: foundPage
    });
  })
  .catch(next);

});

module.exports = router;
