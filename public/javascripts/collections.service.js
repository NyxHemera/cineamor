angular.module('cineAmorApp')
.service('CollectionsService', function($http, $stateParams) {
	var vm = this;

	vm.isOwner = function(user, cid) {
		console.log(user);
		console.log(cid);
		return true;
/*		if(cid) {
			$http.get('/collections/'+cid).success(function(data) {
				console.log(user._id);
				console.log(data);
				console.log(data.owner._id);
				if(user._id === data.owner._id) {
					return true;
				}else {
					return false;
				}
			});
		}else {
			return false;
		}*/
	}

	vm.loadAllCollections = function() {
		console.log('loadingAllCollection');
		console.log($stateParams);
		$http.get('/collections').success(function(data) {
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