angular.module('cineAmorApp')
.service('CollectionsService', function($http, $stateParams) {
	var vm = this;

	vm.loadAllCollections = function() {
		console.log('loadingAllCollection');
		console.log($stateParams);
		$http.get('/collection').success(function(data) {
			return data;
		});
	};

	vm.loadUserCollections = function(user) {
		$http.get('/'+user._id+'/collections').success(function(data) {
			return data;
		});
	};

	vm.loadCollection = function(collection) {
		$http.get('/collections/'+collection._id).success(function(data) {
			return data;
		});
	}
});