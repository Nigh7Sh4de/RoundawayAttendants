angular.module('starter').controller("ConfirmBooking", function ($scope, $stateParams, $rootScope, $state, $ionicModal, $ionicPopup, $ionicHistory, resourceService, userInfoService) {
    var loading;

    $scope.request = $stateParams;

    var getResource = function() {
        Promise.all([
            resourceService.getResource($stateParams.type, $stateParams.id),
            resourceService.getResource('cars', $stateParams.car)
        ])
        .then(function(results) {
            $scope.resource = results[0];
            $scope.car = results[1];
            $scope.price = ($scope.resource.price.perHour / (1000*60*60)) * ($scope.request.end - $scope.request.start)
        })
    }
    getResource();

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
                $state.go('reservations', {reload: true});
            })
        })
    }
})