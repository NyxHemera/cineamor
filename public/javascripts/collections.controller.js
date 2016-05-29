angular.module('cineAmorApp')
.controller('collectionsCtrl', function(collectionsPromise, collectionPromise, CollectionsService, $state) {
	var vm = this;

	vm.collection = collectionPromise.data;
	vm.collections = collectionsPromise.data;// = CollectionsService.loadAllCollections();

	console.log(vm.collections);
	console.log(vm.collection);
	vm.openCollection = function(collection) {
		$state.go('collection', {collectionId: collection._id});
	};
});