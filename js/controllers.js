angular.module('starter.controllers', [])


.controller('customersCtrl', function($scope, $ionicSideMenuDelegate,$timeout) {
  
  //$scope.$on('$ionicView.enter', function() {
     // Code you want executed every time view is opened
     //console.log('Opened!')

    // $ionicSideMenuDelegate.toggleRight();
  //})
  //$timeout(function (){
   
  //});
})

.controller('promotionDetailCtrl', function($scope){

})

.controller('examCtrl', function($scope) {
  $scope.win = {
    result: false
  }
})
.controller('examCustomerCtrl', function($scope) {
  $scope.showResult = function() {
    $scope.win.result = true;
  }
})

.controller('commonCtrl', function($scope, $stateParams, $ionicHistory) {
  $scope.data = {
    popup: ''
  };
  $scope.goBack = function() {
    console.log('goback');
    $ionicHistory.goBack();
  }
  $scope.showProduct = function(product) {
    $scope.data.popup = 'privateFund';
    $scope.data.looking_product = product;
    console.log("looking product: "+product.id);
    //console.log(product);
  }


  $scope.closeProduct = function() {
    $scope.data.popup = '';
    $scope.data.looking_product = null;
  }
})
.controller('bookingMenuCtrl', function($scope, $stateParams, $ionicHistory) {

})
.controller('bookingDetailCtrl', function($scope, $stateParams, Main) {
  
  var bid = $stateParams.bookingId;
  //$scope.booking = Main.consultant.getBooking(bid);
  //console.log($scope.booking);
})
.controller('orderMenuCtrl', function($scope, $stateParams, $ionicHistory) {

})
.controller('orderDetailCtrl', function($scope, $stateParams, Main) {
  //console.log('124455');
  var oid = $stateParams.orderId;
  console.log(oid);
  if (Main.getRole() == 'Customer') {
    $scope.data.order = Main.customer.getOrder(oid);
  } else if(Main.getRole() == 'Consultant') {
  }
  $scope.data.orderState = Main.getOrderState();
  $scope.data.productType = Main.getProductType();

  $scope.data.win = 'detail';
  $scope.selectWin = function(item){
    console.log(item);
    $scope.data.win=item;
  }
  //$scope.booking = Main.consultant.getBooking(bid);
  //console.log($scope.booking);
})



.controller('mainCtrl', function($scope, $state, $window, $cordovaNetwork, $rootScope, $ionicHistory, $timeout, Main, Notify) {

   document.addEventListener("deviceready", function () {
        $scope.network = $cordovaNetwork.getNetwork();
        $scope.isOnline = $cordovaNetwork.isOnline();
        $scope.$apply();

        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
          /*
          window.plugins.jPushPlugin.init();
          window.plugins.jPushPlugin.setDebugMode(true); 
          console.log('11');
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

          broadCast  refresh
          */
            console.log("got online");
            $scope.isOnline = true;
            $scope.network = $cordovaNetwork.getNetwork();
            $scope.$apply();
        })

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("got offline");
            $scope.isOnline = false;
            $scope.network = $cordovaNetwork.getNetwork();
            $scope.$apply();
        })
  }, false);

  $scope.data = {
    person: {},
    popup: '',
    warning: {
      status: '',
      words: ''
    },
    categories: [],
    toolbox:'index',
    looking_product: '',
    product_act_booking: true,
    product_act_order:   true,

    dialog: {
      step: 10000,
      minimal: 10000,
      maximum: 1000000,
      booking: {
        quantity: 10000
      },
      order: {
        quantity: 10000
      },
      increase: function() {
        if($scope.data.dialog.booking.quantity + $scope.data.dialog.step <= $scope.data.dialog.maximum) {
          $scope.data.dialog.booking.quantity += $scope.data.dialog.step;
          $scope.data.dialog.order.quantity += $scope.data.dialog.step; 
        }
      },
      decrease: function () {
        if($scope.data.dialog.booking.quantity - $scope.data.dialog.step >= $scope.data.dialog.minimal) {
          $scope.data.dialog.booking.quantity -= $scope.data.dialog.step;
          $scope.data.dialog.order.quantity -= $scope.data.dialog.step;
        }
      }
    }
  };

  Main.login({}, function(){ 
    }, function(){
    }, function(profile){
      $scope.data.person = profile;
      console.log($scope.data.person.role);
    });
  

  $scope.showProduct = function(product, param) {
    $scope.data.popup = 'privateFund';
    $scope.data.looking_product = product;
    console.log("looking product: "+product.id);
    
    $scope.data.product_act_booking = true;
    $scope.data.product_act_order = true;

    if (param == 'NoBooking') {
      $scope.data.product_act_booking = false;
    } else if (param == 'NoOrder') {
      $scope.data.product_act_order = false;
    } else {

    }
    //console.log(product);
  }
  $scope.enableBooking = function() {
    return $scope.data.product_act_booking;
  }
  $scope.enableOrder = function() {
    if ($scope.data.looking_product.type.toLowerCase() == 'publicfund') {
      return true;
    } else {
      return false;
    }
  }

  $scope.closeProduct = function() {
    $scope.data.popup = '';
    $scope.data.looking_product = null;
  }
  $scope.closePopup = function(win) {
    if ($scope.data.popup == win) {
      $scope.data.popup = '';
    }
    if (win == 'login') {
      $ionicHistory.goBack();
    }
  }

  $scope.closeWarning = function(win) {
    $scope.data.warning.status='';
    //$scope.data.warning.words = '';

    if ($scope.data.warning.words.indexOf('您的预约已成功提交')>=0) {
      Notify.notify('booking');
    } else if ($scope.data.warning.words.indexOf('您的订单已成功提交')>=0) {
      Notify.notify('order');
    } else {

    }
  }
  $scope.backProduct = function() {
    if($scope.data.looking_product) {
      $scope.data.popup = 'privateFund';
    }
  }
  $scope.bookingDialog = function() {
    if ($scope.data.looking_product) {
      //$scope.data.looking_product = null;
      $scope.data.popup = 'BookingDialog';
    }
  }
  $scope.orderDialog = function() {
    if ($scope.data.looking_product) {
      //$scope.data.looking_product = null;
      $scope.data.popup = 'OrderDialog';
    }
  }

  

  $scope.addBooking= function(quantity) {
    // todo quantity
    if($scope.data.looking_product) {
      //console.log('booking add');
      Main.customer.addBooking($scope.data.looking_product.id, function(data){
        $scope.data.warning.status = 'success';
        $scope.data.warning.words = '您的预约已成功提交!' +
                                     '您的理财师将马上与您联系，请保持电话通畅!';

        $scope.$broadcast("AddBooking", data);

        //console.log("tyson");
      }, function(error){
        $scope.data.warning.status = 'fail';
        $scope.data.warning.words = error;

      }, function(){
      });
    } else {
      console.log("no product id for booking");
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '请去发现页预约产品';

    }
    $scope.data.looking_product=null;
    $scope.data.popup = '';
  }

  $scope.addOrder = function() {
    if($scope.data.looking_product) {
      //console.log('booking add');
      Main.customer.submitOrder($scope.data.looking_product.id, function(data){
        $scope.data.warning.status = 'success';
        $scope.data.warning.words = '您的订单已成功提交!' +
                                     '您的理财师将马上与您联系进行后续服务，请保持电话通畅!';
        $scope.$broadcast("AddOrder", data);
        //console.log(data);
        //console.log("tyson");
      }, function(error){
        $scope.data.warning.status = 'fail';
        $scope.data.warning.words = error;
      }, function(){

      });
    } else {
      console.log("no product id for order");
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '请去发现页购买产品';
    }
    $scope.data.looking_product=null;
    $scope.data.popup = '';
  }


  //$scope.verifyCode = "";
  $scope.auth = {
    register: {
      verifyWords : '发送验证码',
      askingVerify: false,
      username: '',
      password: '',
      password2: '',
      verifyCode: '',
      returnCode: ''
    },
    login: {
      username:'',
      password:''
    }
  };
  var clearRegister = function(){
    $scope.auth.register.verifyWords = "发送验证码";
    $scope.auth.register.askingVerify = false;
    $scope.auth.register.verifyCode = '';
    $scope.auth.register.returnCode ='';
    $scope.auth.register.usernmae = '';
    $scope.auth.register.password = '';
    $scope.auth.register.password2 = '';
    //$scope.auth.login.username ='';
    //$scope.auth.login.password = '';
  }

  $scope.login = function(username, password){
    // initialize
    Main.login({'username': username,'password': password}, function(){ 
        //登入成功
        $scope.data.warning.status='success';
        $scope.data.warning.words = '登入成功';
        
        $state.go('main.index');

        setTimeout(function(){
          $window.location.reload();
        }, 500);
      

      }, function(){
        $scope.data.warning.status = 'fail';
        $scope.data.warning.words = '请检查用户名和密码';
        //登入失败
      }, function(profile){
        $scope.auth.login.username = '';
        $scope.auth.login.password = '';
        $scope.data.person = profile;

      });
  }
  $scope.logout = function() {
    $state.go('main.index');
    Main.logout(function(profile){ 
      $scope.data.person = profile;
      $window.location.reload();
    });
  }
  $scope.backLogin = function() {
    $scope.data.popup = 'login';
  }
  $scope.register_1 = function() {
    $scope.data.popup = 'register_1';
  }
  $scope.register_2 = function(username, code) {
    if(username == ''|| code == '') {
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '请正确填写手机号和验证码';
    } else if(code == $scope.auth.register.returnCode) {
      $scope.data.popup = 'register_2';
    } else if (code != $scope.auth.register.returnCode) {
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '验证码错误';
    } else {

    }

    /*
    if ($scope.verifyCode == code && code != "") {
      $scope.win.register_1 = false;
      $scope.win.register_2 = true;
    } else {
      console.log("not fit");
      $scope.win.notify = true;
    }*/
  }
  $scope.register_3 = function(name, pwd, pwd2, code){
   if(pwd == '') {
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '请正确输入密码';
    } else if(pwd != pwd2) {
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '两次密码输入不一致';
    } else {
      Main.register(name,pwd,code, function(res){
        $scope.data.warning.status = 'sucess';
        $scope.data.warning.words = '恭喜注册成功';
        $scope.auth.login.username = $scope.auth.register.username;
        clearRegister();
        setTimeout(function(){
          $scope.data.popup = 'login';
        }, 500);
      }, function(res){
        $scope.data.warning.status = 'fail';
        $scope.data.warning.words = '注册失败';
      }, function(){
      });
    }
    /*
    Rest.register(name,password,code,function(){
      $scope.win.register_1 = false;
      $scope.win.register_2 = false;
      $scope.win.stub = false;
      $scope.win.main = true;
    });*/
  }

  $scope.askVerifyCode = function(phone) {
    //Main.login('1','1',function(){},function(){},function(){});
    $scope.auth.register.askingVerify = true;
    console.log("ask");
    /*
    promise = $timeout(function(cnt){
      $timeout(
      $scope.user.verifyWords = cnt;
      cnt = cnt-1;
    }, 1000);*/

    //timeout
    var loopVerifyWords = function(cnt) 
    {
      promise = $timeout(function () { loopVerifyWords(cnt); }, 1000); 
      //console.log("timeout "+cnt);
      $scope.auth.register.verifyWords = cnt;
      if (cnt == 0) {
        $scope.auth.register.askingVerify = false;
        $scope.auth.register.verifyWords = "发送验证码";
        $timeout.cancel(promise);
      }     
      cnt = cnt-1;
      //$scope.$on('$ionicView.leave',function(){
      //  $scope.auth.register.askingVerify = false;
      //  $timeout.cancel(promise);
      //}); 
    }; 
    loopVerifyWords(30);

    Main.askVerifyCode(phone, function(code){
      $scope.auth.register.returnCode = code;
      //console.log("tyson"+$scope.verifyCode);
    }, function(){
      // todo
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '请检查网络状况';
    }, function(){

    });
  }

})



.controller('mainIndexCtrl', function($scope, $state, Main) {

  //Rest.getProducts({type:'privatefunds'});
  //Rest.login('customer','password');
  $scope.data.categories = Main.getCategories();

  $scope.goPromotion =  function(id){
    $state.go('promotion.product_detail', {promotionId: id});
  }

})
.controller('mainGuestCtrl', function($scope, Main) {
  $scope.$on('$ionicView.enter',function(){
    $scope.data.popup='login';
  });
  $scope.$on('$ionicView.leave',function(){
   $scope.data.popup='';
  });  
})


.controller('mainCategoriesCtrl', function($scope,$ionicPopover,$stateParams, Main) {
  $scope.data.categories = Main.getCategories();
  $scope.selectedCategory = $stateParams.categoryID;
})

.controller('mainProductsCtrl', function($scope,$ionicPopover,$stateParams,$state, Main) {
  $scope.data = {
    products:[],
    category:{},
    more:true
  };

  var cid = $stateParams.categoryID;

  Main.getProducts({'cid':cid},
  function(cata){
    if (cata) {
      $scope.data.products=cata.products;
      $scope.data.category=cata;
    }
   
  }, function(){
 
  }, function(){

  });

  $scope.loadMore = function(){
    setTimeout(function(){
       Main.getProducts({'cid':cid, 'page':$scope.data.category.page+1}
      , function(cata){
        if(!cata) {
          $scope.data.more=false;
          return;
        }
        $scope.data.products=cata.products;
        $scope.data.category=cata;
      },function(status){
        console.log(status);
        if(status==0) {
          console.log('无网络连接');
          //$scope.data.more=false;
        }
      },function(){
        console.log("infinite scroll stop");
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
     }, 1000);
   
  }

  $scope.doRefresh = function() {
    setTimeout(function(){
      console.log('refresh');
     
      Main.getProducts({
        'cid':cid, 'page':1
        },function(cata){
          if(cata) {
            $scope.data.products=cata.products;
            $scope.data.category=cata;
          }
        },function(){

        },function(){
          console.log("refresh stop");
          $scope.$broadcast('scroll.refreshComplete');
           $scope.data.more=true;
        });
    }, 1000);
  }
  //Rest.getProducts({type:'privatefunds'});


})


.controller('ConsultantMenuCtrl', function($scope, $state, Main, MultipleViewsManager){
  $scope.data = {
    mainMenu: "index",
    subMenu: "",
    productType: Main.getProductType()
  }

  MultipleViewsManager.updatedLeft(function(params) {
    //console.log(params);
    $scope.data.mainMenu = params.main;
    $scope.data.subMenu  = params.sub;
  });

    /////////////
    $scope.selectMenu = function(first, second) {
      $scope.data.mainMenu = first;
      $scope.data.subMenu = second;
      MultipleViewsManager.updateView('main-consultant-toolbox', {main: first, sub: second});
    }
    $scope.showSubMenu = function(main) {
      if($scope.data.mainMenu == main) {
        return true;
      } else {
        return false;
      }
    }
    $scope.highLight = function(first, second) {
      if($scope.data.mainMenu == first && $scope.data.subMenu == second) {
        return true;
      } else {
        return false;
      }
    }
})




.controller('CustomerMenuCtrl', function($scope, $state, Main, MultipleViewsManager){
  $scope.data = {
    mainMenu: "index",
    subMenu: "",
    productType: Main.getProductType()
  }
  //delete $scope.data.productType['alltype'];

  MultipleViewsManager.updatedLeft(function(params) {
    //console.log(params);
    $scope.data.mainMenu = params.main;
    $scope.data.subMenu  = params.sub;
  });

    /////////////
    $scope.selectMenu = function(first, second) {
      $scope.data.mainMenu = first;
      $scope.data.subMenu = second;
      MultipleViewsManager.updateView('main-my-toolbox', {main: first, sub: second});
    }
    $scope.showSubMenu = function(main) {
      if($scope.data.mainMenu == main) {
        return true;
      } else {
        return false;
      }
    }
    $scope.highLight = function(first, second) {
      if($scope.data.mainMenu == first && $scope.data.subMenu == second) {
        return true;
      } else {
        return false;
      }
    }
    
})



.controller('mainConsultantCtrl', function($scope, $state, $timeout, $cordovaCamera, MultipleViewsManager, Main) {

//** 
//** controller data
  $scope.consultant = {
    win: 'index',
    subWin: 'all',

    orders: {},
    bookings: {},
    customers: {},
    pendings: {},
    information: {},
    message:{}
  };

  $scope.data = {
    productType: Main.getProductType(),
    orderState: Main.getOrderState(),
    bookingState: Main.getBookingState(),
    bookings: Main.consultant.getBookings(),
    orders: Main.consultant.getOrders(),


    currentOrderState: 'all',
    currentOrder: null,
    currentBookingState: 'all',
    currentBooking: null
  };

//**
//** initialize
  $scope.data.currentOrder = $scope.data.orders['all'];
  $scope.data.currentBooking = $scope.data.bookings['all'];

  $scope.consultant.information.profile = {
    touxiang: "teImg/ghnr1lef.png" 
  };


//**
//** common function

  $scope.goOrderDetail = function(oid) {
    $state.go('common.order_detail', {orderId: oid});
  };
  $scope.goBookingDetail = function(bid) {
    $state.go('common.booking_detail', {bookingId: bid});
  };
  var refreshData = function() {
    Main.consultant.queryOrders($scope.data.currentOrder, function(data){
    }, function(status){}, function(){});
    Main.consultant.queryBookings($scope.data.currentBooking, function(data){
    }, function(status){}, function(){});
    //console.log($scope.data.currentOrderState);
  };
  $scope.selectOrders = function(param){
    $scope.data.currentOrder = $scope.data.orders[param];
    refreshData();
  };
  $scope.selectBookings =function(param) {
    $scope.data.currentBooking = $scope.data.bookings[param];
    refreshData();
  }
  refreshData();


  $scope.doRefresh = function() {
    refreshData();
    $scope.$broadcast('scroll.refreshComplete');
  };


  MultipleViewsManager.updated(function(params) {
    var first = params.main;
    var second = params.sub;
  
    $scope.consultant.win = first;
    $scope.consultant.subWin = second;

    if($scope.consultant.win == 'orders') {
      $scope.data.currentOrder = $scope.data.orders[second];
      refreshData();
    } else if ($scope.consultant.win == 'bookings') {
      $scope.data.currentBooking = $scope.data.bookings[second];
      refreshData();
    }
  });

  $scope.showContent = function(first, second){
    if ($scope.consultant.win==first && $scope.consultant.subWin==second){
      return true;
    } else {
      return false;
    }
  };

  $scope.selectPage = function(first, second) {            
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {main: first, sub: second});
    
    $scope.consultant.win = first;
    $scope.consultant.subWin = second;
  }



/*
  MultipleViewsManager.updated(function(params) {
    var arr = params.msg.split("-");
    $scope.consultant.win = arr[0];
    $scope.consultant.suffix = arr[1];
  });

  $scope.selectPage = function(item) {            
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {msg: item});
    var arr = item.split("-");
    $scope.consultant.win = arr[0];
  };
  $scope.expand = function(item) {      
    //if(item)      
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {msg: item});
    var arr = item.split("-");
    $scope.consultant.win = arr[0];
    $scope.consultant.suffix = arr[1]; 
  };
  $scope.collapse = function(item) {
    var arr = item.split("-");
    $scope.consultant.win = arr[0];
    $scope.consultant.suffix= 'none'; 
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {msg: arr[0]});
  };
  $scope.isExpand = function(item){
    return item == ($scope.consultant.win+'-'+$scope.consultant.suffix);
  };
  $scope.isCollapse = function(item){
    return !(item == ($scope.consultant.win+'-'+$scope.consultant.suffix));
  };
  */
  $scope.takePhoto=function(){
    var options = {  
      quality: 50,  
      destinationType: Camera.DestinationType.DATA_URL,  
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,  
      allowEdit: false,  
      encodingType: Camera.EncodingType.JPEG,  
      cameraDirection: 1,
      targetWidth: 100,  
      targetHeight: 100,  
      popoverOptions: CameraPopoverOptions,  
      saveToPhotoAlbum: false  
    }
    //console.log("tyson");
    $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.consultant.information.profile.touxiang = "data:image/jpeg;base64," + imageData; 
        //image.src = "data:image/jpeg;base64," + imageData;  
      }, function(err) {  
        // error  
      });  
   }


})
.controller('mainCustomerCtrl', function($scope, $state, $ionicModal, $timeout, $rootScope,
                                        $cordovaCamera, MultipleViewsManager, Main) {
  //**
  //** controller data
  $scope.customer = {
    win: 'index',
    subWin: 'all',

    //orders: 'orders',
    bookings: {},
    orders: {},
    information: {},
    other: {},
  };
  $scope.data = {
    productType: Main.getProductType(),
    orderState: Main.getOrderState(),
    bookingState: Main.getBookingState(),
    bookings: Main.customer.getBookings(),
    orders: Main.customer.getOrders(),


    currentOrderState: 'all',
    currentOrder: null,
    currentBookingState: 'all',
    currentBooking: null
  };


  //**
  //** initialize
  $scope.data.currentOrder = $scope.data.orders['all'];
  $scope.data.currentBooking = $scope.data.bookings['all'];

  $scope.customer.information.profile = {
    touxiang: "teImg/ghnr1lef.png" 
  };
  $scope.customer.other.promotion = {
    stuff: "teImg/ddztjh.png"
  };

  //**
  //** common function
  $scope.goProductDetail = function(oid) {
    $state.go('common.order_detail', {orderId: oid});
  };


  var refreshData = function() {
    Main.customer.queryOrders($scope.data.currentOrder, function(data){
    }, function(status){}, function(){});
    Main.customer.queryBookings($scope.data.currentBooking, function(data){
    }, function(status){}, function(){});


    //console.log($scope.data.currentOrderState);
  };
  $scope.selectOrders = function(param){
    $scope.data.currentOrder = $scope.data.orders[param];
    refreshData();
  };
  $scope.selectBookings =function(param) {
    $scope.data.currentBooking = $scope.data.bookings[param];
    refreshData();
  }
  refreshData();
  
  //**
  //** event listen function
  $rootScope.$on('ChangeWindow', function(event, args){
    MultipleViewsManager.updateViewLeft('main-my-toolbox', {main: args.win, sub: args.subWin});
    $scope.customer.win = args.win;
    $scope.customer.subWin = args.subWin;

    if($scope.customer.win == 'orders') {
      $scope.data.currentOrder = $scope.data.orders['all'];
      refreshData();
    } else if ($scope.customer.win == 'bookings') {
      $scope.data.currentBooking = $scope.data.bookings['all'];
      refreshData();
    }

  });

  /*为了使增加orders或者bookings可以更新
  $scope.$on('$ionicView.enter', function() {
    refreshData();
  });*/

  MultipleViewsManager.updated(function(params) {
    var first = params.main;
    var second = params.sub;
  
    $scope.customer.win = first;
    $scope.customer.subWin = second;

    if($scope.customer.win == 'orders') {
      $scope.data.currentOrder = $scope.data.orders[second];
      refreshData();
    } else if ($scope.customer.win == 'bookings') {
      $scope.data.currentBooking = $scope.data.bookings[second];
      refreshData();
    }
  });

  $scope.showContent = function(first, second){
    if ($scope.customer.win==first && $scope.customer.subWin==second){
      return true;
    } else {
      return false;
    }
  };

  $scope.selectPage = function(first, second) {            
    MultipleViewsManager.updateViewLeft('main-my-toolbox', {main: first, sub: second});
    
    $scope.customer.win = first;
    $scope.customer.subWin = second;
  }
  $scope.doRefresh = function() {
    refreshData();
    $scope.$broadcast('scroll.refreshComplete');
  }


  $scope.takePhoto=function(param){
    var options = {  
      quality: 50,  
      destinationType: Camera.DestinationType.DATA_URL,  
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,  
      allowEdit: false,  
      encodingType: Camera.EncodingType.JPEG,  
      cameraDirection: 1,
      targetWidth: 100,  
      targetHeight: 100,  
      popoverOptions: CameraPopoverOptions,  
      saveToPhotoAlbum: false  
    }
    //console.log("tyson");
    $cordovaCamera.getPicture(options).then(function(imageData) {
        if(param == 'information') {
          $scope.customer.information.profile.touxiang = "data:image/jpeg;base64," + imageData; 
        } else if (param == 'promotion') {
          $scope.customer.other.promotion.stuff = "data:image/jpeg;base64," + imageData; 
        }
        //image.src = "data:image/jpeg;base64," + imageData;  
      }, function(err) {  
        // error  
      });  
   }

});











