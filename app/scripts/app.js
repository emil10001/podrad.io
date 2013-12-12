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
    'angular-indexeddb',
    'podRadio.services',
    'podRadio.utils',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ui.router'
]);

var X2JS = new X2JS();
var analytics = analytics || null;

var dbParams = {
    name: 'podradio',
    version: 2,
    options: [
        {
            storeName: 'playlist',
            keyPath: 'created_at',
            indexes: [
                { name: 'audio', unique: true },
                { name: 'url', unique: false }
            ]
        },
        {
            storeName: 'pods',
            keyPath: 'id',
            indexes: [
                { name: 'name', unique: false },
                { name: 'url', unique: true }
            ]
        }
    ]
};

myApp.config(function ($routeProvider, $sceProvider, $httpProvider) {
    $sceProvider.enabled(false);
    $httpProvider.defaults.useXDomain = true;

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

myApp.run(['IDB', function (IDB) {
    IDB.openDB(dbParams.name, dbParams.version, dbParams.options);
}]);
