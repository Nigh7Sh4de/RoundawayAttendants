angular.module('starter').controller("ProfileBarWidgetController", function ($scope, $stateParams, $state, userInfoService) {
    userInfoService.getProfileInfo().then(function(userInfo) {
        $scope.name = userInfo.name;
    }).catch(function(err) {
        console.error('Error ' + err + 'retrieving userInfo')
        $scope.showAlert(err.message)
    });
});