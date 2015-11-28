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

blocJams.controller('Collection', function ($scope, SongPlayer) {
  $scope.albums = [albumPicasso, albumRothko, albumMarconi]

  $scope.setAlbum = function () {
    SongPlayer.setAlbum(this.album)
  }
})

blocJams.controller('Album', function ($scope, SongPlayer) {
  var albums = [albumPicasso, albumRothko, albumMarconi]
  if (!SongPlayer.currentAlbum) {
    $scope.album = albums[0]
  } else {
    $scope.album = SongPlayer.currentAlbum
  }

  $scope.isCurrentSong = function (song) {
    return SongPlayer.isCurrentSong(song)
  }
  $scope.isPlaying = function () {
    return SongPlayer.isPlaying
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
  $scope.goToNext = function () {
    SongPlayer.goToNext()
  }
  $scope.goToPrevious = function () {
    SongPlayer.goToPrevious()
  }
  $scope.goToNextAlbum = function() {
    var albumIndex = albums.indexOf(SongPlayer.currentAlbum)
    if (albumIndex === albums.length - 1) {
      albumIndex = 0
    } else {
      albumIndex++
    }
    SongPlayer.setAlbum(albums[albumIndex])
    $scope.album = SongPlayer.currentAlbum
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
      buzz.all().pause()
      if (song) {
        this.setCurrentSong(song)
      }
      this.currentSoundFile.play()
      this.isPlaying = true
    },
    setAlbum: function (album) {
      this.currentAlbum = album;
    },
    setCurrentSong: function (song) {
      this.currentSong = song
      this.currentSoundFile = new buzz.sound(this.currentSong.audioUrl, {
        formats: ['mp3'],
        preload: true
      })
    },
    setVolume: function (amount) {
      if (this.currentSongfile) {
        this.currentSoundFile.setVolume(amount)
      }
      this.currentVolume = amount
    },
    isCurrentSong: function (song) {
      return song === this.currentSong
    },
    goToNext: function () {
      if (!this.currentSong) {
        alert('Start playing some music first!')
        return
      }
      var songsArr = this.currentAlbum.songs
      var currentSongIndex = songsArr.indexOf(this.currentSong)

      if (currentSongIndex === songsArr.length - 1) {
        this.setCurrentSong(songsArr[0])
      } else {
        currentSongIndex++
        this.setCurrentSong(songsArr[currentSongIndex])
      }

      // If previous song was playing, play next. Otherwise, keep paused.
      if (this.isPlaying) { this.playSong() }
    },
    goToPrevious: function () {
      if (!this.currentSong) {
        alert('Start playing some music first!')
        return
      }

      var songsArr = this.currentAlbum.songs
      var currentSongIndex = songsArr.indexOf(this.currentSong)

      if (currentSongIndex === 0) {
        this.setCurrentSong(songsArr[songsArr.length - 1])
      } else {
        currentSongIndex--
        this.setCurrentSong(songsArr[currentSongIndex])
      }

      // If previous song was playing, play next. Otherwise, keep paused.
      if (this.isPlaying) { this.playSong() }
    }

  }
})
