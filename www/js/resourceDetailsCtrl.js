angular.module('starter').controller("ResourceDetails", function ($scope, $stateParams, $state, resourceService, $ionicPopup) {
    $scope.spot = resourceService[$stateParams.type].filter(s => s.id == $stateParams.id)[0];

    $scope.back = function () {
        $state.go('resourceList')
    }

    $scope.searchCarsInResource = function () {
        $state.go('searchCar', $stateParams)
    }

    var showPopup = function() {
        $ionicPopup.confirm({
            title: $scope.availability_edit_mode + " availability",
            templateUrl: 'templates/select_availability.html',
            okText: $scope.availability_edit_mode,
        }).then(function(res) {
            console.log(res)
        })
    }

    $scope.addAvailability = function (e) {
        $scope.availability_edit_mode = 'Add';
        showPopup();
    }

    $scope.removeAvailability = function (e) {
        $scope.availability_edit_mode = 'Remove';
        showPopup();
    }

});
