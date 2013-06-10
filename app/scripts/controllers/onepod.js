'use strict';

var X2JS = new X2JS();

var myApp = angular.module('podRadio');

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

myApp.controller('OnePodCtrl', function ($scope, $routeParams, $http) {
    $scope.podId = $routeParams.podId;
    $scope.oneAtATime = true;

    var myPod = JSON.parse(localStorage[$scope.podId]);

    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.useXDomain = true ;

    var requestUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&callback=JSON_CALLBACK&num=3&q=' +  encodeURIComponent(myPod.url) ; 

    console.log(myPod);
    console.log('url ' + myPod.url);
    console.log('request ' + requestUrl);

    $scope.makeRequest = $http.jsonp(requestUrl).
    success(function(data, status) {
        console.log(data);
        $scope.podcontents = X2JS.xml_str2json( data.responseData.xmlString ).rss.channel;
        console.log($scope.podcontents);
    });
});
