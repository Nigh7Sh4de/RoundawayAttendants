angular.module('starter').service('resourceService', function ($http) {

    var base_url = 'http://192.168.0.10:8081';

    var getResource = function (type, search) {
        return new Promise(function (resolve, reject) {
            var url = base_url + '/api/' + type;
            if (search) {
                if (typeof search === 'string') url += '/' + search;
                else {
                    url += '?';
                    for (var key in search)
                        url += key + '=' + search[key]
                }
            }
            $http.get(url, {
                headers: {
                    Authorization: 'JWT ' + window.localStorage.getItem("jwt")
                }
            })
                .then(function (res) {
                    resolve(res.data.data);
                })
        })
    }

    var checkAvailability = function (request) {
        return new Promise(function (resolve, reject) {
            var url = base_url + '/api/lots/' + request.lot + '/available/check';
            $http.put(url, request, {
                headers: {
                    Authorization: 'JWT ' + window.localStorage.getItem("jwt")
                }
            }).then(function (res) {
                resolve(res.data.data);
            })

        });
    }

    var createBooking = function (request) {
        return new Promise(function (resolve, reject) {
            var url = base_url + '/api/spot/' + request.spot + '/bookings';
            $http.put(url, request, {
                headers: {
                    Authorization: 'JWT ' + window.localStorage.getItem("jwt")
                }
            }).then(function (res) {
                resolve(res.data.data);
            })
        })
    }

    var payBooking = function (booking_id, stripe_token) {
        return new Promise(function (resolve, reject) {
            var url = base_url + '/api/bookings/' + booking.id + '/pay';
            $http.put(url, {
                token: stripe_token
            }, {
                headers: {
                    Authorization: 'JWT ' + window.localStorage.getItem("jwt")
                }
            }).then(function (res) {
                resolve(res.data.data);
            })
        })
    }

    var adjustAvailability = function (type, id, range, remove) {
        return new Promise(function (resolve, reject) {
            var url = base_url + '/api/' + type;
            if (id) url += '/' + id;
            url += '/available';
            if (remove) url += '/remove';
            $http.put(url, range, {
                headers: {
                    Authorization: 'JWT ' + window.localStorage.getItem("jwt")
                }
            })
                .then(function (res) {
                    return getResource(type, id)
                })
                .then(function (res) {
                    resolve(res)
                })
        })
    }

    return {
        authenticate: function (token) {
            return new Promise(function (resolve, reject) {
                $http.post(base_url + '/auth/facebook', {
                    access_token: token
                }).success(function (res) {
                    window.localStorage.setItem("jwt", res.data);
                    resolve();
                }).error(function (err) {
                    reject(err);
                })
            })
        },
        getResource: getResource,
        adjustAvailability: adjustAvailability,
        checkAvailability: checkAvailability,
        createBooking: createBooking,
        payBooking: payBooking
    });
})


    // var stuff = {
    //     spots: [{
    //         id: '123456789012345678901234',
    //         name: 'Spot #1',
    //         description: 'This is a really long description of the spot',
    //         generic: true,
    //         location: {
    //             address: '123 Fake St. Cityville, ON 1Z2X3C'
    //         },
    //         price: {
    //             perHour: 1.50
    //         },
    //         available: new ranger([{
    //             start: new Date('1:00 01/02/2013'),
    //             end: new Date('12:00 01/02/2013')
    //         }, {
    //             start: new Date('1:00 02/02/2023'),
    //             end: new Date('12:00 02/02/2013')
    //         }, {
    //             start: new Date('1:00 03/02/2013'),
    //             end: new Date('12:00 03/02/2013')
    //         }, {
    //             start: new Date('1:00 03/02/2016'),
    //             end: new Date('12:00 12/02/2016')
    //         }, {
    //             start: new Date('1:00 03/02/2017'),
    //             end: new Date('12:00 03/02/2017')
    //         }, {
    //             start: new Date('1:00 03/02/2018'),
    //             end: new Date('12:00 03/02/2018')
    //         }])
    //     }, {
    //         id: '123456789012345678901235',
    //         name: 'Spot #2',
    //         description: 'This is a really long description of the spot',
    //         generic: true,
    //         location: {
    //             address: '456 Derp Ave. Cityville, ON 1Z2X3C'
    //         },
    //         price: {
    //             perHour: 2.50
    //         }
    //     }, {
    //         id: '123456789012345678901236',
    //         name: 'Spot #3',
    //         description: 'This is a really long description of the spot',
    //         location: {
    //             address: '789 Good Ln. Cityville, ON 1Z2X3C'
    //         },
    //         price: {
    //             perHour: 3.50
    //         }
    //     }],

    //     lots: [{
    //         id: '123456789012345678902234',
    //         name: 'Lot #1',
    //         description: 'This is a really long description of the lot',
    //         location: {
    //             address: '456 Derp Ave. Cityville, ON 1Z2X3C'
    //         }
    //     }],

    //     cars: [{
    //         license: 'ABCD123',
    //         nextBooking: {
    //             start: new Date('1:00 01/02/2013'),
    //             end: new Date('12:00 01/02/2013')
    //         }
    //     }, {
    //         license: 'ABCD321'
    //     }]
    // }