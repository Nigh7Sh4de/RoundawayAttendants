// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    	.state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
    	.state('createBooking', {
            url: '/create/booking',
            templateUrl: 'templates/create_booking.html',
            controller: 'CreateBooking'
        })
    	.state('resourceDetails', {
            url: '/details/:type/:id',
            templateUrl: 'templates/details.html',
            controller: 'ResourceDetails'
        })
    	.state('confirmBooking', {
            url: '/confirm/booking',
            templateUrl: 'templates/confirm_booking.html',
            controller: 'ConfirmBooking'
        })
    	.state('searchCar', {
            url: '/search/car',
            templateUrl: 'templates/search_car.html',
            controller: 'SearchCar'
        });

    $urlRouterProvider.otherwise('/login');
})

app.controller("LoginController", function($scope, $stateParams, $state) {
 
    $scope.login = function() {
        console.log('log in!')
        $state.go('searchCar');
        // facebookConnectPlugin.getLoginStatus(function(success){
        //     console.log('got status!', status);
        //     if(success.status === 'connected'){
        //         console.log('already logged in :D');
        //         $state.go('welcome');
        //     }
        //     else {
        //         console.log('logging in...');
        //         facebookConnectPlugin.login(['email', 'public_profile'], function(response) {
        //             console.log('logged in!', response);
        //             $state.go('welcome');
        //         }, console.error);
        //     }
        // });
    }
 
});

app.controller("WelcomeController", function($scope, $stateParams) {
 
 
});

app.controller("CreateBooking", function($scope, $stateParams) {
 
 
});

app.controller("ResourceDetails", function($scope, $stateParams) {
 
 
});

app.controller("ConfirmBooking", function($scope, $stateParams) {
 
 
});

app.controller("SearchCar", function($scope, $stateParams) {
 
 
});