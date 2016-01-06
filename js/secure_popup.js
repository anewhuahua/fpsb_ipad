angular.module('securePopup',[])
.factory('SecurePopup', [
        '$ionicPopup',
        '$q',
        function ($ionicPopup, $q) {
            var firstDeferred = $q.defer();
            firstDeferred.resolve();
            var lastPopupPromise = firstDeferred.promise;
            return {
                'show': function (method, object) {
                    var deferred = $q.defer();
                    lastPopupPromise.then(function () {
                        $ionicPopup[method](object).then(function (res) {
                            deferred.resolve(res);
                        });
                    });
                    lastPopupPromise = deferred.promise;
                    return deferred.promise;
                }
            };
        }
  ])

  
});