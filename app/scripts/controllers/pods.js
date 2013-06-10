'use strict';

angular.module('podRadio')
.controller('PodsCtrl', function ($scope) {

    //    {id: 0, 'name' : 'Planet Money', 'url' : 'http://www.npr.org/rss/podcast.php?id=510289' },
        //    {id: 1, 'name' : 'Dunk Tank w/ Brian and Chet', 'url' : 'http://dunktankpodcast.podomatic.com/rss2.xml'}

            function updatePods () {
                console.log('updatePods ' + localStorage.podIds);
                if (!!!localStorage.podIds)
                    localStorage.setItem( 'podIds', JSON.stringify([]));
                $scope.podIds = JSON.parse( localStorage.podIds );
                $scope.myPods = [];
                for (var i=0; i< $scope.podIds.length; i++){
                    var localPod = localStorage[$scope.podIds[i]];
                    if (!!localPod)
                        $scope.myPods.push( JSON.parse( localPod ));
                }
            }
            updatePods();

            $scope.deletePod = function(toDelete){
                if (confirm('really delete ' + toDelete.name + '?')){
                    localStorage.removeItem( toDelete.id );
                    $scope.podIds.splice($scope.podIds.indexOf(toDelete.id), 1);
                    localStorage.setItem('podIds', JSON.stringify( $scope.podIds ));
                    updatePods();
                }
            };
            $scope.addPod = function(){
                var id = CryptoJS.MD5($scope.url).toString(CryptoJS.enc.Hex);
                localStorage.setItem(id, JSON.stringify({'id' : id, 'name' : $scope.name, 'url' : $scope.url }));
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
                $scope.name = '';
                $scope.url = '';
                updatePods();
            };
});
