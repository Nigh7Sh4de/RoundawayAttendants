angular.module('starter').controller("Settings", function ($scope, $stateParams, $ionicModal, $ionicHistory, $state, $ionicPopup, userInfoService, resourceService) {

    $ionicModal.fromTemplateUrl('templates/resources.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    })

    $scope.manage = function() {
        $scope.modal.show();
    }

    $scope.signOut = function() {
        userInfoService.logOut()    
        $ionicHistory.clearCache();
        $state.go('home');
    }


    // An alert dialog
    $scope.showAlert = function(message) {
        var alertPopup = $ionicPopup.alert({
            title: 'Oops!',
            template: message
        });
        alertPopup.then(function(res) {});
    };

    //Get cars
    var getCars = function() {
        resourceService.getResource('cars')
        .then(function(cars) {
            $scope.cars = cars
            $scope.$apply()
        })
    }
    getCars()

    //Edit car dialog
    $scope.editCar = function(car) {
        var editCarPopup = $ionicPopup.alert({
            title: 'Edit Car',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                type: 'button-default'
            }, {
                text: 'Set Default',
                type: 'button-positive',
                onTap: function(e) {
                    e.preventDefault()
                    loading = $ionicPopup.show({
                        title: 'Loading',
                        template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
                    })
                    resourceService.setDefaultCar(car)
                    .then(function(result) {
                        getCars()
                        loading.close()
                        editCarPopup.close()
                    })
                    .catch(function(err) {
                        $scope.showAlert(err)
                        loading.close()
                    })
                }
            }
            // , {
            //     text: 'Delete',
            //     type: 'button-assertive',
            //     onTap: function(e) {
            //         e.preventDefault()
            //         loading = $ionicPopup.show({
            //             title: 'Loading',
            //             template: '<div style="text-align: center;"><ion-spinner></ion-spinner></div>'
            //         })
            //         console.log('...deleting car', car)
            //         loading.close()
            //     }
            // }
            ]
        })
    }
});