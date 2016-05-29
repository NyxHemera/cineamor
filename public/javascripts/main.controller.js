angular.module('cineAmorApp')
.controller('mainCtrl', function($mdSidenav, $stateParams, $state) {
	var vm = this;

	vm.msRevealed = false;

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