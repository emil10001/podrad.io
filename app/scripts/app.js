'use strict';

angular.module('intellijWorkspaceApp', ['ngSanitize','ui.bootstrap'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/pods', {
                templateUrl: 'views/pods.html',
                controller: 'PodsCtrl'
            })
            .when('/onepod/:podId', {
                templateUrl: 'views/onepod.html',
                controller: 'OnePodCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
