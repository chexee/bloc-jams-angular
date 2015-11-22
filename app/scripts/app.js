// Declare Angular module
var blocJams = angular.module('blocJams', ['ui-router']);

blocJams.config( function ( $stateProvider, $locationProvider ) {
  $locationProvider.html5mode({
    enabled: true,
    requireBase: false
  });

  // Add album state.
  // Pass in state name and config options.
  $stateProvider.state('album', {
    url: '/album',
    controller: 'Album.controller',
    templateUrl: '/templates/album.html'
  });
});
