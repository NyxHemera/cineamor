var mongoose = require('mongoose');
var User = require('./models/user');
var Collection = require('./models/collection');
var Movie = require('./models/movie');

var usersArr;

mongoose.connect('mongodb://localhost/cineamor');

// our script will not exit until we have disconnected from the db.
function quit() {
	mongoose.disconnect();
	console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
	console.log('ERROR:', err);
	quit();
	return err;
}

console.log('removing old Users...');
User.remove({})
.then(function() {
	console.log('old Users removed');
	console.log('creating some new Users...');
	var user1  = new User({
		local: {
			email: 'test1@gmail.com',
			password: 'Password1234'
		},
		favGenres: ['Action', 'Horror', 'Comedy'],
		collections: []
	});
  var user2  = new User({
    local: {
      email: 'test1@gmail.com',
      password: 'Password1234'
    },
    favGenres: ['Comedy', 'Sci-Fi', 'Horror'],
    collections: []
  });
    var user3  = new User({
    local: {
      email: 'test1@gmail.com',
      password: 'Password1234'
    },
    favGenres: ['Action', 'Adventure'],
    collections: []
  });
	user1.local.password = user1.encrypt('Password1234');
	user2.local.password = user1.encrypt('Password1234');
	user3.local.password = user1.encrypt('Password1234');
	var users = [user1, user2, user3];
	return User.create(users);
})
.then(function(savedUsers) {
	console.log('Just saved', savedUsers.length, 'Users');
	//quit();
	usersArr = savedUsers;
	var collection1 = new Collection({
		name: 'SciFi Collection',
		movies: [],
		owner: null,
		users: [],
		forkOf: null
	});
	collection1.owner = savedUsers[0];
	collection1.users.push(savedUsers[0]);
	console.log(collection1);
	return Collection.create([collection1]);	
})
.then(function(savedCollection) {
	usersArr[0].collections.push(savedCollection[0]);
	usersArr[0].save(function() {
		quit();
	});
});