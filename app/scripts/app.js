// Declare Angular module
var blocJams = angular.module('blocJams', ['ui.router']);

blocJams.config( function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  // Add album state.
  // Pass in state name and config options.
  $stateProvider
    .state('landing', {
      url: '/',
      controller: 'Landing.controller',
      templateUrl: '/templates/landing.html'
    })
    .state('collection', {
      url: '/collection',
      controller: 'Collection.controller',
      templateUrl: '/templates/collection.html'
    })
    .state('album', {
      url: '/album',
      controller: 'Album.controller',
      templateUrl: '/templates/album.html'
    })

});

blocJams.controller('blocJams', function($scope) {

});
