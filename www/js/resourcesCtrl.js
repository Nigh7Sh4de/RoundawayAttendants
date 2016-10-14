angular.module('starter').controller("ResourceList", function($scope, $stateParams, $state) {

    $scope.spots = [{
        id: '123456789012345678901234',
        name: 'Spot #1',
        location: {
            address: '123 Fake St. Cityville, ON 1Z2X3C'
        }
    }, {
        id: '123456789012345678901235',
        name: 'Spot #2',
        location: {
            address: '456 Derp Ave. Cityville, ON 1Z2X3C'
        }
    }, {
        id: '123456789012345678901236',
        name: 'Spot #3',
        location: {
            address: '789 Good Ln. Cityville, ON 1Z2X3C'
        }
    }]

    $scope.viewResourceDetails = function(type, id) {
        $state.go('resourceDetails', {
            type: type,
            id: id
        })
    }
 
});