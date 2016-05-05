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
		.catch(next)

	// res.render('index', {});
	// res.redirect('/');
	// res.send('got to GET /wiki/');
	// next()
});

router.post('/', function(req, res, next) {
  User.findOrCreate({
	where: {
	  	name: req.body.authorName,
	  	email: req.body.authorEmail
	}
  })
  .then(function(values){
  	// could also use .spread here (bluebird). it takes the arr and spreads it out over several params
  	var user = values[0];
  	
  	// var tagsArr = req.body.tags.split(" ")

  	var page = Page.build({
	  	title: req.body.title,
	  	content: req.body.pageContent,
	  	status: req.body.pageStatus,
	  	tags: req.body.tags
	});


	return page.save().then(function(page){
		return page.setAuthor(user)
	})

  })
  .then(function(page){
  		res.redirect(page.route);
  	}).catch(next);
});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/search', function (req, res, next) {
    Page.findByTag(req.query.tags)
        .then(function (pages) {
            res.render('index', {
                pages: pages
            });
        })
        .catch(next);

});

router.get('/:urlTitle', function (req, res, next) {
  Page.findOne({ 
    where: { 
      urlTitle: req.params.urlTitle 
    } 
  })
  .then(function(foundPage){
  	var tagStr = foundPage.tags.join(", ")
  	var findingAuthor = foundPage.getAuthor()
  	findingAuthor.then(function(author){
  		res.render('wikipage', {
    		page: foundPage,
    		author: author,
    		tags: tagStr
    	});
  	});
  })
  .catch(next);
});

router.get('/:urlTitle/delete', function (req, res, next) {

    Page.destroy({
            where: {
                urlTitle: req.params.urlTitle
            }
        })
        .then(function () {
            res.redirect('/wiki');
        })
        .catch(next);

});

router.get('/:urlTitle/similar', function (req, res, next) {

    Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            }
        })
        .then(function (page) {
            if (page === null) {
                res.status(404).send();
            } else {
                return page.findSimilar()
                    .then(function (pages) {
                        res.render('index', {
                            pages: pages
                        });
                    });
            }
        })
        .catch(next);

});


module.exports = router;
