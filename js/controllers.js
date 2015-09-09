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
    console.log(product);
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
  $scope.booking = Main.consultant.getBooking(bid);
  //console.log($scope.booking);
})
.controller('orderMenuCtrl', function($scope, $stateParams, $ionicHistory) {

})
.controller('orderDetailCtrl', function($scope, $stateParams, Main) {
  //console.log('124455');
  var oid = $stateParams.orderId;
  console.log(oid);

  $scope.data.win = 'detail';

  $scope.selectWin = function(item){
    console.log(item);
    $scope.data.win=item;
  }
  //$scope.booking = Main.consultant.getBooking(bid);
  //console.log($scope.booking);
})



.controller('mainCtrl', function($scope, $state, $window, $cordovaNetwork, $rootScope, $ionicHistory, $timeout, Main) {

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
  

  $scope.showProduct = function(product) {
    $scope.data.popup = 'privateFund';
    $scope.data.looking_product = product;
    console.log("looking product: "+product.id);
    console.log(product);
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
    $scope.data.warning.words = '';
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



.controller('mainIndexCtrl', function($scope, $cordovaCamera, Main) {

  //Rest.getProducts({type:'privatefunds'});
  //Rest.login('customer','password');
  $scope.data.categories = Main.getCategories();
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


.controller('ConsultantMenuCtrl', function($scope, $state, MultipleViewsManager){
  $scope.data = {
    selectedItem : "index"
  }
  $scope.selectItem = function(item) {
      MultipleViewsManager.updateView('main-consultant-toolbox', {msg: item});
      $scope.data.selectedItem = item;
  }
  $scope.showItem = function(item){
    var arr = $scope.data.selectedItem.split("-");
    return (arr[0] == item)
  }
  MultipleViewsManager.updatedLeft(function(params) {
    console.log(params);
    $scope.data.selectedItem = params.msg;
  });

})

.controller('mainConsultantCtrl', function($scope, $state, $timeout, $cordovaCamera, MultipleViewsManager, Main) {
  
//** common function
  var refreshData = function() {
    Main.consultant.queryBookings({}, function(data){
    }, function(status){}, function(){});
  }
//**

//** controller data
  $scope.consultant = {
    win: 'index',
    suffix: '',
    bookings: {},
    customers: {},
    pendings: {},
    information: {}
  };
//**

//** initialize
  $scope.consultant.pendings.bookings = Main.consultant.getBookings();
  $scope.consultant.information.profile = {
    touxiang: "teImg/ghnr1lef.png" 
  };
  refreshData();

//**
//** 下拉刷新
  $scope.doRefresh = function() {
    refreshData();
    $scope.$broadcast('scroll.refreshComplete');
  };
//**





  MultipleViewsManager.updated(function(params) {
    var arr = params.msg.split("-");

    $scope.consultant.win = arr[0];
    $scope.consultant.suffix = '';
    for(var i=1;i<arr.length;i++) {
      $scope.consultant.suffix = $scope.consultant.suffix + '-' + arr[i];
    }
  });
  $scope.selectPage = function(item) {            
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {msg: item});
    
    var arr = item.split("-");
    $scope.consultant.win = arr[0];
    $scope.consultant.suffix = '';
    for(var i=1;i<arr.length;i++) {
      $scope.consultant.suffix = $scope.consultant.suffix + '-' + arr[i];
    }
  }
  $scope.expand = function(item) {      
    //if(item)      
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {msg: item});
    var arr = item.split("-");
    $scope.consultant.win = arr[0];
    $scope.consultant.suffix = '';
    for(var i=1;i<arr.length;i++) {
      $scope.consultant.suffix = $scope.consultant.suffix + '-' + arr[i];
    }
  };
  $scope.collapse = function(item) {
    var arr = item.split("-");
    $scope.consultant.win = arr[0];
    $scope.consultant.suffix= ''; 
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {msg: arr[0]});
  };
  $scope.isExpand = function(item){
    return item == ($scope.consultant.win+$scope.consultant.suffix);
  };
  $scope.isCollapse = function(item){
    return !(item == ($scope.consultant.win+$scope.consultant.suffix));
  };


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


.controller('CustomerMenuCtrl', function($scope, $state, MultipleViewsManager){
  $scope.data = {
    selectedItem : "index"
  }
  MultipleViewsManager.updatedLeft(function(params) {
    //console.log(params);
    $scope.data.selectedItem = params.msg;
  });

  $scope.selectItem = function(item) {
      MultipleViewsManager.updateView('main-my-toolbox', {msg: item});
      $scope.data.selectedItem = item;
  }
  $scope.showItem = function(item){
    var arr = $scope.data.selectedItem.split("-");
    return (arr[0] == item)
  }
})


.controller('mainCustomerCtrl', function($scope, $state, $ionicModal, $timeout, $cordovaCamera, MultipleViewsManager, Main) {
  //** common function
  var refreshData = function() {
    Main.customer.queryBookings({}, function(data){
    }, function(status){}, function(){});
    Main.customer.queryOrders({}, function(data){
    }, function(status){}, function(){});
  }
  //**
  //** controller data
  $scope.customer = {
    win: 'index',
    suffix: '',
    //orders: 'orders',
    bookings: {},
    orders: {},
    information: {},
    other: {}
  };
  //**
  //** initialize
  $scope.customer.bookings.data = Main.customer.getBookings();
  $scope.customer.orders.data = Main.customer.getOrders();
  $scope.customer.information.profile = {
    touxiang: "teImg/ghnr1lef.png" 
  };
  $scope.customer.other.promotion = {
    stuff: "teImg/ddztjh.png"
  };
  refreshData();
  //**

  MultipleViewsManager.updated(function(params) {
    var arr = params.msg.split("-");

    $scope.customer.win = arr[0];
    $scope.customer.suffix = '';
    for(var i=1;i<arr.length;i++) {
      $scope.customer.suffix = $scope.customer.suffix + '-' + arr[i];
    }
  });

  $scope.selectPage = function(item) {            
    MultipleViewsManager.updateViewLeft('main-my-toolbox', {msg: item});
    
    var arr = item.split("-");
    $scope.customer.win = arr[0];
    $scope.customer.suffix = '';
    for(var i=1;i<arr.length;i++) {
      $scope.customer.suffix = $scope.customer.suffix + '-' + arr[i];
    }
  }
  $scope.doRefresh = function() {
    refreshData();
    $scope.$broadcast('scroll.refreshComplete');
  }
  $scope.$on("AddBooking", function(event,msg) {
  // nothing to do now
  });
   $scope.$on("AddOrder", function(event,msg) {
  // nothing to do now
  });



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











