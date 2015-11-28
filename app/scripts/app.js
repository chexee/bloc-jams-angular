// Declare Angular module
var blocJams = angular.module('blocJams', ['ui.router'])

blocJams.config(function ($stateProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  })

  // Add album state.
  // Pass in state name and config options.
  $stateProvider
    .state('landing', {
      url: '/',
      controller: 'Landing',
      templateUrl: '/templates/landing.html'
    })
    .state('collection', {
      url: '/collection',
      controller: 'Collection',
      templateUrl: '/templates/collection.html'
    })
    .state('album', {
      url: '/album',
      controller: 'Album',
      templateUrl: '/templates/album.html'
    })
})

blocJams.controller('Landing', function ($scope) {
  $scope.tagline = 'Turn the music up!'
})

blocJams.controller('Collection', function ($scope) {
  $scope.albums = [albumPicasso, albumRothko, albumMarconi]
})

blocJams.controller('Album', function ($scope) {})
