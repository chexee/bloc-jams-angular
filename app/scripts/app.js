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

  $scope.isCurrentSong = function (song) {
    return SongPlayer.isCurrentSong(song)
  }
  $scope.isPlaying = function () {
    return SongPlayer.isPlaying
  }
  $scope.playSong = function (song) {
    SongPlayer.playSong(song)
    $scope.updatePlayerBar()

  }
  $scope.pauseSong = function () {
    SongPlayer.pauseSong()
  }
  $scope.updatePlayerBar = function () {
    SongPlayer.currentSoundFile.bind('timeupdate', function(){
      $scope.currentTime = buzz.toTimer( SongPlayer.currentSoundFile.getTime() )
      $scope.currentSongName = SongPlayer.currentSong.name
      $scope.currentSongLength = buzz.toTimer( SongPlayer.currentSoundFile.getDuration() )
      $scope.$apply()
    })
  }
  $scope.goToNext = function () {
    SongPlayer.goToNext()
    $scope.updatePlayerBar()
  }
  $scope.goToPrevious = function () {
    SongPlayer.goToPrevious()
    $scope.updatePlayerBar()
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

  $scope.setVolume = function(amount) {
    SongPlayer.setVolume(amount)
    $scope.volume = amount
  }


  var albums = [albumPicasso, albumRothko, albumMarconi]
  if (!SongPlayer.currentAlbum) {
    $scope.album = albums[0]
    SongPlayer.currentAlbum = $scope.album
  } else {
    $scope.album = SongPlayer.currentAlbum
  }

})

// Directives

blocJams.directive('slider', function () {
  return {
    restrict: 'E',
    templateUrl: '/templates/slider.html',
    scope: {
      value: '=type'
    },
    link: function(scope, element, attrs){
      var $thumb = angular.element(element[0].querySelector('.thumb'))
      var $fill = angular.element(element[0].querySelector('.fill'))

      var getSliderFillRatioOnEvent = function () {
        var sliderPosition = element[0].getBoundingClientRect()
        var sliderWidth = sliderPosition.right - sliderPosition.left
        var offsetX = Math.max(0, event.clientX - sliderPosition.left);
        return Math.min(1, (offsetX / sliderWidth))
      }

      var updateSlider = function(sliderFillRatio) {
        $fill.css('width', sliderFillRatio * 100 + '%')
        $thumb.css('left', sliderFillRatio * 100 + '%')
        scope.value = sliderFillRatio * 100
      }

      element.on('mousedown', function (event) {
        angular.element(document).bind('mousemove', function(event){
          updateSlider(getSliderFillRatioOnEvent())
        })
        angular.element(document).bind('mouseup', function(){
          angular.element(document).unbind('mousemove')
          angular.element(document).unbind('mouseup')
        })
      })
      element.on('click', function () {
        updateSlider(getSliderFillRatioOnEvent())
      })

    }
  }
});

// Services

blocJams.service('SongPlayer', function () {
  return {
    isPlaying: false,
    currentAlbum: '',
    currentSong: '',
    currentVolume: '',
    currentSoundFile: null,
    pauseSong: function () {
      this.isPlaying = false
      this.currentSoundFile.pause()
    },
    playSong: function (song) {
      buzz.all().pause()
      if (song) {
        this.setCurrentSong(song)
      } else if (!this.currentSong) {
        this.setCurrentSong(this.currentAlbum.songs[0])
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
      if (this.currentSoundFile) {
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
