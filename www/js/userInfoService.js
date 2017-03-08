angular.module('starter').service('userInfoService', function ($http) {
    
    var OFFLINE_ONLY = true;

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
            if (!window.localStorage.getItem("jwt"))
                return Promise.reject(new Error('User not logged in'))
            else return new Promise(function (resolve, reject) {
                var url = base_url + '/api/users/profile';
                $http.get(url, {
                    headers: {
                        Authorization: 'JWT ' + window.localStorage.getItem("jwt")
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
        window.localStorage.setItem("jwt", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NzJlMzkwMmY1OTk5OGExZDc3ZmIyNSIsInByb2ZpbGUiOnsibmFtZSI6IkRlbm5pcyBQbG90bmlrIn0sImlhdCI6MTQ3ODczMDc4MX0.YWXwoNmg4pc1_A9wlV5qJ5ZKHlUgTa5XlbTVeBUIk7M")
        currentUser = data.user;   
    }

    var authenticate = function (token) {
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
    }

    return {
        OFFLINE_ONLY: OFFLINE_ONLY,

        fakeAuthenticate: fakeAuthenticate,
        authenticate: authenticate,
        getProfileInfo: getProfileInfo
    }
});

