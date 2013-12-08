'use strict';

var X2JS = new X2JS();

myApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

myApp.controller('OnePodCtrl', function ($scope, $routeParams, $http, PlayListService, LocalWrapper) {
    var GET = 'onepod_get';

    $scope.podId = $routeParams.podId;
    $scope.oneAtATime = true;

    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.useXDomain = true;

    $scope.makeRequest = function () {
        console.log('numResults ' + $scope.myPod.numResults);
        var requestUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&callback=JSON_CALLBACK&num=' + $scope.myPod.numResults + '&q=' + encodeURIComponent($scope.myPod.url);

        $http.jsonp(requestUrl).
            success(function (data, status) {
                console.log('requested ' + requestUrl);
                console.log(data);
                $scope.podcontents = X2JS.xml_str2json(data.responseData.xmlString).rss.channel;
                if (Object.prototype.toString.call($scope.podcontents.link) === '[object Array]') {
                    $scope.podcontents.podcastUrl = $scope.podcontents.link[0];
                } else {
                    $scope.podcontents.podcastUrl = $scope.podcontents.link;
                }
                console.log($scope.podcontents);
            });
    };

    $scope.addItem = function (item) {
        item.image = $scope.podcontents.image._href;
        item.name = $scope.podcontents.title;
        item.url = $scope.podcontents.link;
        item.audio = item.enclosure._url;
        item.type = item.enclosure._type;
        PlayListService.addItem(item);
    }

    var initPod = function (data) {
        $scope.myPod = JSON.parse(data);
        $scope.myPod.numResults = 5;
        console.log($scope.myPod);
        console.log('url ' + $scope.myPod.url);
        $scope.makeRequest();
    }
    LocalWrapper.get($scope.podId, GET);
    $scope.$on(GET, initPod);

});
