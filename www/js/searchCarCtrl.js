angular.module('starter').controller("SearchCar", function ($scope, $stateParams, $state, $ionicHistory, resourceService) {

    $scope.$on('refresh-resources', function() {
        $scope.car = null;
    });


    $scope.back = function () {
        $ionicHistory.goBack();
    }

    $scope.createBooking = function () {
        $state.go('createBooking', Object.assign({}, $stateParams, { license: $scope.car.license }))
    }

    $scope.findCar = function (license) {
        license = license.toUpperCase();
        // $scope.carNotFound = false;
        $scope.car = null;
        resourceService.getResource('cars', {
            license: license,
        })
        .then(function(cars) {
            if (cars[0]) {
                $scope.car = cars[0];
                var bookingSearch = {
                    car: $scope.car.id
                }
                bookingSearch[$stateParams.type.slice(0, $stateParams.type.length-1)] = $stateParams.id;
                resourceService.getResource('bookings', bookingSearch)
                .then(function(bookings) {
                    for (var i=0;i<bookings.length;i++) {
                        var b = bookings[i];
                        b.start = new Date(b.start);
                        b.end = new Date(b.end);
                        if (b.end >= Date.now()) {
                            $scope.car.nextBooking = b;
                            $scope.car.nextBooking.later = b.start > Date.now();
                            console.log($scope.car)
                            break;
                        }
                    }
                    $scope.$apply();
                })
            }
        })
        .catch(function(err) {
            // console.error(err);
            $scope.car = {
                license: license
            }
            $scope.$apply();
        })
    }

});