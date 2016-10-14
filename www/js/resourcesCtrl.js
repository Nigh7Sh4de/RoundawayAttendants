angular.module('starter').controller("ResourceList", function($scope, $stateParams, $state, resourceService) {

    $scope.resources = resourceService;

    $scope.context = 'lots';

    $scope.setContext = function(newContext) {
        $scope.context = newContext;
    }

    $scope.viewResourceDetails = function(type, id) {
        $state.go('resourceDetails', {
            type: type,
            id: id
        })
    }
 
});