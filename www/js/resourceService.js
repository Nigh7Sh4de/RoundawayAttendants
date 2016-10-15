angular.module('starter').service('resourceService', function ($http) {

    var jwt;

    var getStuff = function() {
        $http.get('localhost:8081/api/spots', {
            headers: {
                Authorization: 'JWT ' 
            }
        })
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
            available: new ranger([{
                start: new Date('1:00 01/02/2013'),
                end: new Date('12:00 01/02/2013')
            }, {
                start: new Date('1:00 02/02/2023'),
                end: new Date('12:00 02/02/2013')
            }, {
                start: new Date('1:00 03/02/2013'),
                end: new Date('12:00 03/02/2013')
            }, {
                start: new Date('1:00 03/02/2016'),
                end: new Date('12:00 12/02/2016')
            }, {
                start: new Date('1:00 03/02/2017'),
                end: new Date('12:00 03/02/2017')
            }, {
                start: new Date('1:00 03/02/2018'),
                end: new Date('12:00 03/02/2018')
            }])
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
        }],

        lots: [{
            id: '123456789012345678902234',
            name: 'Lot #1',
            description: 'This is a really long description of the lot',
            location: {
                address: '456 Derp Ave. Cityville, ON 1Z2X3C'
            }
        }],

        cars: [{
            license: 'ABCD123',
            nextBooking: {
                start: new Date('1:00 01/02/2013'),
                end: new Date('12:00 01/02/2013')
            }
        }, {
            license: 'ABCD321'
        }]
    }

    return Object.assign({}, stuff, {
        authenticate: function(token) {
            return new Promise(function(resolve, reject) {
                $http.post('http://192.168.0.10:8081/auth/facebook', {
                    // data: {
                        access_token: token
                    // }
                }).success(function(res) {
                    console.log('got auth response from API', arguments);
                    jwt = res.data;
                    resolve();
                }).error(function(err) {
                    reject(err);
                })
            })
        },
        getStuff: getStuff
    });
})