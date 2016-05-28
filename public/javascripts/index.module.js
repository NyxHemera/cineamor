angular.module('cineAmorApp', ['ngMaterial', 'ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/");

	var home = {
		name: 'home',
		url: '/',
		templateUrl: 'partials/home.html',
		onEnter: function() {
			console.log('home');
		}
	};
	var login = {
		name: 'login',
		url: '/login',
		templateUrl: 'partials/login.html',
		onEnter: function() {
			console.log('login');
		}
	};
	var signup = {
		name: 'signup',
		url: '/signup',
		templateUrl: 'partials/signup.html'
	};
	var collections = {
		name: 'collections',
		url: '/collections',
		templateUrl: 'partials/collections.html',
		controller: 'collectionsCtrl',
		controllerAs: 'csvm',
		onEnter: function() {
			console.log('collections');
		}
	};
	var userCollections = {
		name: 'userCollections',
		url: '/:userId',
		templateUrl: 'partials/users.collections.html',
		controller: 'collectionsCtrl',
		controllerAs: 'csvm'
	};
	var collection = {
		name: 'collection',
		url: '/collections/:collectionId',
		templateUrl: 'partials/collection',
		controller: 'collectionsCtrl',
		controllerAs: 'csvm'
	};

	$stateProvider.state(home);
	$stateProvider.state(login);
	$stateProvider.state(signup);
	$stateProvider.state(collections);
	$stateProvider.state(userCollections);
	$stateProvider.state(collection);
});