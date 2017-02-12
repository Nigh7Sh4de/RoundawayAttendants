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
});