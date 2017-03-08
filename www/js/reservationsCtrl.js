angular.module('starter').controller("Reservations", function ($scope, $state, resourceService, userInfoService) {
	
	$scope.$on('$ionicView.enter', function(event, viewData) {
		fetchBookingsInfo();
	});

  	function fetchBookingsInfo() {
		var isOnline = userInfoService.isAuthenticated()
		if (isOnline) {
	  		resourceService.getBookings().then(function(bookings) {
	  			$scope.upcomingBookings = bookings.upcoming;
	  			$scope.pastBookings = bookings.past;
	  		}).catch(function(err) {
	    		console.error('Error ' + err + 'retrieving bookings')
	    		$state.go('login');
	  		});
		} else {
			$state.go('login');
		}
	}
});