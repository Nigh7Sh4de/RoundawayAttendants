angular.module('starter').controller("ResourceDetails", function($scope, $stateParams, $state) {
    $scope.back = function() {
        $state.go('resourceList')
    }

    $scope.searchCarsInResource = function() {
        $state.go('searchCar', $stateParams)
    }
 
    var stuff = {

        spots: [{
            id: '123456789012345678901234',
            name: 'Spot #1',
            description: 'This is a really long description of the spot',
            generic: true,
            location: {
                address: '123 Fake St. Cityville, ON 1Z2X3C'
            },
            price: {
                perHour: 1.50
            },
            available: [{
                start: new Date('1:00 01/02/2013'),
                end: new Date('12:00 01/02/2013')
            }, {
                start: new Date('1:00 02/02/2023'),
                end: new Date('12:00 02/02/2013')
            }, {
                start: new Date('1:00 03/02/2013'),
                end: new Date('12:00 03/02/2013')
            }]
        }, {
            id: '123456789012345678901235',
            name: 'Spot #2',
            description: 'This is a really long description of the spot',
            generic: true,
            location: {
                address: '456 Derp Ave. Cityville, ON 1Z2X3C'
            },
            price: {
                perHour: 2.50
            }
        }, {
            id: '123456789012345678901236',
            name: 'Spot #3',
            description: 'This is a really long description of the spot',
            location: {
                address: '789 Good Ln. Cityville, ON 1Z2X3C'
            },
            price: {
                perHour: 3.50
            }
        }]
    }

    $scope.spot = stuff[$stateParams.type].filter(s => s.id == $stateParams.id)[0];

});
    