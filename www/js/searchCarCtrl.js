angular.module('starter').controller("SearchCar", function ($scope, $stateParams, $state, resourceService) {

    $scope.back = function () {
        $state.go('resourceDetails', $stateParams)
    }

    $scope.createBooking = function () {
        $state.go('createBooking', $stateParams)
    }

    $scope.findCar = function (license) {
        $scope.carNotFound = false;
        $scope.car = null;
        var car = resourceService.cars.filter(c => c.license.toLowerCase() == license.toLowerCase())[0]
        if (car)
            $scope.car = car;
        else
            $scope.carNotFound = true;
    }

});