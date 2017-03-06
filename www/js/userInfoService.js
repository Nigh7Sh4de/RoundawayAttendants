angular.module('starter').service('userInfoService', function ($http) {
    
    var OFFLINE_ONLY = false;

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

                var profile = currentUser.profile;
                if (!profile) {
                    profile = {
                        name: "Happy Gilmore",
                    }
                }
                resolve(profile);
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

    return {
        OFFLINE_ONLY: OFFLINE_ONLY,

        fakeAuthenticate: fakeAuthenticate,
        authenticate: authenticate,
        getProfileInfo: getProfileInfo
    }
});

