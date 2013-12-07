'use strict';

var X2JS = new X2JS();

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

myApp.controller('OnePodCtrl', function ($scope, $routeParams, $http) {
    $scope.podId = $routeParams.podId;
    $scope.oneAtATime = true;

    $scope.myPod = JSON.parse(localStorage[$scope.podId]);
    $scope.myPod.numResults = 5;

    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.useXDomain = true ;

    console.log($scope.myPod);
    console.log('url ' + $scope.myPod.url);

    $scope.makeRequest = function(){
        console.log('numResults ' + $scope.myPod.numResults);
        var requestUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&callback=JSON_CALLBACK&num=' + $scope.myPod.numResults + '&q=' +  encodeURIComponent($scope.myPod.url); 

        $http.jsonp(requestUrl).
        success(function(data, status) {
            console.log('requested ' + requestUrl);
            console.log(data);
            $scope.podcontents = X2JS.xml_str2json( data.responseData.xmlString ).rss.channel;
            if( Object.prototype.toString.call( $scope.podcontents.link ) === '[object Array]' ) {
                $scope.podcontents.podcastUrl = $scope.podcontents.link[0]; 
            } else { 
                $scope.podcontents.podcastUrl = $scope.podcontents.link; 
            }
            console.log($scope.podcontents);
        });
    };
    $scope.makeRequest();
});
