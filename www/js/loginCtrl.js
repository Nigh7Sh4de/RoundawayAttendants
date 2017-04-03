app.controller("Login", function ($scope, $stateParams, $ionicHistory, $ionicPopup, userInfoService) {
    
    $scope.$on('$ionicView.enter', function(event, viewData) {
        $ionicHistory.clearCache();
    }); 

    var redirect = function() {
        loading.close();
        $ionicHistory.goBack();
    }
    var authenticate = function(token) {
        userInfoService.authenticate(token)
        .then(redirect)
        .catch(function(err){
            loading.close()
            $ionicPopup.alert({
                title: "Oops!",
                template: err.errorMessage || err
            })
        })
    }

    var loading;

    $scope.login = function () {

        var fbConnect = window.facebookConnectPlugin || window.FB;

        loading = $ionicPopup.show({
            title: 'Loading',
            template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
        })
        if (userInfoService.OFFLINE_ONLY) {
            userInfoService.fakeAuthenticate()
            redirect();
        }
        else
            fbConnect.getLoginStatus(function(response) {
                if(response.status === 'connected') {
                    authenticate(response.authResponse.accessToken)
                }
                else {
                    fbConnect.login(['email', 'public_profile'], function(response) {
                        authenticate(response.authResponse.accessToken);
                    }, function(err) {
                        loading.close()
                        $ionicPopup.alert({
                            title: "Oops!",
                            template: err.errorMessage || err
                        })
                    });
                }
            });
    }
});