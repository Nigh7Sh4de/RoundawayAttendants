angular.module('starter').service('userInfoService', function ($http) {
    
    var OFFLINE_ONLY = false;
    var storage = window.localStorage;
    var cachedToken;

    var base_url = 'http://roundaway.com:8081';

    var init_data = {
    	user: {
            id: '12244486314',
			profile: {
				name:"Happy Gilmore"
			},
			authid: {
    			facebook: "",
    			google: ""
			},
			stripe: {
				acct: "",
				cus: "",
				public: "",
				secret: ""
			},
			admin: false
    	}
    }

    var data = Object.assign({}, window.data, init_data)
    window.data = data
    var currentUser = data.user

    var setToken = function(token) {
        cachedToken = token;
        storage.setItem('jwt', token);
    };

    var getToken = function() {
        cachedToken = storage.getItem('jwt');
        return cachedToken;
    }

    var isAuthenticated = function() {
        //return true if we get something from getToken
        return !!getToken();
    }

    var getProfileInfo = function() {
        if (OFFLINE_ONLY)
            return new Promise(function (resolve, reject){
                if (!currentUser) 
                    return reject(new Error('User not logged in'));

                var result = Object.assign({}, currentUser.profile, {
                    id: currentUser.id
                })
                resolve(result);
            })
        else {
            var isOnline = isAuthenticated()
            if (!isOnline)
                return Promise.reject(new Error('User not logged in'))
            else return new Promise(function (resolve, reject) {
                var jwt_token = getToken()
                var url = base_url + '/api/users/profile';
                $http.get(url, {
                    headers: {
                        Authorization: 'JWT ' + jwt_token
                    }
                })
                .then(function (response) {
                    currentUser = response.data.data;
                    window.localStorage.setItem("user_id", currentUser.id);
                    resolve(response.data.data);
                })
            })
        }
    }

    var fakeAuthenticate = function(){
        setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzJlMzkwMmY1OTk5OGExZDc3ZmIyNSIsInByb2ZpbGUiOnsibmFtZSI6IkRlbm5pcyBQbG90bmlrIn0sImlhdCI6MTQ3ODczMDc4MX0.YWXwoNmg4pc1_A9wlV5qJ5ZKHlUgTa5XlbTVeBUIk7M")
        currentUser = data.user;   
    }

    var authenticate = function (token) {
        return new Promise(function (resolve, reject) {
            $http.post(base_url + '/auth/facebook', {
                access_token: token
            }).success(function (res) {
                setToken(res.data)
                resolve();
            }).error(function (err) {
                reject(err);
            })
        })
    }

    var logOut = function() {
        storage.removeItem('jwt');
    }

    return {
        OFFLINE_ONLY: OFFLINE_ONLY,

        fakeAuthenticate: fakeAuthenticate,
        authenticate: authenticate,
        getProfileInfo: getProfileInfo,
        getToken: getToken,
        logOut: logOut,
        isAuthenticated: isAuthenticated    
    }
});

