angular.module('starter').controller("SearchCar", function ($scope, $stateParams, $state, $ionicHistory, resourceService) {

    $scope.back = function () {
        $ionicHistory.goBack();
    }

    $scope.createBooking = function () {
        $state.go('createBooking', Object.assign({}, $stateParams, { license: $scope.car.license }))
    }

    $scope.nextBooking = {
        start: new Date(),
        end: new Date(new Date().valueOf() + 1000*60*60*24)
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