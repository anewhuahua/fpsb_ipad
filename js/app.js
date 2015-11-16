// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'angular-flot', 'ionicMultipleViews', 'starter.controllers', 
                           'rest.service', 'storage.service', 'factory.service',
                           'notify.service', 'main.service'])
  //

.run(function($ionicPlatform) {
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
    
    
    //window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);


  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
/*
  $stateProvider
  .state('product', {
    url: '/product',
    views: {
      'product-detail': {
         templateUrl: 'templates/product.html',
         controller: 'productDetailCtrl'
      }
    }
  });*/

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
  .state('promotion', {
    url: '/promotion',
    abstract: true,
    templateUrl: 'templates/promotion.html'
  })

  .state('promotion.product_detail', {
    url: '/product/detail/:promotionId',
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
    url: '/service/:categoryId/:productId',
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
    url: '/publicfund1',
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


    // exam
  .state('exam', {
    url: '/exam',
    abstract: true,
    templateUrl: 'templates/exam.html',
    controller: 'examCtrl'
  })

  .state('exam.customer', {
    url: '/customer',
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

