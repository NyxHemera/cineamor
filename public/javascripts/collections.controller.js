angular.module('cineAmorApp')
.controller('collectionsCtrl', function(collectionsPromise, collectionPromise, userCollectionsPromise, CollectionsService, $state, $http) {
	var vm = this;

	vm.collection = collectionPromise.data;
	vm.collections = collectionsPromise.data;
	vm.userCollections = userCollectionsPromise.data;

	vm.querySearch = querySearch;
	vm.selectedItemChange = selectedItemChange;
	vm.searchTextChange = searchTextChange;
	//vm.cid = currentCollection;
	vm.addMovieToCollection = addMovieToCollection;

	vm.reloadCollection = function() {
		$http.get('/collections/'+vm.collection._id)
		.then(function(results) {
			console.log(results);
			console.log('reloaded collection');
			vm.collection = results.data;
		});
	}

	vm.reloadCollections = function() {
		$http.get('/collections')
		.then(function(results) {
			vm.collections = results.data;
		});
	}

	vm.openCollection = function(collection) {
		$state.go('collection', {collectionId: collection._id});
	};

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
		$http.get('https://www.omdbapi.com/?i='+ movie.imdbID)
			.then(function(results) {
				vm.itemShown = results.data;
			});
	}

	function addMovieToCollection() {
		console.log('AMTC called');
		$http.put('/collections/'+vm.collection._id, vm.itemShown)
			.then(function(collection) {
				console.log('Movie Saved');
				vm.reloadCollection();
				vm.reloadCollections();
			});
	}

	vm.switchItem = function(movie) {
		console.log('switched');
		console.log(movie);
		vm.itemShown = movie;
	}

	vm.getCollectionThumb = function(collection) {
		console.log(collection);
		if(collection.movies[0]) {
			return collection.movies[0].poster;
		}else {
			return 'http://ia.media-imdb.com/images/M/MV5BMTg1MjQyMDQ4MV5BMl5BanBnXkFtZTgwMTg3ODA4MjE@._V1_SX300.jpg';
		}
	}


	// Search Functions
	function querySearch(query) {
/*		return $http.get('http://imdb.wemakesites.net/api/search?q=' + query)
			.then(function(results) {
				console.log(results);
				if(results.data.data.results.titles) {
					return processData(results.data.data.results.titles);
				}else {
					return [];
				}
			});*/
		return $http.get('https://www.omdbapi.com/?s=' + query + '&type=movie')
			.then(function(results) {
				if(results.data.Search) {
					return processData(results.data.Search);
				}else {
					return [];
				}
			});
	}

  function processData(data) {

  	return data.map(function(movie) {
  		return {
  			value: movie.Title.toLowerCase(),
  			display: movie.Title,
  			Title: movie.Title,
  			imdbID: movie.imdbID,
  			Year: movie.Year
  		};
  	});
  }
});