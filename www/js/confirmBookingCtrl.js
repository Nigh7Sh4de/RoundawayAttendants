angular.module('starter').controller("ConfirmBooking", function($scope, $stateParams, $state) {
    $scope.back = function() {
        $state.go('createBooking', $stateParams)
    }
 
});