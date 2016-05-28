angular.module('cineAmorApp')
.controller('mainCtrl', function($mdSidenav) {
	var vm = this;

	vm.openLeftMenu = function() {
		$mdSidenav('left').toggle();
	};
});