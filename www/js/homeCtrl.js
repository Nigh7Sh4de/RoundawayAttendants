angular.module('starter').controller("Home", function($scope, $stateParams, $state, $cordovaGeolocation, resourceService) {

    var markers = [];
    $scope.updateSpots = function() {
        resourceService.getNearestSpots($scope.map.getCenter(), $scope.duration)
        .then(function(results) {
            markers.forEach(function(marker) {
                var keepMarker = false;
                for (var i=0;i<results.length;i++) {
                    if (results[i].id === marker.spot.id) {
                        keepMarker = true;
                        results.splice(i, 1)
                        break;
                    }
                }
                if (!keepMarker)
                    marker.setMap(null)
            })
            results.forEach(function(spot) {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    icon: icon,
                    spot: spot,
                    position: new google.maps.LatLng(spot.location.coordinates[0], spot.location.coordinates[1])
                })
                marker.addListener('click', function(marker) {
                    $state.go('resourceDetails', {
                        type: 'spots',
                        id: spot.id
                    })
                })
                markers.push(marker);
            })
        })
    }

    $scope.duration = {
        start: new Date(),
        end: new Date(new Date().valueOf() + 1000*60*60)
    }

    var mapOptions = {
        center: new google.maps.LatLng(43.656140, -79.381085),
        zoom: 14,
        maximumAge: 1000*60*60*24*365,
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var input = document.getElementById('mapSearch');
    var searchBox = new google.maps.places.SearchBox(input);
    searchBox.bindTo('bounds', $scope.map);
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
        $scope.updateSpots();
    });



    var icon = {
        url: 'img/icon Final-Logo copy.png',
        scaledSize: new google.maps.Size(40, 40)
    }

    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
        $(".pac-container").attr('data-tap-disabled','true');
        $scope.updateSpots();
    })

    google.maps.event.addListener($scope.map, 'dragend', function() {
        $scope.updateSpots();
    })

    var options = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }, function(error){
        console.error("Could not get location", error);
    });


});