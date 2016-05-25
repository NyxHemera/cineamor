var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Collection = new mongoose.Schema({
	name: String,
	movies: [ { id: ObjectId, rating: Number } ],
	owner: { type: ObjectId, ref: 'User' },
	users: [ { type: ObjectId, ref: 'User' } ],
	forkOf: { type: ObjectId, ref: 'Collection'}
});

module.exports = mongoose.model('Collection', Collection);