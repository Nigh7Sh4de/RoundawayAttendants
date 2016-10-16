angular.module('starter').controller("ResourceDetails", function ($scope, $stateParams, $state, resourceService, $ionicPopup, $ionicHistory) {
    resourceService.getResource($stateParams.type, $stateParams.id)
    .then(function(resource) {
        $scope.resource = resource;
    })

    $scope.back = function () {
        $ionicHistory.goBack();
    }

    $scope.searchCarsInResource = function () {
        $state.go('searchCar', $stateParams)
    }

    $scope.availability = {}

    var showPopup = function() {
        $scope.availability.start = new Date();
        $scope.availability.end = new Date();
        $ionicPopup.confirm({
            title: $scope.availability.edit_mode + " availability",
            templateUrl: 'templates/select_availability.html',
            okText: $scope.availability.edit_mode,
            scope: $scope
        }).then(function(res) {
            resourceService.adjustAvailability(
                $stateParams.type,
                $stateParams.id,
                $scope.availability,
                $scope.availability.edit_mode === 'Remove')
                .then(function(newResource) {
                    $scope.resource = newResource
                })
            // console.log($scope.availability.edit_mode, res);
        })
    }

    $scope.addAvailability = function (e) {
        $scope.availability.edit_mode = 'Add';
        showPopup();
    }

    $scope.removeAvailability = function (e) {
        $scope.availability.edit_mode = 'Remove';
        showPopup();
    }

});
