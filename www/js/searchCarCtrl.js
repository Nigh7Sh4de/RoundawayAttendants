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
        resourceService.getResource('cars', {
            license: license.toUpperCase(),
        })
        .then(function(cars) {
            if (cars[0]) {
                $scope.car = cars[0];
                var bookingSearch = {
                    car: $scope.car.id
                }
                bookingSearch[$stateParams.type] = $stateParams.id;
                resourceService.getResource('bookings', bookingSearch)
                .then(function(bookings) {
                    for (var i=0;i<bookings.length;i++) {
                        var b = bookings[i];
                        b.start = new Date(b.start);
                        b.end = new Date(b.end);
                        if (b.end >= Date.now()) {
                            $scope.car.nextBooking = b;
                            break;
                        }
                    }
                    $scope.$apply();
                })
            }
            else {
                $scope.carNotFound = true;
                $scope.$apply();
            }

        })
        // var car = resourceService.cars.filter(function(c) {
        //     return c.license.toLowerCase() == license.toLowerCase()
        // })[0];
        // if (car)
        //     $scope.car = car;
        // else
        //     $scope.carNotFound = true;
    }

});