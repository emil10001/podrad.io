'use strict';

angular.module('intellijWorkspaceApp', [])
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
      .otherwise({
        redirectTo: '/'
      });
  });
