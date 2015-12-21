angular.module('notify.service',['main.service'])
.factory('Notify', function($rootScope, $state, $timeout, Main) {
  var option = {
    Customer: {
      booking: {state: 'main.my', win:'bookings', sub:'all'},
      order:   {state: 'main.my', win:'orders', sub:'all'}
    },
    Consultant: {
      booking: {state: 'main.toolbox', win:'bookings', sub:'all'},
      order:   {state: 'main.toolbox', win:'orders', sub:'all'}
    }
  };


  return {
    /*
    send: function(msg, data) {
      //$state.go('main.my');
      if(msg == 'AddBooking') {
      	$rootScope.$broadcast(msg, data);
      	//$state.go('main.my');
      	//$rootScope.
      	//console.log(msg);
      }
    },*/
    refreshMenu: function() {
      $timeout(function() { 
        $rootScope.$broadcast('RefreshMenu');
      }, 500); 
    }
    notify: function(msg) {
      var role   = Main.getRole();
      var state  = option[role][msg].state;
      var first  = option[role][msg].win;
      var second = option[role][msg].sub;
      $state.go(state);
      $timeout(function() { 
        $rootScope.$broadcast('ChangeWindow', {win:first, sub:second});
      }, 500); 
    }
  }

});