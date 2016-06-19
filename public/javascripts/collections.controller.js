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
	vm.key = '3320eaacc515c2e2e26d63a0d097bad0';
	vm.GBKEY = 'rKq97wCG4JY5omkelS8v8cefJipTHSZD';
	vm.GBST = 'https://api-public.guidebox.com/v1.43/US/';
	vm.GBIMDB = '/search/movie/id/imdb/';
	vm.GBID = '/movie/';

	vm.getTMDBConfig = function() {
		$http.get('https://api.themoviedb.org/3/configuration?api_key=3320eaacc515c2e2e26d63a0d097bad0')
		.then(function(result) {
			console.log(result);
			vm.base_url = result.data.images.base_url;
			vm.secure_base_url = result.data.images.secure_base_url;
			vm.backdrop_sizes = result.data.images.backdrop_sizes;
			vm.poster_sizes = result.data.images.poster_sizes;
		});
	}

	vm.getTMDBConfig();

	vm.existsInCollection = function() {
		for(var i=0; i<vm.collection.movies.length; i++) {
			if(vm.itemShown && vm.itemShown.imdbID === vm.collection.movies[i].imdbID) {
				return true;
			}
		}
		return false;
	}

	vm.removeMovieFromCollection = function() {
		$http.put('/collections/'+vm.collection._id+'/removeMovie', vm.itemShown)
			.then(function(collection) {
				console.log('Movie Removed');
				vm.reloadCollection();
				vm.reloadCollections();
			});
	}

	// Pull playback sources from guidebox. Doesn't have netflix...bummer
	vm.getSources = function(movie) {
		console.log('GETSOURCES');
		$http.get(vm.GBST + vm.GBKEY + vm.GBIMDB + movie.imdbID)
		.then(function(res) {
			console.log(res.data);
			$http.get(vm.GBST + vm.GBKEY + vm.GBID + res.data.id)
			.then(function(res2) {
				console.log(res2.data);

			});
		});
	}

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
		//vm.getSources(movie);
		$http.get('https://www.omdbapi.com/?i='+ movie.imdbID)
			.then(function(results) {
				$http.get('https://api.themoviedb.org/3/find/'+ movie.imdbID + '?external_source=imdb_id&api_key=' + vm.key)
				.then(function(results2) {
					results.data.Poster = vm.base_url + vm.poster_sizes[4] + '/' + results2.data.movie_results[0].poster_path;
					vm.itemShown = results.data;
				});
				//vm.itemShown = results.data;
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
		if(collection.movies[0]) {
			return collection.movies[0].poster;
		}else {
			return 'http://image.tmdb.org/t/p/w500//hBIiCg7BovnPHFOxurKEp5hidV4.jpg';
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