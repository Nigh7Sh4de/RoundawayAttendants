angular.module('starter').controller("SearchCar", function($scope, $stateParams, $state) {
    
    $scope.back = function() {
        $state.go('resourceDetails', $stateParams)
    }

    $scope.createBooking = function() {
        $state.go('createBooking', $stateParams)
    }
 
});