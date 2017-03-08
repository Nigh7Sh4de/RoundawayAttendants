angular.module('starter').controller("CreateBooking", function ($scope, $stateParams, $rootScope, $state, $ionicModal, $ionicPopup, $ionicHistory, resourceService, userInfoService) {
    
    var now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    $scope.request = {
        start: now,
        end: now
    }

    var getResources = function() {
        userInfoService.getProfileInfo()
        .then(function(user) {
            $scope.user = user;

            return resourceService.getResource($stateParams.type, $stateParams.id)
        })
        .then(function(resource) {
            if ($stateParams.type === 'spots') {
                resource.available = new ranger(resource.available.ranges, Date);
            }
            $scope.resource = resource;
            return resourceService.getResource('cars', {
                selected: true,
                user: $scope.user.id
            })
        })
        .then(function(cars) {
            if (!cars || !cars.length)
                throw new Error('User does not have a car configured');
            $scope.car = cars[0];
            $scope.range_is_available = null;
            $scope.options = null;
        })
        .catch(function(err) {
            console.error(err);
            $state.go('login');
        })
    }
    getResources();

    $scope.checkAvailability = function() {
        $scope.options = null;
        $scope.range_is_available = null;
        if ($stateParams.type === 'spots') {
            if ($scope.resource.available.checkRange(
                $scope.request.start,
                $scope.request.end
            )) {
                $scope.range_is_available = true;
                $scope.request.spot = $scope.resource.id
            } 
            else {
                var start = $scope.request.start;
                var options = [];
                for (var i=0;i<5;i++) {
                    var next = $scope.resource.available.nextRange(start);
                    if (!next) break;
                    start = next.end;
                    options.push({
                        start: next.start,
                        end: next.end,
                        spot: $scope.resource.id,
                        address: $scope.resource.location.address,
                        price: $scope.resource.price.perHour
                    });
                }
                if (options.length) $scope.options = options;
                else $scope.range_is_available = false;
            }
        }
        else if ($stateParams.type === 'lots') {
            $scope.request.deviation = 1000*60*60*24*365*3;
            $scope.request.lot = $stateParams.id;
            resourceService.checkLotAvailability($scope.request)
            .then(function(spots) {
                if (spots.exact.length) {
                    $scope.range_is_available = true;
                    $scope.request.spot = spots.exact[0].id;
                }
                else {
                    var options = spots.similar.map(function(spot) {
                        spot.available = new ranger(spot.available, Date);
                        var range = spot.available.nextRange($scope.request.start);
                        return {
                            start: range.start,
                            end: range.end,
                            spot: spot.id,
                            address: spot.location.address,
                            price: spot.price.perHour
                        }
                    });
                    if (options.length) {
                        $scope.options = options;
                        if ($scope.options.length >= 5) $scope.options = $scope.options.slice(0, 5);
                    }
                    else $scope.range_is_available = false;
                }
                $scope.$apply();
            })
            .catch(function(err) {
                $scope.range_is_available = false;
                $scope.$apply()
            })
        }
    }

    $scope.setOption = function(option) {
        var _dur = $scope.request.end - $scope.request.start;
        if (option.end - option.start > _dur)
            option.end = new Date(option.start.valueOf() + _dur)
        $scope.request = option;
        $scope.checkAvailability();
    }
    
    $scope.createBooking = function () {
        var onehour = 1000*60*60;
        var duration = ($scope.request.end - $scope.request.start) / onehour;
        var price = duration * ($scope.request.price || $scope.resource.price.perHour);

        if ($stateParams.type === 'lots')
            $scope.request.lot = $stateParams.id


        $state.go('confirmBooking', Object.assign({}, $stateParams, {
            car: $scope.car.id,
            start: $scope.request.start.valueOf(),
            end: $scope.request.end.valueOf()
        }))
    }
});



