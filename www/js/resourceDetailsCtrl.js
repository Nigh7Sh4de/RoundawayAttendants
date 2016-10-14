angular.module('starter').controller("ResourceDetails", function ($scope, $stateParams, $state, resourceService) {
    $scope.spot = resourceService[$stateParams.type].filter(s => s.id == $stateParams.id)[0];

    $scope.back = function () {
        $state.go('resourceList')
    }

    $scope.searchCarsInResource = function () {
        $state.go('searchCar', $stateParams)
    }

    $scope.addAvailability = function () {
        alert('Select availability range to add');
    }

    $scope.removeAvailability = function () {
        alert('Select availability range to remove');
    }

});
