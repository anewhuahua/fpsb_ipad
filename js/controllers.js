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

.controller('commonCtrl', function($scope, $stateParams, $ionicHistory, Factory, Main, Notify) {
  $scope.data = {
    warning: {
      status: '',
      words: ''
    },
    popup: ''
  };
  $scope.goBack = function() {
    console.log('goback');
    $ionicHistory.goBack();
  }
  $scope.showProduct = function(product) {
    $scope.data.popup = 'privateFund';
    $scope.data.looking_product = product;
    //console.log("looking product: "+product.id);
    //console.log(product);
  }
  $scope.closeProduct = function() {
    $scope.data.popup = '';
    $scope.data.looking_product = null;
  }

  $scope.closePopup = function(win) {
    if ($scope.data.popup == win) {
      $scope.data.popup = '';
    }
    $scope.data.looking_booking = null;
    $scope.data.order_option = null;
  }

  $scope.orderDialog = function(booking) {
    $scope.data.looking_booking = booking;
    $scope.data.order_option = Factory.newOption(10000, 200000, 10000);
    $scope.data.popup = 'OrderDialog';

  }

  $scope.closeWarning = function(win) {
    $scope.data.warning.status='';

    if ($scope.data.warning.words.indexOf('您的预约已成功提交')>=0) {
      
    } else if ($scope.data.warning.words.indexOf('您的订单已成功提交')>=0) {
      $scope.data.popup = '';  
      //Notify.notify('order');
    } else {
    }
  }

  $scope.addOrder = function(booking) {
    Main.consultant.submitOrder(booking, $scope.data.order_option.quantity, function(data){
      $scope.data.warning.status = 'success';
      $scope.data.warning.words = '您的订单已成功提交!' +
                                       '您的理财师将马上与您联系进行后续服务，请保持电话通畅!';
      //$scope.$broadcast("AddOrder", data);
    }, function(error){
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = error;
    }, function(){
    });
  }


  $scope.acceptBooking = function(booking) {
    Main.consultant.acceptBooking(booking, function(data){
      $scope.data.warning.status= 'success';
      $scope.data.warning.words = '您已接受客户预约，请尽快与客户取得联系!';
      booking.state = 'accepted';
      $scope.$apply();
    }, function(error){
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = error;
    }, function(){});
  }

  $scope.completeBooking = function(booking) {
    Main.consultant.completeBooking(booking, function(data){
      $scope.data.warning.status= 'success';
      $scope.data.warning.words = '预约服务完成!';
      booking.state = 'completed';
      $scope.$apply();
    }, function(error){
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = error;
    }, function(){});
  }

})




.controller('publicfundsCtrl', function($scope, $stateParams, $ionicScrollDelegate, $ionicHistory, Main) {
 
  //console.log($ionicScrollDelegate.$getByHandle('scroll-2').getScrollPosition());
  //$scope.products = {};
  //$scope.products.data = Main.getMockProducts();

  $scope.data = {
    key: 0
  };
  $scope.sortKey = function(key) {
    $scope.data.key = key;
  }
  $scope.loadMore = function(){
    setTimeout(function(){
      $scope.products.data = Main.getMoreMockProducts();
      console.log("infinite scroll stop");
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, 1000);
  };


})

.controller('bookingDetailCtrl', function($scope, $stateParams, Main) {
  
  var bid = $stateParams.bookingId;
  $scope.booking = Main.consultant.getBooking(bid);

  $scope.data = {    
    bookingState: Main.getBookingState(),
    productType: Main.getProductType()
  };



})


.controller('orderMenuCtrl', function($scope, $stateParams, $ionicHistory) {

})




.controller('orderDetailCtrl', function($scope, $stateParams, $ionicActionSheet, $cordovaCamera, $ionicPopup, Main) {
  //console.log('124455');
  var oid = $stateParams.orderId;


  console.log(oid);
  if (Main.getRole() == 'Customer') {
    $scope.data.order = Main.customer.getOrder(oid);
  } else if(Main.getRole() == 'Consultant') {
    $scope.data.order = Main.consultant.getOrder(oid);
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

  $scope.enableCommission =function() {
    if(Main.getRole() == 'Consultant') {
      return true;
    } else {
      return false;
    }
  }


  $scope.choosePicMenu = function() {
    var type = 'gallery';
    var option = {  
      quality: 90,  
      destinationType: Camera.DestinationType.FILE_URI,  
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,  
      allowEdit: false,  
      encodingType: Camera.EncodingType.JPEG,  
      cameraDirection: 1,
      targetWidth: 600,  
      targetHeight: 600,  
      popoverOptions: CameraPopoverOptions,  
      saveToPhotoAlbum: false  
    }

    $ionicActionSheet.show({
        buttons: [
            { text: '拍照' },
            { text: '从相册选择' }
        ],
        titleText: '选择照片',
        cancelText: '取消',
        cancel: function() {
        },
        
        buttonClicked: function(index) {
            if(index == 0){
              option.sourceType = Camera.PictureSourceType.CAMERA;
              //type = 'camera';

            }else if(index == 1){
              option.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

              //type = 'gallery';
            }
　　　　　　　//Camera.getPicture(type)->根据选择的“选取图片”的方式进行选取
            $cordovaCamera.getPicture(option).then(
　　　　　　　　　 //返回一个imageURI，记录了照片的路径
                function (imageURI) {
                    //$scope.me.image = imageURI;
　　　　　　　　　　　 //更新页面上的照片
                    $scope.img = imageURI;
                    $scope.$apply();
                },
                function (err) {
                });
            return true;
        }
    });

    $scope.upload = function() {
      //新建文件上传选项，并设置文件key，name，type
      var options = new FileUploadOptions();
      options.fileKey="ffile";
      options.fileName=$scope.img.substr($scope.img.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";
      //用params保存其他参数，例如昵称，年龄之类
      var params = {};
      params['name'] = 'tyson';
      //把params添加到options的params中
      options.params = params;
      //新建FileTransfer对象
      var ft = new FileTransfer();
      //上传文件
      
      ft.upload(
          $scope.img,
          encodeURI(Main.consultant.getUploadUrl(oid)),//把图片及其他参数发送到这个URL，相当于一个请求，在后台接收图片及其他参数然后处理
          uploadSuccess,
          uploadError,
          options);
      //upload成功的话
      function uploadSuccess(r) {
          var resp = JSON.parse(r.response);
          //console.log(resp);
          if(resp.successful){
      　　　　 //返回前一页面
              //$navHistory.back();
              console.log('success');
              $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '上传成功!'
              });
          }else{
              $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '上传失败!'
              });
          }
      }
      //upload失败的话
      function uploadError(error) {
        console.log(error);
        $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '上传失败!'
              });
      }

    };
  }

})



.controller('mainCtrl', function($scope, $state, $window, $cordovaNetwork, $rootScope, $ionicHistory, $timeout, Main, Notify) {

   $scope.goMainPage = function() {
      window.open('http://biaoweihui.idea-source.net/', '_system');
   }

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
    looking_booking: null,
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

   // login every 10 minutes to avoid session expired.
   setInterval(function(){
     Main.login({}, function(){ 
    }, function(){
    }, function(profile){
      $scope.data.person = profile;
      console.log('tyson');
      //console.log($scope.data.person.role);
    });
    }, 1000*60*10);

  

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

  $scope.showBookingProduct = function(booking) {
    $scope.data.popup = 'privateFund';
    $scope.data.looking_product = booking.product;
    $scope.data.looking_booking = booking;

    $scope.data.product_act_booking = false;
    $scope.data.product_act_order = true;
  } 

  $scope.enableBooking = function() {
    if (!$scope.data.product_act_booking) {
      return false;
    } else {
      if($scope.data.person.role == 'Consultant') {
        return false;
      } else if ($scope.data.person.role == 'Customer'){
        return true;
      }
    }
  }
  $scope.enableOrder = function() {
    if ($scope.data.looking_product.type.toLowerCase() == 'publicfund') {
      return true;
    } else {
      if($scope.data.person.role == 'Consultant') {
       
        return true;
      } else if ($scope.data.person.role == 'Customer'){
        return false;
      }
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
    $scope.data.looking_booking = null;


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

    if ($scope.data.looking_booking) {
        Main.consultant.submitOrder($scope.data.looking_booking, 20000, function(data){
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
        $scope.data.looking_product=null;
        $scope.data.popup = '';
        $scope.data.looking_booking=null;

    } else {
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



.controller('mainIndexCtrl', function($scope, $state,$ionicScrollDelegate, Main) {
  $scope.data.categories = Main.getCategories(0);
  $scope.data.externals = Main.getCategories(1);
  $scope.data.main = 'internal'

  $scope.goPromotion =  function(id){
    $state.go('promotion.product_detail', {promotionId: id});
  }

  $scope.goMainCategory = function(main){
    console.log(main);
    $scope.data.main = main;
    if (main=='internal') {
      setTimeout(function(){$ionicScrollDelegate.$getByHandle('internalScroll').scrollBottom(false);}, 1);
      setTimeout(function(){$ionicScrollDelegate.$getByHandle('internalScroll').scrollTop(true);}, 500);
    } else if (main=='external') {
      setTimeout(function(){$ionicScrollDelegate.$getByHandle('externalScroll').scrollBottom(false);}, 1);
      setTimeout(function(){$ionicScrollDelegate.$getByHandle('externalScroll').scrollTop(true);}, 500);
    }
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
  var parentId = parseInt($stateParams.parentID);
  $scope.selectedCategory = $stateParams.categoryID;

  console.log(parentId);
  $scope.data.categories = Main.getCategories(parentId);
  $scope.data.parentCategory = parentId;

})

.controller('mainProductsCtrl', function($scope,$ionicPopover,$stateParams,$state, Main) {

  var cid = $stateParams.categoryID;
  var parentId = $stateParams.parentID;


  $scope.data = {
    categories: Main.getCategories(parentId),
    parentCategory: parentId,
    more:true
  };


  for(var i = 0; i<$scope.data.categories.length; i++){
    if($scope.data.categories[i].id == cid) {
      $scope.data.category = $scope.data.categories[i];
    }
  }

  Main.getProducts($scope.data.category, function(data){
  }, function(status){}, function(){});

  $scope.loadMore = function(){
    setTimeout(function(){
      var count = $scope.data.category.products.data.length;
      Main.getMoreProducts($scope.data.category, function(data){
      }, function(status){}, function(){
        if (count == $scope.data.category.products.data.length){
          $scope.data.more=false;
        }
        console.log("infinite scroll stop");
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }, 1000);
  };

  $scope.doRefresh = function() {
    setTimeout(function(){
      console.log('refresh');
      Main.getProducts($scope.data.category, function(data){
      }, function(status){}, function(){
        console.log("refresh stop");
        $scope.$broadcast('scroll.refreshComplete');
        $scope.data.more=true;
      });
    }, 1000);
  };
})


.controller('publicFundsListCtrl', function($scope,$stateParams,$state, Main) {
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



.controller('mainConsultantCtrl', function($scope, $rootScope, $state, $timeout, $cordovaCamera, MultipleViewsManager, Main) {

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
    customers: Main.consultant.getCustomers(),

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
  //** event listen function
  $rootScope.$on('ChangeWindow', function(event, args){
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {main: args.win, sub: args.subWin});
    $scope.consultant.win = args.win;
    $scope.consultant.subWin = args.subWin;

    if($scope.consultant.win == 'orders') {
      $scope.data.currentOrder = $scope.data.orders['all'];
      refreshData();
    } else if ($scope.customer.win == 'bookings') {
      $scope.data.currentBooking = $scope.data.bookings['all'];
      refreshData();
    }
  });

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
    Main.consultant.queryCustomers($scope.data.customers, function(data){
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

  //var aaa =  Main.customer.queryMoreBookings($scope.data.currentBooking, function(data){}, function(status){},function(){});


  $scope.customer.information.profile = {
    touxiang: "teImg/ghnr1lef.png" 
  };
  $scope.customer.other.promotion = {
    stuff: "teImg/ddztjh.png"
  };

  //**
  //** common function
  $scope.goOrderDetail = function(oid) {
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
    //$scope.$apply();
    refreshData();
  };
  $scope.selectBookings =function(param) {
    $scope.data.currentBooking = $scope.data.bookings[param];
    //$scope.$apply();
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











