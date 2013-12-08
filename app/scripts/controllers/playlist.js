'use strict';

myApp.controller('PlaylistCtrl', function ($scope, $rootScope, Constants, PlayListService) {
    $scope.myPlayer;
    $scope.playlist = {};
    $scope.playlist.playlist = PlayListService.playlist.playlist;
    var refreshIntervalId;

    var refreshInterval = function () {
        if (!$scope.myPlayer || !$scope.myPlayer.currentTime) {
            clearInterval(refreshIntervalId);
            return;
        }

        PlayListService.updateProgress($scope.myPlayer.currentTime);
        if ($scope.myPlayer.currentTime >= $scope.myPlayer.seekable.end || $scope.myPlayer.ended){
            console.log('end of audio');
            $scope.finishNext();
        }
    };

    $scope.playItem = function (item) {
        clearInterval(refreshIntervalId);

        console.log('play ', item);
        $scope.playlist.curPlaying = item;
        PlayListService.updateCurPlaying(item);
        updatePlayer();

        $scope.myPlayer.play();
        refreshIntervalId = setInterval(refreshInterval, 3000);
    };

    $scope.removeItem = function (item) {
        clearInterval(refreshIntervalId);

        if (!!$scope.playlist.curPlaying && $scope.myPlayer && $scope.playlist.curPlaying.audio === item)
            $scope.myPlayer.pause();

        PlayListService.removeItem(item);
    };

    $scope.finishNext = function () {
        clearInterval(refreshIntervalId);

        console.log('finish_next ');
        if (!!$scope.playlist.curPlaying && $scope.myPlayer)
            $scope.myPlayer.pause();

        PlayListService.removeItem($scope.playlist.curPlaying);

        $rootScope.$broadcast(Constants.NEXT_POD);
    };

    var updatePlayer = function () {
        $scope.myPlayer = document.getElementById("playlistplayer");
        if (!$scope.myPlayer)
            return;
        console.log('updatePlayer', $scope.myPlayer);

        $scope.playlist.curPlaying = PlayListService.playlist.curPlaying;

        $scope.myPlayer.type = PlayListService.getCurType();
        $scope.myPlayer.src = PlayListService.getCurAudio();
    };

    (function () {
        clearInterval(refreshIntervalId);
    })();

    $scope.$on(Constants.INIT_PLAY, function (event, data) {
        console.log(Constants.INITTED);
        updatePlayer();
        $scope.myPlayer.play();
        refreshIntervalId = setInterval(refreshInterval, 3000);
    });

    $scope.$on(Constants.INITTED, function (event, data) {
        console.log(Constants.INITTED);
        updatePlayer();
        refreshIntervalId = setInterval(refreshInterval, 3000);
    });

    $rootScope.$broadcast(Constants.INIT_PODS);

});
