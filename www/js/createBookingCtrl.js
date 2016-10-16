angular.module('starter').controller("CreateBooking", function ($scope, $stateParams, $state, $ionicModal, $ionicPopup, $ionicHistory, $http, resourceService) {
    
    resourceService.getResource($stateParams.type, $stateParams.id)
    .then(function(resource) {
        if ($stateParams.type === 'spots') {
            resource.available = new ranger(resource.available.ranges, Date);
        }
        $scope.resource = resource;
    })
    resourceService.getResource('cars', {
        license: $stateParams.license    
    })
    .then(function(resource) {
        $scope.car = resource[0];
    })

    var now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    $scope.request = {
        start: now,
        end: now
    }
    $ionicModal.fromTemplateUrl('templates/confirm_booking.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    })

    $scope.checkAvailability = function() {
        $scope.options = null;
        if ($stateParams.type === 'spots') {
            if ($scope.resource.available.checkRange(
                $scope.request.start,
                $scope.request.end
            )) $scope.range_is_available = true; 
            else {
                var start = $scope.request.start;
                $scope.options = [];
                for (var i=0;i<5;i++) {
                    var next = $scope.resource.available.nextRange(start);
                    if (!next) break;
                    start = next.end;
                    $scope.options.push({
                        start: next.start,
                        end: next.end,
                        spot: $scope.resource.id,
                        address: $scope.resource.location.address,
                        price: $scope.resource.price.perHour
                    });
                }
            }
        }
        else if ($stateParams.type === 'lots')
            $http.put('http://192.168.0.10:8081/api/lots/' + $stateParams.id + '/available/check', 
                $scope.request, {
                headers: {
                    Authorization: 'JWT ' + window.localStorage.getItem("jwt")
                }
            })
            .then(function(response) {
                $scope.options = response.exact.map(function(spot) {
                    var range = spot.available.nextRange($scope.request.start);
                    return {
                        start: range.start,
                        end: range.end,
                        spot: spot.id,
                        address: spot.location.address,
                        price: spot.price.perHour
                    }
                });
                if ($scope.options.length >= 5) $scope.options = $scope.options.slice(0, 5);
                else $scope.options = $scope.options.concat(response.similar.map(function(spot) {
                    var range = spot.available.nextRange($scope.request.start);
                    return {
                        start: range.start,
                        end: range.end,
                        spot: spot.id,
                        address: spot.location.address,
                        price: spot.price.perHour
                    }
                }));
                if ($scope.options.length >= 5) $scope.options = $scope.options.slice(0, 5);
                $scope.$apply();
            })
    }

    $scope.setOption = function(option) {
        $scope.request = option;
        $scope.checkAvailability();
    }
    
    $scope.createBooking = function () {
        var onehour = 1000*60*60;
        var duration = ($scope.request.end - $scope.request.start) / onehour;
        var price = duration * ($scope.request.price || $scope.resource.price.perHour);


        $scope.request = {
            address: $scope.request.address || resource.location.address,
            license: $scope.car.license,
            start: $scope.request.start,
            end: $scope.request.end,
            price: price,
            spot: $scope.request.spot
        }


        $scope.modal.show();
    }

    $scope.cancelBooking = function () {
        $ionicHistory.goBack();
    }

    var loading;
    $scope.confirm = function(needToPay) {
        var req = {
            start: $scope.request.start,
            end: $scope.request.end,
            license: $scope.request.license,
            spot: $scope.request.spot
        }
        if (needToPay) {
            $scope.payment = {}
            var paymentPopup = $ionicPopup.show({
                title: 'Payment',
                templateUrl: 'templates/payment_form.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    type: 'button-default'
                }, {
                    text: 'OK',
                    type: 'button-positive',
                    onTap: function(e) {
                        e.preventDefault();
                        loading = $ionicPopup.show({
                            title: 'Loading',
                            template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
                        })
                        Stripe.card.createToken($scope.payment, function(status, stripe_res) {
                            if (stripe_res.error) {
                                return $ionicPopup.alert({
                                    title: 'Oops!',
                                    template: 'Payment information was invalid'
                                })
                            }
                            else paymentPopup.close(stripe_res.id);
                        });
                    }
                }]
            })
            paymentPopup.then(function(res) {
                $scope.processBooking(res);
            })
            
        }
        else {
            loading = $ionicPopup.show({
                title: 'Loading',
                template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
            })
            $scope.processBooking();
        }
    }

    $scope.processBooking = function(payment) {
        console.log('Please just fucking work');
        $http.put('http://192.168.0.10:8081/api/spots/' + $scope.request.spot + '/bookings', 
            $scope.request, {
            headers: {
                Authorization: 'JWT ' + window.localStorage.getItem("jwt")
            }
        })
        .then(function(response) {
            if (!payment) return Promise.resolve()
            return $http.put('http://192.168.0.10:8081/api/bookings/' + response.data.data.bookings[0].id + '/pay', 
                {
                    token: payment
                }, {
                headers: {
                    Authorization: 'JWT ' + window.localStorage.getItem("jwt")
                }
            });
        })
        .then(function() {
            loading.close();
            $ionicPopup.alert({
                title: 'Thanks :)',
                template: 'Your booking has been created!'
            }).then(function(res) {
                $scope.modal.hide();
                $state.go('resourceDetails', $stateParams);
            })
        })
    }

});

