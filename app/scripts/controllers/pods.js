'use strict';

angular.module('podRadio')
.controller('PodsCtrl', function ($scope) {

    var defaultPodIds = [ 
        CryptoJS.MD5('http://www.npr.org/rss/podcast.php?id=510289').toString(CryptoJS.enc.Hex), 
        CryptoJS.MD5('http://dunktankpodcast.podomatic.com/rss2.xml').toString(CryptoJS.enc.Hex), 
        CryptoJS.MD5('http://feeds.feedburner.com/freakonomicsradio').toString(CryptoJS.enc.Hex), 
        CryptoJS.MD5('ohttp://www.theskepticsguide.org/feed/rss.aspx?feed=SGU').toString(CryptoJS.enc.Hex), 
    ];
    var defaultPods = [ 
        {'id' : defaultPodIds[0], 
            'name' : 'Planet Money', 
            'url' : 'http://www.npr.org/rss/podcast.php?id=510289' },
        {'id': defaultPodIds[1], 
            'name' : 'Dunk Tank w/ Brian and Chet', 
            'url' : 'http://dunktankpodcast.podomatic.com/rss2.xml'},
        {'id': defaultPodIds[2], 
            'name' : 'Freakonomics', 
            'url' : 'http://feeds.feedburner.com/freakonomicsradio'},
        {'id': defaultPodIds[3], 
            'name' : 'Skeptics Guide to the Universe', 
            'url' : 'http://www.theskepticsguide.org/feed/rss.aspx?feed=SGU'},
    ];

    function useDefaults() {
        $scope.podIds = defaultPodIds;
        $scope.myPods = defaultPods;
        localStorage.setItem('podIds', JSON.stringify( $scope.podIds ));
        for (var i=0;i< $scope.myPods.length; i++){
            if (!!$scope.myPods[i] && $scope.myPods[i] !== ''){
                localStorage.setItem($scope.myPods[i].id, JSON.stringify($scope.myPods[i]));
            }
        }
    }

    function updatePods () {
        console.log('updatePods ' + localStorage.podIds);
        if (!!!localStorage.podIds){
            useDefaults();
            return;
        }
        $scope.podIds = JSON.parse( localStorage.podIds );
        if ($scope.podIds.length < 1){
            useDefaults();
            return;
        }
        $scope.myPods = [];
        for (var i=0; i< $scope.podIds.length; i++){
            var localPod = localStorage[$scope.podIds[i]];
            if (!!localPod)
                $scope.myPods.push( JSON.parse( localPod ));
        }
    }

    updatePods();
    $scope.newpod  = {'name' :  '', 'url' : ''};

    $scope.deletePod = function(toDelete){
        if (confirm('really delete ' + toDelete.name + '?')){
            localStorage.removeItem( toDelete.id );
            $scope.podIds.splice($scope.podIds.indexOf(toDelete.id), 1);
            localStorage.setItem('podIds', JSON.stringify( $scope.podIds ));
            updatePods();
        }
    };
    $scope.addPod = function(){
        console.log('adding podcast ' + $scope.newpod.name + ':' + $scope.newpod.url); 
        var id = CryptoJS.MD5($scope.newpod.url).toString(CryptoJS.enc.Hex);
        localStorage.setItem(id, JSON.stringify({'id' : id, 'name' : $scope.newpod.name, 'url' : $scope.newpod.url }));
        $scope.podIds.push(id);
        for (var i=0;i< $scope.podIds.length; i++){
            if (!!!$scope.podIds[i]){
                $scope.podIds.splice(i,1);
            }
            else if ($scope.podIds[i] === ''){
                $scope.podIds.splice(i,1);
            }
        }
        localStorage.setItem('podIds', JSON.stringify( $scope.podIds ));
        $scope.newpod.name = '';
        $scope.newpod.url = '';
        updatePods();
    };
});
