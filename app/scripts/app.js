'use strict';

var myUtils = angular.module('podRadio.utils', [
    'ngResource'
]);

var myService = angular.module('podRadio.services', [
    'ngResource',
    'podRadio.utils',
    'angular-indexeddb',
    'angular-chrome-localstorage'
]);

var myApp = angular.module('podRadio', [
    'angular-chrome-localstorage',
    'podRadio.services',
    'podRadio.utils',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ui.router'
]);

myApp.config(function ($routeProvider, $sceProvider) {
    $sceProvider.enabled(false);

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/:podId', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

});
