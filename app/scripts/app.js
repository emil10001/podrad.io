'use strict';

angular.module('podRadio', ['ngSanitize','ui.bootstrap'])
.config(function ($routeProvider) {
    $routeProvider
    .when('/:podId', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
});
