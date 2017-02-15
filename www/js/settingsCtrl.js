angular.module('starter').controller("Settings", function ($scope, $stateParams, $ionicModal, $state, $ionicPopup, userInfoService) {

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
            console.error('Error ' + err + 'retrieving userInfo')
            $scope.showAlert(err.message)
        });
    })

  // An alert dialog
   $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Oops!',
       template: message
     });
     alertPopup.then(function(res) {});
   };
});