Stripe.setPublishableKey("pk_test_WwMFp1CE94C8P8QLtPrzW5Lq"); 

var app = angular.module('starter', ['ionic', 'ion-datetime-picker', 'credit-cards'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
        resourceService.authenticate(token)
        .then(function() {
            loading.close();
            $state.go('resourceList');
        })
        .catch(function(err){
            loading.close()
            $ionicPopup.alert({
                title: "Oops!",
                template: err.errorMessage || err
            })
        })
    }

    var loading;

    $scope.login = function () {


    loading = $ionicPopup.show({
        title: 'Loading',
        template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
    })
    if (resourceService.mode === 'debug') {
        resourceService.fakeAuthenticate()
        loading.close()
        $state.go('resourceList')
    }
    else
        facebookConnectPlugin.getLoginStatus(function(response){
            if(response.status === 'connected'){
                authenticate(response.authResponse.accessToken)
            }
            else {
                facebookConnectPlugin.login(['email', 'public_profile'], function(response) {
                    authenticate(response.authResponse.accessToken);
                }, function(err) {
                    loading.close()
                    $ionicPopup.alert({
                        title: "Oops!",
                        template: err.errorMessage || err
                    })
                });
            }
        });
    }

});