var OFFLINE_ONLY = true;

angular.module('starter').service('resourceService', function ($http) {

    Date.prototype.addHours = function(h){
        this.setTime(this.getTime() + (h*60*60*1000)); 
        return this;
    }

    var base_url = 'http://roundaway.com:8081';

    var init_data = {
        lots: [{
            id: 'l1234567890123456789012345',
            name: 'My awesome lot',
            location: {
                address: '123 Fake st, Toronto ON' ,
                coordinates: [43.65, -79.38]
            },
            price: {
                perHour: 5.00
            }
        }],

        spots: [
        {
            id: 's1234567890123456789012345',
            lot: 'l1234567890123456789012345',
            name: 'Spot #1',
            available: new ranger([{
                start: new Date('01/01/2000'),
                end: new Date('01/01/2100')
            }]),
            location: {
                address: '456 Road ave, Toronto ON',
                coordinates: [43.655, -79.385]
            },
            price: {
                perHour: 5.00
            }
        }, {
            id: 's1234567890123456789012346',
            lot: 'l1234567890123456789012345',
            name: 'Spot #2',
            available: new ranger([{
                start: new Date('01/01/2000'),
                end: new Date('01/01/2100')
            }]),
            location: {
                address: '456 Road ave, Toronto ON',
                coordinates: [43.66, -79.39]
            },
            price: {
                perHour: 5.00
            }
        }, {
            id: 's1234567890123456789012347',
            lot: 'l1234567890123456789012345',
            reserved: true,
            name: 'Spot #3',
            available: new ranger([{
                start: new Date('01/01/2000'),
                end: new Date('01/01/2100')
            }]),
            location: {
                address: '456 Road ave, Toronto ON',
                coordinates: [43.665, -79.395]
            },
            price: {
                perHour: 7.50
            }
        }],
        
        bookings: [],

        cars: []
    }

    var data = Object.assign({}, init_data)
    window.data = data

    var getNearestSpots = function(coords, duration) {
        if (OFFLINE_ONLY)
            return Promise.resolve(data.spots.filter(function(spot) {
                return spot.available.check(duration.start);
            }));
        else
            return new Promise(function(resolve, reject) {
                var url = base_url + '/api/spots/near?'
                url += 'long=' + coords.lng();
                url += '&lat=' + coords.lat();
                url += '&available=' + duration.start;
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

    var getResource = function (type, search) {
        if (OFFLINE_ONLY)
            return new Promise(function(resolve, reject){
                if (!search)
                    resolve(data[type])
                else if (typeof search === 'string')
                    resolve(data[type].filter(function(item){return item.id === search })[0])
                else if (typeof search === 'object')
                    resolve(data[type].filter(function(item){
                        for (var prop in search)
                            if (item[prop] !== search[prop])
                                return false
                        return true
                    }))

                else reject('not found')
            })
        else
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

    var checkLotAvailability = function (request) {
        if (OFFLINE_ONLY)
            return new Promise(function (resolve, reject) {
                const foundSpot = null;
                for (var i=0; i<data.spots.length; i++)
                {
                    if (data.spots[i].lot === request.lot &&
                        !data.spots[i].reserved &&
                        data.spots[i].available.checkRange(request.start, request.end))
                            resolve({exact: [data.spots[i]]}); 
                }
                reject()
            })
        else
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
        if (OFFLINE_ONLY)
            return new Promise(function (resolve, reject){
                var spot = data.spots.filter(function(s){return s.id === request.spot})[0];
                var car = data.cars.filter(function(c){return c.license === request.license})[0]
                if (!car) {
                    car = {
                        license: request.license,
                        id: 'c123456789000' + new Date().valueOf()
                    }
                    data.cars.push(car)
                }
                request.car = car.id
                data.bookings.push(request);
                spot.available.removeRange(request.start, request.end);
                resolve();
            })
        else
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
        if (OFFLINE_ONLY)
            return Promise.resolve();
        else
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

    // var adjustAvailability = function (type, id, range, remove) {
    //     return new Promise(function (resolve, reject) {
    //         var url = base_url + '/api/' + type;
    //         if (id) url += '/' + id;
    //         url += '/available';
    //         if (remove) url += '/remove';
    //         $http.put(url, range, {
    //             headers: {
    //                 Authorization: 'JWT ' + window.localStorage.getItem("jwt")
    //             }
    //         })
    //         .then(function (res) {
    //             return getResource(type, id)
    //         })
    //         .then(function (res) {
    //             resolve(res)
    //         })
    //     })
    // }

    return {
        OFFLINE_ONLY: OFFLINE_ONLY,

        fakeAuthenticate: function(){
            window.localStorage.setItem("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzJlMzkwMmY1OTk5OGExZDc3ZmIyNSIsInByb2ZpbGUiOnsibmFtZSI6IkRlbm5pcyBQbG90bmlrIn0sImlhdCI6MTQ3ODczMDc4MX0.YWXwoNmg4pc1_A9wlV5qJ5ZKHlUgTa5XlbTVeBUIk7M")
        },

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
        getNearestSpots: getNearestSpots,
        // adjustAvailability: adjustAvailability,
        checkLotAvailability: checkLotAvailability,
        createBooking: createBooking,
        payBooking: payBooking
    }
})