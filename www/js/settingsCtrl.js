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
        userInfoService.getProfileInfo().then(function(userInfo) {
            $scope.profile = userInfo;
        }).catch(function(err) { 
            /*some sort of error handling*/ 
            console.error('Error ' + err + 'retrieving userInfo')
        });
    })

});