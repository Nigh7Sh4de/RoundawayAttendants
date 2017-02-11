angular.module('starter').controller("Home", function($scope, $stateParams, $state, $cordovaGeolocation) {

    var spots = [{
        location: { coordinates: [43.65, -79.38]}
    }, {
        location: { coordinates: [43.655, -79.385]}
    }, {
        location: { coordinates: [43.66, -79.39]}
    }]

    var mapOptions = {
        center: new google.maps.LatLng(43.656140, -79.381085),
        zoom: 14,
        maximumAge: 1000*60*60*24*365,
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


    $scope.changePlace = function() {
        console.log('location', $scope.location)
    }


    var input = document.getElementById('mapSearch');
    var searchBox = new google.maps.places.SearchBox(input);
    $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0)
            return;

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (place.geometry.viewport)
                bounds.union(place.geometry.viewport);
            else
                bounds.extend(place.geometry.location);
        });
        $scope.map.fitBounds(bounds);
    });



    var icon = {
        url: 'img/icon Final-Logo copy.png',
        scaledSize: new google.maps.Size(40, 40)
    }

    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
        $(".pac-container").attr('data-tap-disabled','true');
        spots.forEach(function(spot) {
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                icon: icon,
                position: new google.maps.LatLng(spot.location.coordinates[0], spot.location.coordinates[1])
            })
        })
    })

    var options = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }, function(error){
        console.log("Could not get location");
    });


});