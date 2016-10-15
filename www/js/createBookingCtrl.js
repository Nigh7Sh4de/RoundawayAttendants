angular.module('starter').controller("CreateBooking", function ($scope, $stateParams, $state) {
    $scope.spot = resourceService[$stateParams.type].filter(s => s.id == $stateParams.id)[0];
    $scope.car = resourceService.car.filter(s => s.license.toLowerCase() == $stateParams.license.toLowerCase())[0];

    $scope.createBooking = function () {
        $state.go('confirmBooking', $stateParams)
    }

    $scope.cancelBooking = function () {
        $state.go('resourceDetails', $stateParams)
    }

    $scope.setFrom = function () {
        alert('choose start datetime')
    }

    $scope.setTo = function () {
        alert('choose end datetime')
    }

});

