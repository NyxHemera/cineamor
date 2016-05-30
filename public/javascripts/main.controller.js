angular.module('cineAmorApp')
.controller('mainCtrl', function($mdSidenav, $stateParams, $state, $http, CollectionsService) {
	var vm = this;

	vm.msRevealed = false;
	vm.user;
	vm.email;
	vm.password;

	vm.submitLogin = function() {
		console.log(vm.email);
		console.log(vm.password);
		$http.post('/login', {email: vm.email, password: vm.password})
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
		$state.go('collections');
	}

	vm.createNewCollection = function() {
		$http.post('/collections/new', {user: vm.user, email: vm.email, password: vm.password})
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

	vm.showMovieSearch = function() {
		vm.msRevealed = !vm.msRevealed;
	}

	vm.openLeftMenu = function() {
		$mdSidenav('left').toggle();
	};
});