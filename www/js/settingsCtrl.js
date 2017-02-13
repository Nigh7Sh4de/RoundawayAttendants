angular.module('starter').controller("Settings", function ($scope, $stateParams, $ionicModal, $state, userInfoService) {

	$ionicModal.fromTemplateUrl('templates/resources.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    })

	$scope.manage = function() {
    	$scope.modal.show();
  	}

  	$scope.$on('$ionicView.enter', function() {
     // Code you want executed every time view is opened
     console.log('Opened!')
     var profile = userInfoService.getProfileInfo($scope.request)
     console.log(profile.name)
    })

});