angular.module('starter').controller("ResourceDetails", function ($scope, $stateParams, $state, resourceService, $ionicPopup) {
    $scope.spot = resourceService[$stateParams.type].filter(s => s.id == $stateParams.id)[0];

    $scope.back = function () {
        $state.go('resourceList')
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
            console.log($scope.availability.edit_mode, res);
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
