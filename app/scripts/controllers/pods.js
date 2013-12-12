'use strict';

myApp.controller('PodsCtrl', function ($scope, $rootScope, SubscriptionService) {
    $scope.myPods = SubscriptionService.myPods;
    $scope.podIds = SubscriptionService.podIds;

    $scope.newpod = {'name': '', 'url': ''};

    $scope.podClicked = function (id) {
        $rootScope.$broadcast("change_channels", id);
    };

    $scope.deletePod = function (toDelete) {
        if (!!chrome.storage) {
            SubscriptionService.deletePod(toDelete);
        } else if (confirm('really delete ' + toDelete.name + '?')) {
            SubscriptionService.deletePod(toDelete);
        }
    };

    $scope.addPod = function () {
        console.log('adding podcast ' + $scope.newpod.name + ':' + $scope.newpod.url);
        var id = CryptoJS.MD5($scope.newpod.url).toString(CryptoJS.enc.Hex);
        var newPod = {'id': id, 'name': $scope.newpod.name, 'url': $scope.newpod.url };
        SubscriptionService.addPod(newPod);
        $scope.newpod.name = '';
        $scope.newpod.url = '';
    };

    var updatePods = function () {
        $scope.myPods = SubscriptionService.myPods;
        $scope.podIds = SubscriptionService.podIds;
    };

    $scope.$on("updatePods", updatePods);

});
