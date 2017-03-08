angular.module('starter').controller('ProfileBarController', function(userInfoService, $scope, $state) {
	$scope.$on('$ionicParentView.enter', function(event, viewData) {
		fetchProfileInfo();
	});

	function fetchProfileInfo() {
		var isOnline = userInfoService.isAuthenticated()
		if (isOnline) {
			userInfoService.getProfileInfo().then(function(userInfo) {
				$scope.profile = userInfo;
			}).catch(function(err) {
				console.error('Error ' + err + ' retrieving userInfo')
				$state.go('login');
			});	
		} else {
			$state.go('login');
		}
	}
});