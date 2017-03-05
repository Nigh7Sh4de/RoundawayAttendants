angular.module('starter').controller('ProfileBarController', function(userInfoService, $scope, $state) {
	
	// Code you want executed every time view is opened
	userInfoService.getProfileInfo().then(function(userInfo) {
		$scope.profile = userInfo;
	}).catch(function(err) {
		console.error('Error ' + err + ' retrieving userInfo')
		// alert("Opps!\nAn error occured retrieving your user profile");
		$state.go('login');
	});	
});