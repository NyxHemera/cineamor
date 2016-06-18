angular.module('cineAmorApp')
.controller('mainCtrl', function($mdSidenav, $stateParams, $state, $http, CollectionsService) {
	var vm = this;

	vm.msRevealed = false;
	vm.miRevealed = false;
	vm.user;
	vm.email;
	vm.password;

	vm.checkCurrentUser = function() {
		$http.get('/currentUser')
		.then(function(results) {
			console.log(results);
			if(results.data) {
				vm.user = results.data;
			}
		});
	}

	vm.checkCurrentUser();

	vm.submitLogin = function() {
		console.log(vm.email);
		console.log(vm.password);
		$http.post('/login', {email: vm.email, password: vm.password})
		.then(function(response) {
			if(response.data) {
				console.log('Success!');
				console.log(response);
				vm.user = response.data;
				vm.errorMessage = undefined;
				$state.go('userCollections', {userId: vm.user._id});
			}else {
				console.log('Failure!');
				vm.errorMessage = 'Incorrect Email or Password';
			}
		});
	}

	vm.submitSignup = function() {
		console.log(vm.email);
		console.log(vm.password);
		$http.post('/signup', {email: vm.email, password: vm.password})
		.then(function(response) {
			if(response.data.result === 'Success') {
				console.log('Success!');
				console.log(response.data.user);
				vm.user = response.data.user;
				$state.go('userCollections', {userId: vm.user._id});
			}else {
				console.log('Failure!');
			}
		});
	}

	vm.logout = function() {
		console.log(vm.email);
		vm.user = undefined;
		vm.email = undefined;
		vm.password = undefined;
		$state.go('home');
	}

	vm.createNewCollection = function() {
		console.log('submitted');
		$http.post('/collections/new', {user: vm.user, email: vm.email, password: vm.password, collectionName: vm.cName})
		.then(function(results) {
			console.log('success');
			console.log(results);
			vm.user = results.data.user;
			console.log(vm.user);
			$state.go('collection', {collectionId: results.data.collection._id})
		});
	}

	vm.isCollectionPage = function() {
		return $state.current.name === 'collection';
	}

	vm.isHomePage = function() {
		return $state.current.name === 'home';
	}

	vm.showMovieSearch = function() {
		vm.msRevealed = !vm.msRevealed;
	}

	vm.closeSearch = function() {
		vm.msRevealed = false;
	}

	vm.showMovieInfo = function() {
		vm.miRevealed = !vm.miRevealed;
	}

	vm.closeMovieInfo = function() {
		vm.miRevealed = false;
	}

	vm.isOwner = function() {
		if(!vm.user) {
			return false;
		}else{
			for(var i=0; i<vm.user.collections.length; i++) {
				if(vm.user.collections[i]._id === $stateParams.collectionId) {
					return true;
				}
			}
			return false;
		}
	}

	vm.openLeftMenu = function() {
		console.log('test');
		$mdSidenav('left').toggle();
	};
});