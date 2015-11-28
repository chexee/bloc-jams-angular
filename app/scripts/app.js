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

// Controllers

blocJams.controller('Landing', function ($scope) {
  $scope.tagline = 'Turn the music up!'
})

blocJams.controller('Collection', function ($scope) {
  $scope.albums = [albumPicasso, albumRothko, albumMarconi]
})

blocJams.controller('Album', function ($scope, SongPlayer) {
  $scope.album = albumPicasso
  SongPlayer.currentAlbum = $scope.album

  $scope.isCurrentSong = function(song) {
    return SongPlayer.isCurrentSong(song)
  }
  $scope.playSong = function () {
    if (!SongPlayer.currentSong) {
      SongPlayer.playSong(SongPlayer.currentAlbum.songs[0])
    } else {
      SongPlayer.playSong(this.song)
    }
  }
  $scope.pauseSong = function () {
    SongPlayer.pauseSong()
  }
  $scope.isPlaying = function () {
    return SongPlayer.isPlaying
  }
})

// Services

blocJams.service('SongPlayer', function () {
  return {
    isPlaying: false,
    currentAlbum: '',
    currentSong: '',
    currentVolume: '',
    currentSongFile: null,
    pauseSong: function () {
      this.isPlaying = false
      this.currentSoundFile.pause()
    },
    playSong: function (song) {
      if (this.isPlaying) {
        this.pauseSong()
      }
      this.isPlaying = true
      if (song) {
        this.setCurrentSong(song)
      }
      this.currentSoundFile.play()
    },
    setCurrentSong: function (song) {
      this.currentSong = song
      this.currentSoundFile = new buzz.sound (this.currentSong.audioUrl, {
        formats: ['mp3'],
        preload: true
      })
    },
    setVolume: function (amount) {
      if (this.currentSongfile) {
        this.currentSoundFile.setVolume(amount)
      }
      this.currentVolume = amount;
    },
    isCurrentSong: function (song) {
      return song === this.currentSong
    },
    goToNext: function () {
    },
    goToPrevious: function () {
    },


  }
})
