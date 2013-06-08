'use strict';

angular.module('intellijWorkspaceApp')
    .controller('PodsCtrl', function ($scope) {
        $scope.myPods = [
            {'name' : 'Planet Money',
            'url' : 'http://money.npr.org'}
        ];
    });
