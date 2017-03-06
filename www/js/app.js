Stripe.setPublishableKey("pk_test_WwMFp1CE94C8P8QLtPrzW5Lq"); 

var app = angular.module('starter', ['ionic', 'ngCordova', 'ion-datetime-picker', 'credit-cards'])

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
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.backButton.previousTitleText(false).text('');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'Login'
            })
            .state('createBooking', {
                url: '/:type/:id/createbooking',
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
                url: '/manage',
                templateUrl: 'templates/resources.html',
                controller: 'ResourceList'
            })
            .state('home', {
                url: '/',
                templateUrl: 'templates/home.html',
                controller: 'Home'
            })
            .state('reservations', {
                url: '/reservations',
                templateUrl: 'templates/reservations.html',
                controller: 'Reservations'
            })
            .state('settings', {
                url:'/settings',
                templateUrl: 'templates/settings.html',
                controller: 'Settings'
            })
            .state('profile', {
                url:'/profile',
                templateUrl: 'templates/profile.html',
                controller: 'Profile'
            });
        $urlRouterProvider.otherwise('/');
    }) 
    .directive('profileBarWidget', function($ionicGesture) {
        return {
            restrict: 'AE',
            // declare the directive scope as private (and empty)
            scope: {},
            // add behaviour to our buttons and use a variable value
            templateUrl: 'templates/profile_bar.html',
            // we just declare what we need in the above template
            controller: 'ProfileBarController'
        };
    })
