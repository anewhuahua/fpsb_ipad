angular.module('notify.service',['main.service'])
.factory('Notify', function($rootScope, $state, $timeout, Main) {
  return {
    send: function(msg, data) {
      //$state.go('main.my');
      if(msg == 'AddBooking') {
      	$rootScope.$broadcast(msg, data);
      	//$state.go('main.my');
      	//$rootScope.
      	//console.log(msg);
      }
    },

    notify: function(msg) {
      var role = Main.getRole();
      if (msg == 'booking') {
        if (role == 'Customer') {
          $state.go('main.my');
          $timeout(function() { 
            $rootScope.$broadcast('ChangeWindow', {win:'bookings'});
          }, 500); 
        } else if (role == 'Consultant') {

        }
      }
      else {
        if (role == 'Customer') {
          $state.go('main.my');
          $timeout(function() { 
            $rootScope.$broadcast('ChangeWindow', {win:'orders'});
          }, 500); 
        }

      }
      
    }
  }
});