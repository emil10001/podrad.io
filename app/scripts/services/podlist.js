'use strict';


var myService = angular.module('podRadio.services', []);

myService.factory('PodIdsLoader', function() {
    return function () { 
        console.log('updatePods ' + localStorage.podIds);
        if (!!!localStorage.podIds)
            localStorage.setItem( 'podIds', JSON.stringify([]));
        return JSON.parse( localStorage.podIds );
    };
});

myService.factory('PodsLoader', function() {
    return function () { 
        var podIds = JSON.parse( localStorage.podIds );
        var myPods = [];
        for (var i=0; i< podIds.length; i++){
            var localPod = localStorage[podIds[i]];
            if (!!localPod)
                myPods.push( JSON.parse( localPod ));
        }
        return myPods;
    };
});

myService.factory('PodLoader', ['$route', function($route) {
    return function () { 
        return localStorage[$route.current.params.podId]; 
    };
}]);

