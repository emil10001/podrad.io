'use strict';

var X2JS = new X2JS();

var myApp = angular.module('intellijWorkspaceApp');

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

myApp.controller('OnePodCtrl', function ($scope, $routeParams, $http) {
    $scope.podId = $routeParams.podId;
    $scope.oneAtATime = true;

    $scope.myPods = [
        {'name' : 'Planet Money', 'url' : 'http://www.npr.org/rss/podcast.php?id=510289' },   
            {'name' : 'Dunk Tank w/ Brian and Chet', 'url' : 'http://dunktankpodcast.podomatic.com/rss2.xml'}  
                ];

                //$scope.podUrl = 'http://www.npr.org/rss/podcast.php?id=510289' ; 
                //$scope.podUrl = 'http://feeds.feedburner.com/freakonomicsradio' ; 
                $scope.podUrl = $scope.myPods[$scope.podId].url;

                delete $http.defaults.headers.common['X-Requested-With'];
                $http.defaults.useXDomain = true ;

                $scope.makeRequest = $http.jsonp('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&callback=JSON_CALLBACK&num=3&q=' + encodeURIComponent($scope.podUrl) ).
                    success(function(data, status) {
                        $scope.podcontents = X2JS.xml_str2json( data.responseData.xmlString ).rss.channel;
                        console.log($scope.podcontents);
                    });
});
