angular.module('starter').controller("ConfirmBooking", function($scope, $stateParams, $state, $ionicHistory) {
    $scope.back = function() {
        $ionicHistory.goBack();
    }
 
});