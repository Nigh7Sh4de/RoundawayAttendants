angular.module('starter').controller("Reservations", function ($scope, $state, resourceService) {

  resourceService.getBookings().then(function(bookings) {
    $scope.upcomingBookings = bookings.upcoming;
    $scope.pastBookings = bookings.past;
  }).catch(function(err) {
    console.error('Error ' + err + 'retrieving bookings')
  });
});