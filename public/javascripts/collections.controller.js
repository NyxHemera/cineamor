angular.module('cineAmorApp')
.controller('collectionsCtrl', function() {
	var vm = this;

	vm.collection;
	vm.collections;

	vm.loadAllCollections = function() {
		console.log('loadingAllCollection');
		$http.get('/collection').success(function(data) {
			vm.collections = data;
		});
	};

	vm.loadUserCollections = function(user) {
		$http.get('/'+user._id+'/collections').success(function(data) {
			vm.collections = data;
		});
	};

	vm.loadCollection = function(collection) {
		$http.get('/collections/'+collection._id).success(function(data) {
			vm.collection = data;
		});
	}

	vm.openCollection = function(collection) {
		$state.go('collection', {collectionId: collection._id});
	};
});