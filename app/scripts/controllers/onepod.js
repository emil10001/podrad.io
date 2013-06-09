'use strict';

var X2JS = new X2JS();


angular.module('intellijWorkspaceApp')
.controller('OnePodCtrl', function ($scope, $http) {
	$scope.isCollapsed = true;

	$scope.podUrl = 'http://www.npr.org/rss/podcast.php?id=510289' ; 

	var generateJson = function(xmlContents){
		$scope.podcontents = X2JS.xml_str2json( xmlContents );
		console.log($scope.podcontents);
	};

delete $http.defaults.headers.common['X-Requested-With'];


$scope.makeRequest = $http({ url: $scope.podUrl, method: "GET" }).success(function(data, status, headers, config) {
	var xmlContents = data;
	generateJson(xmlContents);
});    
});
