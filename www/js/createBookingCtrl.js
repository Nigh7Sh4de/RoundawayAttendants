angular.module('starter').controller("CreateBooking", function($scope, $stateParams, $state) {
    $scope.createBooking = function() {
        $state.go('confirmBooking', $stateParams)
    }

    $scope.cancelBooking = function() {
        $state.go('resourceDetails', $stateParams)
    }
 
});

