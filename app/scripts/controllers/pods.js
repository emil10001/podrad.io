'use strict';

angular.module('intellijWorkspaceApp')
.controller('PodsCtrl', function ($scope) {
    $scope.myPods = [
        {'name' : 'Planet Money',
            'url' : 'http://www.npr.org/rss/podcast.php?id=510289'},
            {'name' : 'Dunk Tank w/ Brian and Chet',
                'url' : 'http://www.dunktankpodcast.com/1/feed'}
    ];
    $scope.deletePod = function(toDelete){
        if (confirm('really delete ' + toDelete.name + '?'))
            $scope.myPods.splice($scope.myPods.indexOf(toDelete),1);
    };
    $scope.addPod = function(){
        $scope.myPods.push({'name': $scope.name, 'url': $scope.url});
        $scope.name = '';
        $scope.url = '';
    };
});
