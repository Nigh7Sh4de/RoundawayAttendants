angular.module('starter').controller("ResourceDetails", function ($scope, $stateParams, $state, resourceService, $ionicPopup, $ionicHistory) {
    resourceService.getResource($stateParams.type, $stateParams.id)
    .then(function(resource) {
        $scope.resource = resource;
    })

    $scope.back = function () {
        $ionicHistory.goBack();
    }

    $scope.request = {
        start: new Date(),
        end: new Date(new Date().valueOf() + 1000*60*60)
    }


    // $scope.searchCarsInResource = function () {
    //     $state.go('searchCar', $stateParams)
    // }



});
