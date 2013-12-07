'use strict';

var myApp = angular.module('podRadio', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ui.router'
]);

myApp.config(function ($routeProvider) {
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


//myApp.config(function ($stateProvider, $urlRouterProvider) {
//    $urlRouterProvider.otherwise("/")
//    $stateProvider
//        .state('home', {
//            abstract: true,
//            url: "/",
//            templateUrl: "views/main.html",
//            controller: 'MainCtrl'
//        })
//        .state('home.playlist', {
//            url: "",
//            templateUrl: "views/playlist.html",
//            controller: 'PlaylistCtrl'
//        })
//        .state('home.pods', {
//            url: "",
//            templateUrl: "views/pods.html",
//            controller: 'PodsCtrl'
//        })
//        .state('home.onepod', {
//            url: "",
//            templateUrl: "views/onepod.html",
//            controller: 'OnePodCtrl'
//        });
//});
