'use strict';

angular.module('intellijWorkspaceApp')
    .controller('OnePodCtrl', function ($scope) {
        $scope.onePod = [
            {'name': 'Planet Money',
                'url': 'http://www.npr.org/rss/podcast.php?id=510289'},
            {'name': 'Dunk Tank w/ Brian and Chet',
                'url': 'http://www.dunktankpodcast.com/1/feed'}
        ];
    });
