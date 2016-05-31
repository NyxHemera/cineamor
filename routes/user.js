var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Collection = require('../models/collection');
var Movie = require('../models/movie');


// Check if user is logged in
function authenticate(req, res, next) {
	req.isAuthenticated() ? next() : res.redirect('/');
}

// Check that user owns the page
function authorized(id) {
	return ""+currentUser._id === id;
}

function makeError(res, message, status) {
	res.statusCode = status;
	var error = new Error(message);
	error.status = status;
	return error;
}

//---------------------------------------//
//	Users Index - GET  									 //
//---------------------------------------//
router.get('/', function(req, res, next) {
  res.render('user/index.ejs', { currentUser: currentUser });
});

//---------------------------------------//
//	User Show - GET & PUT								 //
//---------------------------------------//
router.route('/:id')
	.get(function(req, res, next) {
		User.findById(req.params.id)
		.populate('collections')
		//.populate('collections.movies')
		.exec(function(err, user) {
			//res.render('user/user.ejs', { user: user, isOwner: authorized(req.params.id), currentUser: currentUser });
			User.populate(user, {path: 'collections.movies', model: 'Movie'}, function(err, newUser) {
				console.log(newUser);
				res.json(newUser);
			})
			//res.json(user);
		});
	})
	.put(authenticate, function(req, res, next) {
		if(authorized(req.params.id)) {
			// Needs to be filled in
		}
	});

//---------------------------------------//
//	User Edit - GET 										 //
//---------------------------------------//
router.route('/id/edit')
	.get(authenticate, function(req, res, next) {
		if(authorized(req.params.id)) {
			res.render('user/edituser.ejs', { currentUser: currentUser });
		}else {
			res.redirect('/users/'+ currentUser._id);
		}
	});

module.exports = router;
