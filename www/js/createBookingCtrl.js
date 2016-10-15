angular.module('starter').controller("CreateBooking", function ($scope, $stateParams, $state, $ionicModal, $ionicPopup, $ionicHistory, resourceService) {
    
    $scope.spot = resourceService[$stateParams.type].filter(s => s.id == $stateParams.id)[0];
    $scope.car = resourceService.cars.filter(s => s.license.toLowerCase() == $stateParams.license.toLowerCase())[0];
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
    
    
    $scope.updateNextRange = function() {
        if ($scope.request.start > $scope.request.end)
            $scope.request.end = $scope.request.start;
        var nextRange = $scope.spot.available.nextRange($scope.request.start);
        if (!nextRange)
            $scope.request.start.error = true;
        else if ($scope.request.start < nextRange.start)
            $scope.request.start.error = true;
        else if ($scope.request.end > nextRange.end)
            $scope.request.end.error = true;

        $scope.nextRange = nextRange;
        var onehour = 1000*60*60;
        var duration = ($scope.request.end - $scope.request.start) / onehour;
        $scope.price = $scope.spot.price.perHour * duration;
    }
    $scope.updateNextRange();
    $scope.$watch("request.start", $scope.updateNextRange)
    $scope.$watch("request.end", $scope.updateNextRange)

    $scope.formIsValid = function() {
        return (
                $scope.nextRange && $scope.request &&
                $scope.nextRange.start <= $scope.request.start &&
                $scope.nextRange.end >= $scope.request.end &&
                $scope.request.end - $scope.request.start > 0
            )
    }
    
    $scope.createBooking = function () {
        // $state.go('confirmBooking', $stateParams)
        $scope.modal.show();
    }

    $scope.cancelBooking = function () {
        // $state.go('resourceDetails', $stateParams)
        $ionicHistory.goBack();
    }

    $scope.done = function(done) {
        if (done)
            $ionicPopup.alert({
                title: 'Thanks :)',
                tempalte: 'Your booking has been created!'
            }).then(function(res) {
                $scope.modal.hide();
                $state.go('resourceDetails', $stateParams);
            })
    }

    $scope.confirm = function(needToPay) {
        //xhr create booking
        //.then() => {
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
                            processPayment()
                        }
                    }]
                })
                paymentPopup.then(function(res) {
                    $scope.done(res);
                })
                var processPayment = function() {
                    var loading = $ionicPopup.show({
                        title: 'Loading',
                        template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
                    })
                    Stripe.card.createToken($scope.payment, function(status, stripe_res) {
                        loading.close();
                        if (stripe_res.error) {
                            return $ionicPopup.alert({
                                title: 'Oops!',
                                template: 'Payment information was invalid'
                            })
                        }
                        
                        console.log(stripe_res.id);
                        
                        // xhr pay
                        // .then() => {
                            paymentPopup.close(true);
                        // }
                    });
                }
                
            }
            else $scope.done(true);
        //}
    }

});

