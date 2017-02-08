angular.module('starter').controller("Home", function($scope, $stateParams, $state, $cordovaGeolocation) {

    var mapOptions = {
        center: new google.maps.LatLng(43.656140, -79.381085),
        zoom: 14,
        maximumAge: 1000*60*60*24*365,
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var options = {timeout: 10000, enableHighAccuracy: false};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.map.setCenter(latLng);
        

    }, function(error){
        console.log("Could not get location");
    });


});