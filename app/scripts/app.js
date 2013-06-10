'use strict';

angular.module('podRadio', ['ngSanitize','ui.bootstrap'])
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
    .when('/pods/:podId', {
        templateUrl: 'views/onepod.html',
        controller: 'OnePodCtrl'
    })
    .otherwise({
        redirectTo: '/pods'
    });
});
