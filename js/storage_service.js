angular.module('storage.service',[])
.factory('Storage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      console.log("storage set "+key+": "+JSON.stringify(value));
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      console.log("storage get "+key+": "+$window.localStorage[key]);
      return JSON.parse($window.localStorage[key] || null);
    }
  }
}]);