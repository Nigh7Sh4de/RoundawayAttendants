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
    }
})