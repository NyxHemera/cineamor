var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Home Page
router.get('/', function(req, res, next) {
	console.log(req.user);
	res.render('index', { title: 'Express', message: req.flash() });
});

router.get('/currentUser', function(req, res, next) {
	console.log('!!!' + currentUser);
	User.populate(currentUser, {path: 'collections', model: 'Collection'}, function(err, user) {
		res.json(user);
	});
})

// Signup Page
router.route('/signup')
	.get(function(req, res, next) {
		res.render('signup.ejs', { message: req.flash() });
	})
	.post(passport.authenticate('local-signup'), function(req, res) {
		//if (err) { return res.json({result: 'Error'}); }
		console.log(req);
		if (!req.user) { 
			return res.json({result: info}); 
		}else {
			return res.json({result: 'Success', user: req.user});
		}
	});

// Login Page
router.route('/login')
	.get(function(req, res, next) {
		res.render('login.ejs', { message: req.flash() });
	})
	.post(passport.authenticate('local-login'), function(req, res) {
		console.log('passed authenticate');
		console.log(res);
		console.log('!!!');
		console.log(req.user);
		User.populate(req.user, {path: 'collections', model: 'Collection'}, function(err, user) {
			console.log('???');
			console.log(user);
			console.log(currentUser);
			res.json(user);
		});
	});

router.get('/search', function(req, res, next) {
	res.render('movie/search.ejs', {});
});

// Logout
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

module.exports = router;