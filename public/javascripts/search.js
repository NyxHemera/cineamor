'use strict';
angular.module('searchApp', ['ngMaterial', 'ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/collections/:cid', {
		controller: 'searchCtrl'
	});

	$locationProvider.html5Mode(true);
})
.controller('searchCtrl', function($http) {
	var vm = this;

	vm.querySearch = querySearch;
	vm.selectedItemChange = selectedItemChange;
	vm.searchTextChange = searchTextChange;
	vm.cid = currentCollection;
	vm.addMovieToCollection = addMovieToCollection;

	function searchTextChange(text) {
		console.log('Text changed to ' + text);
	}

	function selectedItemChange(item) {
		console.log('Item changed to ' + JSON.stringify(item));
		if(item) {
			loadMovieToPage(item);
		}
	}

	function loadMovieToPage(movie) {
		$http.get('http://www.omdbapi.com/?i='+ movie.imdbID)
			.then(function(results) {
				vm.itemShown = results.data;
			});
	}

	function addMovieToCollection() {
		console.log('AMTC called');
		$http.put('/collections/'+vm.cid, vm.itemShown)
			.then(function() {
				console.log('Movie Saved');
			});
	}


	// Search Functions
	function querySearch(query) {
		return $http.get('http://www.omdbapi.com/?s=' + query + '&type=movie')
			.then(function(results) {
				if(results.data.Search) {
					return processData(results.data.Search);
				}else {
					return [];
				}
			});
	}

  function processData(data) {
  	var titles = [];
  	for(var i=0; i<data.length; i++) {
  		titles.push(data[i].Title);
  	}
  	if(titles.length === 0) {
  		titles.push("");
  	}
  	return data.map(function(movie) {
  		return {
  			value: movie.Title.toLowerCase(),
  			display: movie.Title,
  			Title: movie.Title,
  			Year: movie.Year,
  			imdbID: movie.imdbID
  		};
  	});
  }

});