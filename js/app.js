// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'angular-flot', 'ionicMultipleViews', 'starter.controllers', 
                           'rest.service', 'storage.service', 'factory.service',
                           'notify.service', 'main.service'])
  //

.run(function($ionicPlatform) {
  ImgCache.options.debug = false;
  ImgCache.options.chromeQuota = 50*1024*1024;      

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleLightContent();
    }

    ionic.Platform.fullScreen();

    window.plugins.jPushPlugin.init();
    window.plugins.jPushPlugin.setDebugMode(true); 
    window.plugins.jPushPlugin.getRegistrationID(function(data){
     try {
        console.log("JPushPlugin:registrationID is "+data)               
      } catch(exception) {
        console.log(exception);
      }
      });
    
    window.plugins.jPushPlugin.receiveMessageIniOSCallback = function(data) {
      console.log('tyson' + data);
    }

    // write log to console
    ImgCache.options.debug = false;
    // increase allocated space on Chrome to 50MB, default was 10MB
    ImgCache.options.chromeQuota = 500*1024*1024;
    ImgCache.init(function() {
      console.log('ImgCache init: success!');
    }, function(){
      console.log('ImgCache init: error! Check the log for errors');
    });
    
    //window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);


  });
})
.service('CacheImages', function($q){
    return {
        checkCacheStatus : function(src){
            var deferred = $q.defer();
            ImgCache.isCached(src, function(path, success) {
                if (success) {
                    deferred.resolve(path);
                } else {
                    ImgCache.cacheFile(src, function() {
                        ImgCache.isCached(src, function(path, success) {
                            deferred.resolve(path);
                        }, deferred.reject);
                    }, deferred.reject);
                }
            }, deferred.reject);
            return deferred.promise;
        }
    };
})
// <img ng-cache ng-src="..." />
.directive('ngCache', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attrs) {
            attrs.$observe('ngSrc', function(src) {
                ImgCache.isCached(src, function(path, success) {
                    if (success) {
                        ImgCache.useCachedFile(el);
                    } else {
                        ImgCache.cacheFile(src, function() {
                            ImgCache.useCachedFile(el);
                        });
                    }
                });

            });
        }
    };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js



  

  $stateProvider
  
  // main
  .state('main', {
    url: '/main',
    abstract: true,
    templateUrl: 'templates/main.html',
    controller: 'mainCtrl'
  })

  .state('main.index', {
    cache: false,
    url: '/index',
    views: {
        'main-index': {
        templateUrl: 'templates/main/index.html',
        controller: 'mainIndexCtrl'
      }
    }
  })

  .state('main.products', {
    cache: false,
    url: '/products/categories/:parentID/:categoryID',
    views: {
      'main-products': {
         templateUrl: 'templates/main/products.html',
         controller: 'mainProductsCtrl'
      },

      'main-categories': {
         templateUrl: 'templates/main/categories.html',
         controller: 'mainCategoriesCtrl'
         
      }
    }
  })


  .state('main.guest', {
    url: '/guest',
    views: {
        'main-guest': {
        templateUrl: 'templates/main/guest.html',
        controller: 'mainGuestCtrl'
      }
    }
  })

  .state('main.my', {
    url: '/my',
    views: {
      
      'main-my-menu': {
         templateUrl: 'templates/main/my_menu.html',
         controller: 'CustomerMenuCtrl'
      },

      'main-my-toolbox': {
         templateUrl: 'templates/main/my_toolbox.html',
         controller: 'mainCustomerCtrl'
      }
    }
  })

  .state('main.toolbox', {
    url: '/toolbox',
    views: {
      'main-consultant-menu': {
         templateUrl: 'templates/main/consultant_menu.html',
         controller: 'ConsultantMenuCtrl'
      },

      'main-consultant-toolbox': {
         templateUrl: 'templates/main/consultant_toolbox.html',
         controller: 'mainConsultantCtrl'
      }
    }
  })


  // promotion
  /*
  .state('promotion', {
    url: '/promotion',
    abstract: true,
    templateUrl: 'templates/promotion.html'
  })
  */
  .state('common.promotion_detail', {
    url: '/promotion/detail/:productId',
    views: {
      'promotion-product-detail': {
         templateUrl: 'templates/promotion/product_detail.html',
         controller: 'promotionDetailCtrl'
      }
    }
  })

  // booking
  .state('common', {
    url: '/common',
    abstract: true,
    templateUrl: 'templates/common.html',
    controller: 'commonCtrl'
  })

 
  .state('common.service', {
    cache: false,
    url: '/service/:productId',
    views: {
      'common-service': {
         templateUrl: 'templates/common/service.html',
         controller: 'commonServiceCtrl'
      }
    }
  })



  .state('common.booking_detail', {
    url: '/booking/detail/:bookingId',
    views: {
      
      'booking-detail': {
         templateUrl: 'templates/common/booking_detail.html',
         controller: 'bookingDetailCtrl'
      }
    }
  })
  .state('common.order_detail', {
    cache: false,
    url: '/order/detail/:orderId',
    views: {
      'order-menu': {
         templateUrl: 'templates/common/order_menu.html',
         controller: 'orderMenuCtrl'
      },

      'order-detail': {
         templateUrl: 'templates/common/order_detail.html',
         controller: 'orderDetailCtrl'
      }
    }
  })

  .state('common.customer_history', {
    //cache: false,
    url: '/customer/history/:customerId',
    views: {
      'customer-history-menu': {
         templateUrl: 'templates/common/customer_history_menu.html'
      },
      'customer-history': {
         templateUrl: 'templates/common/customer_history.html',
         controller: 'commonCustomerHistoryCtrl'
      }
    }
  })


  .state('common.publicfunds', {
    cache: false,
    url: '/publicfunds',
    views: {
      'publicfunds': {
         templateUrl: 'templates/common/publicfunds.html',
         controller: 'publicfundsCtrl'
      }
    }
  })

  .state('common.publicfund1', {
    cache: false,
    url: '/publicfund1/:productId/:fundNo',
    views: {
      'publicfund1': {
         templateUrl: 'templates/common/publicfund1.html',
         controller: 'publicfundCtrl'

      }
    }
  })
  .state('common.publicfund2', {
    cache: false,
    url: '/publicfund2',
    views: {
      'publicfund2': {
         templateUrl: 'templates/common/publicfund2.html'
      }
    }
  })

  .state('common.buy', {
    cache: false,
    url: '/buy/:productId/:fundNo',
    views: {
      'common-buy': {
         templateUrl: 'templates/common/buy.html',
         controller: 'commonBuyCtrl'
      }
    }
  })

  .state('common.redeem', {
    cache: false,
    url: '/redeem/:orderId/:fundNo',
    views: {
      'common-redeem': {
         templateUrl: 'templates/common/redeem.html',
         controller: 'commonRedeemCtrl'
      }
    }
  })

    // exam
  .state('exam', {
    url: '/exam',
    abstract: true,
    templateUrl: 'templates/exam.html',
    controller: 'examCtrl'
  })

  .state('exam.customer', {
    url: '/customer/:suite',
    views: {
      'exam-menu': {
         templateUrl: 'templates/exam/exam_menu.html'
      },
      'exam-customer': {
         templateUrl: 'templates/exam/exam_customer.html',
         controller: 'examCustomerCtrl'
      }
    }
  });



  $urlRouterProvider.otherwise('/main/index');



});

