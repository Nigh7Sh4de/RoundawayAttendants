app.controller("Login", function ($scope, $stateParams, $ionicHistory, $ionicPopup, userInfoService) {

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


    loading = $ionicPopup.show({
        title: 'Loading',
        template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
    })
    if (userInfoService.OFFLINE_ONLY) {
        userInfoService.fakeAuthenticate()
        redirect();
    }
    else
        facebookConnectPlugin.getLoginStatus(function(response){
            if(response.status === 'connected'){
                authenticate(response.authResponse.accessToken)
            }
            else {
                facebookConnectPlugin.login(['email', 'public_profile'], function(response) {
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