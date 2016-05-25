var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Movie = new mongoose.Schema({
	title: String,
	image: String,
	year: Number,
	releaseDate: String,
	runtime: String,
	genre: [],
	actors: [],
	director: String,
	plot: String,
	metascore: Number,
	imdbRating: Number,
	type: String,
	collections: [ { type: ObjectId, ref: 'User' } ],
	imdbID: String
});

module.exports = mongoose.model('Movie', Movie);