angular.module('starter').controller("CreateBooking", function ($scope, $stateParams, $rootScope, $state, $ionicModal, $ionicPopup, $ionicHistory, resourceService, userInfoService) {
    
    var getResource = function() {
        resourceService.getResource($stateParams.type, $stateParams.id)
        .then(function(resource) {
            if ($stateParams.type === 'spots') {
                resource.available = new ranger(resource.available.ranges, Date);
            }
            $scope.resource = resource;
            $scope.car = {
                license: $stateParams.license
            }
            $scope.range_is_available = null;
            $scope.options = null;
        })
        
        var now = new Date();
        now.setSeconds(0);
        now.setMilliseconds(0);
        $scope.request = {
            start: now,
            end: now
        }
    }
    getResource();

    var getUser = function() {
        userInfoService.getProfileInfo()
        .then(function(user) {
            $scope.user = user;
        })
        .catch(function(err) {
            console.error(err);
            $state.go('login');
        })
    }
    getUser();
    
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
            )) {
                $scope.range_is_available = true;
                $scope.request.spot = $scope.resource.id
            } 
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
                    $scope.options = spots.similar.map(function(spot) {
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
                    if ($scope.options.length >= 5) $scope.options = $scope.options.slice(0, 5);
                    if (!$scope.option.length) $scope.range_is_available = false;
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


        $scope.request = {
            address: $scope.request.address || $scope.resource.location.address,
            license: $scope.car.license,
            start: $scope.request.start,
            end: $scope.request.end,
            price: price,
            spot: $scope.request.spot
        }

        if ($stateParams.type === 'lots')
            $scope.request.lot = $stateParams.id


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
                        loading.close()
                        if ($scope.payment.number === 123) 
                            $ionicPopup.alert({
                                title: 'Oops!',
                                template: 'Payment information was invalid'
                            })
                        else
                            paymentPopup.close('token')
                        // Stripe.card.createToken($scope.payment, function(status, stripe_res) {
                        //     if (stripe_res.error) {
                        //         return $ionicPopup.alert({
                        //             title: 'Oops!',
                        //             template: 'Payment information was invalid'
                        //         })
                        //     }
                        //     else paymentPopup.close(stripe_res.id);
                        // });
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
        $scope.request.createCarIfNotInSystem = true;
        resourceService.createBooking($scope.request) 
        .then(function(response) {
            if (!payment) return Promise.resolve()
            else return resourceService.payBooking(payment);
        })
        .then(function() {
            loading.close();
            $ionicPopup.alert({
                title: 'Thanks :)',
                template: 'Your booking has been created!'
            }).then(function(res) {
                $scope.modal.hide();
                $state.go('searchCar', $stateParams, {reload: true});
            })
        })
    }

});



