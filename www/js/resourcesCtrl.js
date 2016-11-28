angular.module('starter').controller("ResourceList", function($scope, $stateParams, $state, resourceService) {

    $scope.resources = {};
    resourceService.getResource('lots')
    .then(function(lots) {
        $scope.resources.lots = lots;
    })
    resourceService.getResource('spots', {
<<<<<<< HEAD
        generic: false
=======
        reserved: true
>>>>>>> 61c6b94a59c23851c1b1ea33cd259550e2aa7d9f
    })
    .then(function(spots) {
        $scope.resources.spots = spots
    })

    $scope.context = 'lots';

    $scope.setContext = function(newContext) {
        $scope.context = newContext;
    }

    $scope.viewResourceDetails = function(type, id) {
        $state.go('searchCar', {
            type: type,
            id: id
        })
    }
 
});