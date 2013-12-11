'use strict';

var X2JS = new X2JS();

myApp.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

myApp.controller('OnePodCtrl', function ($scope, $rootScope, $routeParams, $http, PlayListService, SubscriptionService) {
    $scope.podId = $routeParams.podId;
    $scope.oneAtATime = true;

    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.useXDomain = true;

    var loadImg = function () {
        if (!$scope.podcontents.image)
            return;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', $scope.podcontents.image, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
                console.log('error?', e);
                var onePodImg = document.getElementById("onepod_img");
                if (!!onePodImg)
                    onePodImg.src = window.webkitURL.createObjectURL(this.response)
        };

        xhr.send();
    };


    $scope.makeRequest = function () {
        if (!$scope.myPod) {
            console.log('myPod not initted');
            return;
        }

        console.log('numResults ' + $scope.myPod.numResults);

        if (!!chrome.storage) {

            var requestUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&num=' + $scope.myPod.numResults + '&q=' + encodeURIComponent($scope.myPod.url);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', requestUrl, true);
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.onload = function (e) {
                var resp = JSON.parse(this.response);
                $scope.podcontents = X2JS.xml_str2json(resp.responseData.xmlString).rss.channel;
                if (Object.prototype.toString.call($scope.podcontents.link) === '[object Array]') {
                    $scope.podcontents.podcastUrl = $scope.podcontents.link[0];
                } else {
                    $scope.podcontents.podcastUrl = $scope.podcontents.link;
                }
                console.log('makeRequest', $scope.podcontents);
                loadImg();
            };

            xhr.send();

        } else {
            var requestUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&callback=JSON_CALLBACK&num=' + $scope.myPod.numResults + '&q=' + encodeURIComponent($scope.myPod.url);

            $http.jsonp(requestUrl).
                success(function (data, status) {
                    console.log('requested ', requestUrl, status, data);

                    $scope.podcontents = X2JS.xml_str2json(data.responseData.xmlString).rss.channel;
                    if (Object.prototype.toString.call($scope.podcontents.link) === '[object Array]') {
                        $scope.podcontents.podcastUrl = $scope.podcontents.link[0];
                    } else {
                        $scope.podcontents.podcastUrl = $scope.podcontents.link;
                    }
                    console.log($scope.podcontents);
                });
        }

    };

    $scope.addItem = function (item) {
        if (!$scope.podcontents)
            return;

        if (!!$scope.podcontents.image)
            item.image = $scope.podcontents.image._href;
        else
            item.image = '';

        if (!!$scope.podcontents.title)
            item.name = $scope.podcontents.title;
        else
            item.name = '';

        if (!!$scope.podcontents.link)
            item.url = $scope.podcontents.link;
        else
            item.url = '';

        item.audio = item.enclosure._url;
        item.type = item.enclosure._type;
        PlayListService.addItem(item);
    }

    var initPod = function () {
        console.log('initPod');
        if (!$scope.podId) {
            $scope.myPod = SubscriptionService.myPods[0];
            $scope.podId = $scope.myPod.id;
        }
        if (!$scope.podId) {
            return;
        }

        $scope.myPod = SubscriptionService.fullPods[$scope.podId];
        if (!$scope.myPod)
            return;

        $scope.myPod.numResults = 5;
        console.log('myPod', $scope.myPod);
        console.log('url', $scope.myPod.url);
        $scope.makeRequest();
    }

    var changeChannels = function (event, data) {
        console.log('changeChannels', data);
        if (!data)
            return;

        $scope.podId = data;
        initPod();
    }

    $scope.$on("updatePods", initPod);
    $scope.$on("change_channels", changeChannels);

    (function () {
        if (!$scope.podId)
            $scope.myPod = SubscriptionService.fullPods[$scope.podId];
    })();
});
