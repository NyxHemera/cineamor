angular.module('cineAmorApp')
.controller('mainCtrl', function($mdSidenav, $stateParams, $state, $http) {
	var vm = this;

	vm.msRevealed = false;

	vm.createNewCollection = function() {
		$http.post('/collections/new', {})
		.then(function(results) {
			console.log('success');
			console.log(results);
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