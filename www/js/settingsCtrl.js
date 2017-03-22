angular.module('starter').controller("Settings", function ($scope, $stateParams, $ionicModal, $ionicHistory, $state, $ionicPopup, userInfoService, resourceService) {
  
	$ionicModal.fromTemplateUrl('templates/resources.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
     $scope.modal = modal;
  })

	$scope.manage = function() {
    $scope.modal.show();
  }

  $scope.signOut = function() {
    userInfoService.logOut()    
    $ionicHistory.clearCache();
    $state.go('home');
  }


  // An alert dialog
   $scope.showAlert = function(message) {
     var alertPopup = $ionicPopup.alert({
       title: 'Oops!',
       template: message
     });
     alertPopup.then(function(res) {});
   };

   //Get cars
   resourceService.getResource('cars')
   .then(function(cars) {
     console.log(cars)
     $scope.cars = cars
   })
});