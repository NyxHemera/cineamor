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
	return currentUser ? ""+currentUser._id === id : false;
}

function makeError(res, message, status) {
	res.statusCode = status;
	var error = new Error(message);
	error.status = status;
	return error;
}

// Take OMDB and convert to DB object
function parseOMDB(movie, collection) {
	console.log(movie);
	console.log(movie.Poster);
	var newMovie = {
		title: movie.Title,
		poster: movie.Poster,
		year: movie.Year,
		releaseDate: movie.Released,
		runtime: movie.Runtime,
		genre: movie.Genre.split(', '),
		actors: movie.Actors.split(', '),
		director: movie.Director,
		plot: movie.Plot,
		metascore: movie.Metascore,
		imdbRating: movie.imdbRating,
		type: movie.Type,
		imdbID: movie.imdbID,
		collections: [collection]
	};
	return newMovie;
}

//---------------------------------------//
//	Collection Index - GET  						 //
//---------------------------------------//
router.get('/', function(req, res, next) {
	Collection.find()
	.then(function(collections) {
		//res.render('collection/index.ejs', { currentUser: currentUser, collections: collections });
		res.json(collections);
	});
});

//---------------------------------------//
//	Collection New - POST								 //
//---------------------------------------//
router.post('/new', function(req, res, next) {
	if(currentUser) {
		var newCol = {
			name: 'Default Name',
			movies: [],
			owner: currentUser,
			users: [currentUser],
			forkOf: null
		};
		Collection.create(newCol, function(err, collection) {
			currentUser.collections.push(newCol);
			currentUser.save();
			res.json(newCol);
		});	
	}else {
		console.log(currentUser);
		res.json({result: 'failed'});
	}
});

//---------------------------------------//
//	Collection Show - GET & PUT					 //
//---------------------------------------//
router.route('/:cid')
	.get(function(req, res, next) {
		Collection.findById(req.params.cid)
		.populate('movies')
		.populate('owner')
		.populate('users')
		.populate('forkOf')
		.exec(function(err, collection) {
			console.log(collection.movies);
			console.log(collection.users);
			//res.render('collection/collection.ejs', { collection: collection, isOwner: authorized(""+collection.owner), currentUser: currentUser });
			res.json(collection);
		});
	})
	.put(function(req, res, next) {
		var m;
		var c;
		Collection.findById(req.params.cid)
		.then(function(collection) {
			c = collection;
			if(true/*authorized(""+collection.owner)*/) {
				Movie.findOne({'imdbID' : req.body.imdbID}, function(err, movie) {
					// If movie is already in database, no need to create
					if(movie) {
						m = movie;
						m.collections.push(c);
						m.save()
						.then(function() {
							c.movies.push(m);
							c.save();
							res.json(c);
						});
					}else {
						Movie.create(parseOMDB(req.body, collection), function(err, created) {
							console.log(err);
							console.log('created 1 movie');
							c.movies.push(created);
							c.save();
							res.json(c);
						});
					}
				});
			}else {
				console.log('put denied');
			}
		}, function(err) {
			return next(err);
		});
	});

//---------------------------------------//
//	Collection Edit - GET								 //
//---------------------------------------//
router.route('/cid/edit')
	.get(authenticate, function(req, res, next) {
		// Not correct authorization
		if(authorized(req.params.id)) {
			res.render('collection/editcollection.ejs', { });
		}else {
			res.redirect('/collections');
		}
	});


module.exports = router;