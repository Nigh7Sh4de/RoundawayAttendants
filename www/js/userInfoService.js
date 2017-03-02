var OFFLINE_ONLY = true;

angular.module('starter').service('userInfoService', function ($http) {
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

    var data = Object.assign({}, init_data)
    window.data = data
    var currentUser = data.user

    var getProfileInfo = function() {
        if (OFFLINE_ONLY)
            return new Promise(function (resolve, reject){
                var profile = data.user.profile;
                if (!profile) {
                    profile = {
                        name: "Happy Gilmore",
                    }
                }
                resolve(profile);
            })
        else
            return new Promise(function (resolve, reject) {
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

    return {
        OFFLINE_ONLY: OFFLINE_ONLY,
        getProfileInfo: getProfileInfo
    }
});

