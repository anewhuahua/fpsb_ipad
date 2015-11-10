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

.controller('commonCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicHistory, Factory, Main, Notify) {
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

    if(product){
      ret = Main.productGoState(product);

      if (ret.go) {
        $state.go(ret.go, {productId: 2});
      } else {
        $scope.data.popup = 'privateFund';
        $scope.data.looking_product = product;
      }
    }
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
      
    } else if ($scope.data.warning.words.indexOf('您已经成功为客户提交订单')>=0) {
      $scope.data.popup = '';  
      //Notify.notify('order');
    } else {
    }
  }

  $scope.addOrder = function(booking) {
    Main.consultant.submitOrder(booking, $scope.data.order_option.quantity, function(data){
      $scope.data.warning.status = 'success';
      $scope.data.warning.words = '您已经成功为客户提交订单!';
                                       
      //$scope.$broadcast("AddOrder", data);
    }, function(error){
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = error;
    }, function(){
    });
  }

  $scope.completeBooking = function(booking) {
     var confirmPopup = $ionicPopup.confirm({
       title: '接受预约',
       template: '确认接受预约吗?',
       okText: '确认',
       cancelText: '取消'
     });
     confirmPopup.then(function(res) {
       if(res) {
        Main.consultant.completeBooking(booking, function(data){
          $scope.data.warning.status= 'success';
          $scope.data.warning.words = '预约服务完成!';
          booking.state = 'completed';
          $scope.$apply();
        }, function(error){
          $scope.data.warning.status = 'fail';
          $scope.data.warning.words = error;
        }, function(){});
       } else {
       }
     });
  }

})

.controller('publicfundCtrl', function($scope, $state, $stateParams, $ionicScrollDelegate, $ionicHistory, Main){
  $scope.data = {
    index:1
  }
  $scope.isDetail = function(num) {
    return ($scope.data.index==num);
  }
  $scope.showDetail = function(num){
    $scope.data.index = num;
  }


  $scope.dataset = [{ data: [], yaxis: 1, label: 'sin' }]
  $scope.options = {
    legend: {
      container: '#legend',
      show: true
    }
  }

  for (var i = 0; i < 14; i += 0.5) {
    $scope.dataset[0].data.push([i, Math.sin(i)])
  }

})

.controller('publicfundsCtrl', function($scope, $state, $stateParams, $ionicScrollDelegate, $ionicHistory, Main) {
 
  //console.log($ionicScrollDelegate.$getByHandle('scroll-2').getScrollPosition());
  //$scope.products = {};
  //$scope.products.data = Main.getMockProducts();

  $scope.data = {
    key: 0,
    category: Main.getCategory(1),
    more: true
  };
  $scope.sortKey = function(key) {
    $scope.data.key = key;
  }
  $scope.goPublicFundDetail = function() {
    $state.go('common.publicfund1');
  }

  Main.getProducts($scope.data.category, function(data){
  }, function(status){}, function(){});
 
  /*
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
  */
  $scope.doRefresh = function() {
    setTimeout(function(){
      console.log('refresh');
      Main.getProducts($scope.data.category, function(data){
      }, function(status){}, function(){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.data.more=true;
      });
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



.controller('mainCtrl', function($scope, $state, $window, $cordovaNetwork, $ionicPopup, $rootScope, $ionicHistory, $timeout, Main, Notify) {

   $scope.goMainPage = function() {
      window.open('http://biaoweihui.idea-source.net/abstract/', '_system');
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
    person: {
      status:0,
      profile:{}
    },
    popup: '',
    warning: {
      status: '',
      words: ''
    },
    categories: [],
    toolbox:'index',
    looking_product: '',
    looking_booking: null,
    optionOperation: null

  };

  $scope.provinceNames = [
    {key:"",value:""},
    {key:"shanghai",value:"上海"},
    {key:"anhui",value:"安徽"},
    {key:"aomen",value:"澳门"},
    {key:"shaanxi",value:"陕西"},
    {key:"beijing",value:"北京"},
    {key:"chongqing",value:"重庆"},
    {key:"henan",value:"河南"},
    {key:"fujian",value:"福建"},
    {key:"guangdong",value:"广东"},
    {key:"gansu",value:"甘肃"},
    {key:"guangxi",value:"广西"},
    {key:"guizhou",value:"贵州"},
    {key:"hebei",value:"河北"},
    {key:"heilongjiang",value:"黑龙江"},
    {key:"hainan",value:"海南"},
    {key:"jilin",value:"吉林"},
    {key:"jiangsu",value:"江苏"},
    {key:"jiangxi",value:"江西"},
    {key:"liaoning",value:"辽宁"},
    {key:"neimenggu",value:"内蒙古"},
    {key:"ningxia",value:"宁夏"},
    {key:"qinghai",value:"青海"},
    {key:"sichuan",value:"四川"},
    {key:"shandong",value:"山东"},
    {key:"shanxi",value:"山西"},
    {key:"tianjin",value:"天津"},
    {key:"taiwan",value:"台湾"},
    {key:"hubei",value:"湖北"},
    {key:"hunan",value:"湖南"},
    {key:"xianggang",value:"香港"},
    {key:"xinjiang",value:"新疆"},
    {key:"xizang",value:"西藏"},
    {key:"yunnan",value:"云南"},
    {key:"zhejiang",value:"浙江"}
  ];

  Main.login({}, function(){ 
      $scope.data.person.status = 1;
    }, function(){
    }, function(profile){
      $scope.data.person.profile = profile;
      //console.log($scope.data.person.role);
    });

   // login every 10 minutes to avoid session expired.
   setInterval(function(){
     Main.login({}, function(){ 
      $scope.data.person.status = 1;
    }, function(){
    }, function(profile){
      $scope.data.person.profile = profile;
      //console.log($scope.data.person.role);
    });
    }, 1000*60*10);

  $scope.showProduct = function(product) {

    if(product){
      ret = Main.productGoState(product)

      if (ret.go) {
        $state.go(ret.go, {productId: 2});
      } else {
        $scope.data.popup = 'privateFund';
        $scope.data.looking_product = product;
        $scope.data.optionOperation= Main.getOperation(product, $scope.addBooking, $scope.orderDialog, function(){
          $ionicPopup.alert({
            title: '系统提示',
            template: '请先登入'
          });
        });
      }
    }
  }

  $scope.closeProduct = function() {
    $scope.data.popup = '';
    $scope.data.looking_product = null;
  }
  $scope.likeIt = function() {
    if($scope.data.looking_product) {
      console.log(Main.likeIt($scope.data.looking_product));
    }
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


  $scope.orderDialog = function() {
    if ($scope.data.looking_product) {
      //$scope.data.looking_product = null;
      $scope.data.popup = 'OrderDialog';
    }
  }
  $scope.addBooking= function() {
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
      fullname: '',
      password: '',
      password2: '',
      verifyCode: '',
      returnCode: '',
      referral: ''
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
    $scope.auth.register.fullname = '';
    $scope.auth.register.password = '';
    $scope.auth.register.password2 = '';
    $scope.auth.register.referral = '';
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
        $scope.data.person.profile = profile;

      });
  }


  var logout = function() {
    $state.go('main.index');
    Main.logout(function(profile){ 
      $scope.data.person.profile = null;
      $scope.data.person.status = 0;
      $window.location.reload();
    });
  }
  $scope.alertLogout = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: '提醒',
       template: '确认退出登入?',
       okText: '确认',
       cancelText: '取消'
     });
     confirmPopup.then(function(res) {
       if(res) {
         logout();
       } else {
       }
     });
  };
  $scope.logout = function() {
    logout();
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
  $scope.register_3 = function(name, pwd, pwd2, code, referral, fullname){
   if(pwd == '') {
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '请正确输入密码';
    } else if(pwd != pwd2) {
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '两次密码输入不一致';
    } else if (fullname =='') {
      $scope.data.warning.status = 'fail';
      $scope.data.warning.words = '请输入您的姓名';
    } else {
      Main.register(name,pwd,code,referral, fullname, function(res){
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



.controller('mainConsultantCtrl', function($scope, $rootScope, $ionicPopup, $state, $timeout, $ionicScrollDelegate, $cordovaCamera, MultipleViewsManager, Main) {

//** 
//** controller data
  $scope.consultant = {
    win: 'index',
    subWin: 'all',
    updatedProfile: 0,

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
    profile: Main.getProfile(),

    currentOrderState: 'all',
    currentOrder: null,
    currentBookingState: 'all',
    currentBooking: null,

    liked: null,

    update: {
      cpb: 0,
      afp: 0,
      cfp: 0,
      efp: 0,

      province: '',
      email: '',
      address: '',
      imageId: '',
      fullname: '',
      background: '',
      gender: '',
      certificates: 0 
    }
  };


//**
//** initialize
  $scope.data.currentOrder = $scope.data.orders['all'];
  $scope.data.currentBooking = $scope.data.bookings['all'];
  $scope.data.liked = Main.getLiked();


  //**
  //** event listen function
  $rootScope.$on('ChangeWindow', function(event, args){
    MultipleViewsManager.updateViewLeft('main-consultant-toolbox', {main: args.win, sub: args.subWin});
    $scope.consultant.win = args.win;
    $scope.consultant.subWin = args.subWin;

    if($scope.consultant.win == 'orders') {
      $scope.data.currentOrder = $scope.data.orders['all'];
      refreshData();
    } else if ($scope.consultant.win == 'bookings') {
      $scope.data.currentBooking = $scope.data.bookings['all'];
      refreshData();
    }
  });

//**
//** common function
  $scope.updateProfileInformation = function(param) {

    Main.consultant.updateConsultant(param, function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }
      for (var i=0;i<$scope.provinceNames.length;i++) {
        if($scope.provinceNames[i].key == data.province) {
          $scope.data.provinceName =  $scope.provinceNames[i].value;
          break;
        } 
      }
      $ionicPopup.alert({
          title: '提示信息',
          cssClass: 'alert-text',
          template:  '更新资料成功!'
        }).then(function(res){
            $scope.consultant.updatedProfile = 0;
        });
    }, function(status){
      $ionicPopup.alert({
        title: '提示信息',
        cssClass: 'alert-text',
        template:  '更新资料失败!'
      });
    }, function(){
    })
  };

  $scope.updateProfile = function(num){
    $scope.consultant.updatedProfile = num;
  };
  $scope.enableUpdatedProfile = function(num){
    if ($scope.consultant.updatedProfile == num) {
      return true;
    } else {
      return false;
    }
  };
  $scope.cancelUpdateProfile = function(num) {
    if ($scope.consultant.updatedProfile == num) {
      $scope.consultant.updatedProfile = 0;
    }
  };
  $scope.goOrderDetail = function(oid) {
    $state.go('common.order_detail', {orderId: oid});
  };
  $scope.goBookingDetail = function(bid) {
    $state.go('common.booking_detail', {bookingId: bid});
  };

  var refreshData = function() {
     // update profile
    Main.consultant.queryConsultant(function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }

      for (var i=0;i<$scope.provinceNames.length;i++) {
          if($scope.provinceNames[i].key == data.province) {
            $scope.data.provinceName =  $scope.provinceNames[i].value;
             break;
          } 
      }

    },function(status){}, function(){
    });

    Main.consultant.queryOrders($scope.data.currentOrder, function(data){
    }, function(status){}, function(){});
    Main.consultant.queryBookings($scope.data.currentBooking, function(data){
    }, function(status){}, function(){
      $scope.$broadcast('scroll.refreshComplete');    //因为booking比较多
    });

    // get crm
    Main.consultant.queryCustomers($scope.data.customers, function(data){
    }, function(status){}, function(){});
   
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
    setTimeout(function(){$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);}, 500);
  };

  $scope.doRefresh = function() {
    refreshData();
  };

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
.controller('mainCustomerCtrl', function($scope, $state, $ionicPopup, $ionicModal, $ionicScrollDelegate, $timeout, $rootScope,
                                        $cordovaCamera, MultipleViewsManager, Main) {
  //**
  //** controller data
  $scope.customer = {
    win: 'index',
    subWin: 'all',
    updatedProfile: 0,

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
    profile: Main.getProfile(),

    currentOrderState: 'all',
    currentOrder: null,
    currentBookingState: 'all',
    currentBooking: null,

    liked: null,
    refreshing: {bookings:false, orders:false},

    update: {
      province: '',
      email: '',
      address: '',
      imageId: '',
      fullname: '',
      gender: ''
    }
  };


  //**
  //** initialize
  $scope.data.currentOrder = $scope.data.orders['all'];
  $scope.data.currentBooking = $scope.data.bookings['all'];
  $scope.data.liked = Main.getLiked();



  //**
  //** common function

  $scope.updateProfileInformation = function(param) {

    Main.customer.updateCustomer(param, function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }
      for (var i=0;i<$scope.provinceNames.length;i++) {
        if($scope.provinceNames[i].key == data.province) {
          $scope.data.provinceName =  $scope.provinceNames[i].value;
          break;
        } 
      }
      $ionicPopup.alert({
          title: '提示信息',
          cssClass: 'alert-text',
          template:  '更新资料成功!'
        }).then(function(res){
            $scope.consultant.updatedProfile = 0;
        });
    }, function(status){
      $ionicPopup.alert({
        title: '提示信息',
        cssClass: 'alert-text',
        template:  '更新资料失败!'
      });
    }, function(){
    })
  };

  $scope.updateProfile = function(num){
    $scope.customer.updatedProfile = num;
  };
  $scope.enableUpdatedProfile = function(num){
    if ($scope.customer.updatedProfile == num) {
      return true;
    } else {
      return false;
    }
  };
  $scope.cancelUpdateProfile = function(num) {
    if ($scope.customer.updatedProfile == num) {
      $scope.customer.updatedProfile = 0;
    }
  };

  $scope.goOrderDetail = function(oid) {
    $state.go('common.order_detail', {orderId: oid});
  };


  var refreshData = function() {

     // update profile
    Main.customer.queryCustomer(function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }
      for (var i=0;i<$scope.provinceNames.length;i++) {
          if($scope.provinceNames[i].key == data.province) {
            $scope.data.provinceName =  $scope.provinceNames[i].value;
             break;
          } 
      }
    },function(status){}, function(){
    });

    Main.customer.queryOrders($scope.data.currentOrder, function(data){
    }, function(status){}, function(){
    });
    Main.customer.queryBookings($scope.data.currentBooking, function(data){
    }, function(status){}, function(){
      $scope.$broadcast('scroll.refreshComplete');    //因为booking比较多
    });

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

    setTimeout(function(){$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);}, 500);
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

    setTimeout(function(){$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);}, 500);
  }
  $scope.doRefresh = function() {
    refreshData();
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











