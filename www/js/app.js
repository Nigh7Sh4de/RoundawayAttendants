// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

Stripe.setPublishableKey("pk_test_WwMFp1CE94C8P8QLtPrzW5Lq"); 

var app = angular.module('starter', ['ionic', 'ion-datetime-picker', 'credit-cards'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            })
            .state('createBooking', {
                url: '/:type/:id/cars/:license/createbooking',
                templateUrl: 'templates/create_booking.html',
                controller: 'CreateBooking'
            })
            .state('resourceDetails', {
                url: '/:type/:id',
                templateUrl: 'templates/details.html',
                controller: 'ResourceDetails'
            })
            .state('confirmBooking', {
                url: '/create/booking/confirm',
                templateUrl: 'templates/confirm_booking.html',
                controller: 'ConfirmBooking'
            })
            .state('searchCar', {
                url: '/:type/:id/cars',
                templateUrl: 'templates/search_car.html',
                controller: 'SearchCar'
            })
            .state('resourceList', {
                url: '/',
                templateUrl: 'templates/resources.html',
                controller: 'ResourceList'
            });

        $urlRouterProvider.otherwise('/login');
    })

app.controller("LoginController", function ($scope, $stateParams, $state, $ionicPopup, resourceService) {

    var authenticate = function(token) {
        var loading = $ionicPopup.show({
            title: 'Loading',
            template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
        })
        resourceService.authenticate(token)
        .then(function() {
            loading.close();
            $state.go('resourceList');
        })
    }

    $scope.login = function () {
        facebookConnectPlugin.getLoginStatus(function(response){
            if(response.status === 'connected'){
                authenticate(response.authResponse.accessToken)
            }
            else {
                facebookConnectPlugin.login(['email', 'public_profile'], function(response) {
                    authenticate(response.authResponse.accessToken);
                }, function(err) {
                    $ionicPopup.alert({
                        title: "Oops!",
                        template: err.errorMessage || err
                    })
                });
            }
        });
    }

});