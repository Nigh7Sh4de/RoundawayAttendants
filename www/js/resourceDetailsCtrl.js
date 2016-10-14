angular.module('starter').controller("ResourceDetails", function($scope, $stateParams, $state, resourceService) {
    $scope.back = function() {
        $state.go('resourceList')
    }

    $scope.searchCarsInResource = function() {
        $state.go('searchCar', $stateParams)
    }

    $scope.spot = resourceService[$stateParams.type].filter(s => s.id == $stateParams.id)[0];

});
    