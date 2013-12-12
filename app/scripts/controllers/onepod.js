'use strict';

/**
 * OnePodCtrl is the controller that works on the
 */
myApp.controller('OnePodCtrl', function ($scope, $rootScope, $routeParams, $http, PlayListService, SubscriptionService) {
    $scope.podId = $routeParams.podId;
    $scope.oneAtATime = true;

    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.useXDomain = true;

    /**
     * Use an XHR request to dynamically load the podcast's image in the Chrome App environment
     */
    var loadImg = function () {
        // this would work well, but server responses need to contain specific headers,
        // or requests would need to be proxied, currently, not the case.
        if (!$scope.podcontents.image)
            return;

        console.log('loadImg', $scope.podcontents.image._href);
        var onePodImg = document.getElementById("onepod_img");

        $http({method: 'GET',
            url: $scope.podcontents.image._href,
            responseType: 'blob' }).
            success(function(data, status, headers, config) {
                if (!!onePodImg)
                    onePodImg.src = window.webkitURL.createObjectURL(data);
            }).
            error(function(data, status, headers, config) {
                console.log('get img failed', data, status, headers, config);
            });
    };

    /**
     * Get the podcast data from the provider using either an XHR request or a JSONP request
     */
    $scope.makeRequest = function () {
        if (!$scope.myPod) {
            console.log('myPod not initted');
            return;
        }

        console.log('numResults ' + $scope.myPod.numResults);

        // I use this to test if we're in a Chrome App environment or not
        if (!!chrome.storage) {

            // in a Chrome environment, we need to make an XHR request for the podcast data
            var requestUrl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&output=xml&num=' + $scope.myPod.numResults + '&q=' + encodeURIComponent($scope.myPod.url);

            $http({method: 'GET', url: requestUrl}).
                success(function(data, status, headers, config) {
                    // the data comes back as JSON, but in string form, we need to parse it
                    // the podcast data is contained in the JSON, as encoded XML
                    // we need to convert it from encoded XML to JSON
                    $scope.podcontents = X2JS.xml_str2json(data.responseData.xmlString).rss.channel;
                    /// we might get an array that contains a link, or a string, depends on the specific feed
                    if (Object.prototype.toString.call($scope.podcontents.link) === '[object Array]') {
                        $scope.podcontents.podcastUrl = $scope.podcontents.link[0];
                    } else {
                        $scope.podcontents.podcastUrl = $scope.podcontents.link;
                    }
                    console.log('makeRequest', $scope.podcontents);
//                    $scope.$broadcast('onepod_loaded');
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
        } else {
            // on the web, we can use a JSONP request with a callback
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

    /**
     * add a podcast item to the playlist
     * @param item - member of podcontents that was selected
     */
    $scope.addItem = function (item) {
        if (!$scope.podcontents)
            return;

        // if we're going to send a podcast item to the playlist
        // we need to first build an object with all the right parameters
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

        // The PlayListService manages the playlist
        PlayListService.addItem(item);
    }

    /**
     * This is called from
     */
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

    $scope.$on("onepod_loaded", loadImg);

    $scope.$on("updatePods", initPod);
    $scope.$on("change_channels", changeChannels);

    (function () {
        if (!$scope.podId)
            $scope.myPod = SubscriptionService.fullPods[$scope.podId];
        if (!$scope.myPod)
            $scope.makeRequest();
    })();
});
