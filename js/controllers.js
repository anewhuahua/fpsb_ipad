angular.module('starter.controllers', [])

.filter('genderFilter',function(){
  return function(input){
      if(input === 'male') return '男';
      if(input === 'female') return '女';
    }
})
.filter('provinceFilter',function(){
  var provinceNames = {
  "anhui": "安徽",
  "aomen": "澳门",
  "shaanxi": "陕西",
  "beijing": "北京",
  "chongqing": "重庆",
  "henan": "河南",
  "fujian": "福建",
  "guangdong": "广东",
  "gansu": "甘肃",
  "guangxi": "广西",
  "guizhou": "贵州",
  "hebei": "河北",
  "heilongjiang": "黑龙江",
  "hainan": "海南",
  "jilin": "吉林",
  "jiangsu": "江苏",
  "jiangxi": "江西",
  "liaoning": "辽宁",
  "neimenggu": "内蒙古",
  "ningxia": "宁夏",
  "qinghai": "青海",
  "sichuan": "四川",
  "shandong": "山东",
  "shanghai": "上海",
  "shanxi": "山西",
  "tianjin": "天津",
  "taiwan": "台湾",
  "hubei": "湖北",
  "hunan": "湖南",
  "xianggang": "香港",
  "xinjiang": "新疆",
  "xizang": "西藏",
  "yunnan": "云南",
  "zhejiang": "浙江"
  };
  return function(input){
    return provinceNames[input];
  }
})
.filter('scoreFilter',function(){
  return function(input){
      if(input === 0) {
        return '您还未进行财商测试';
      } 
      if(input == null) {
        return '您还未进行财商测试';
      }
      return input;
  }
})
.filter('certImageFilter',function(){
  return function(input){
      if(input == 'cpb') {
        return 'teImg/zslog.jpg';
      } 
      if(input == 'afp') {
        return 'teImg/zslog2.jpg';
      }
      if (input == 'cfp'){
        return 'teImg/zslog3.jpg';
      }
      if (input == 'efp'){
        return 'teImg/zslog4.jpg';
      }
  }
})
.filter('imageFilter',function(Main){
  return function(input){
      return Main.queryUploadAccountUrl()+'/'+input;
  }
})
.filter('commissionStateFilter',function(){
  return function(input){
    if (input.state=='create') {
      return '未申请'
    } else if (input.state=='withdraw') {
      return '已申请'
    } else if (input.state=='payoff') {
      return '已返现'
    } else if (input.state=='rejected') {
      return '提现驳回'
    }
  }
})
.filter('imageCustomerFilter',function(Main){
  return function(input){
      if (input.imageId==null || input.imageId=='') {
        return 'teImg/ghnr1lef.png';
      }
      return Main.consultant.queryCustomerProfileUrl(input.id, input.imageId);
  }
})
.filter('imageConsultantFilter',function(Main){
  return function(input){
      if (input.imageId==null || input.imageId=='') {
        return 'teImg/ghnr1lef.png';
      }
      return Main.customer.queryConsultantProfileUrl(input.id, input.imageId);
  }
})
.filter('productImageFilter',function(Main){
  return function(input){
      return Main.getProductImageUrl(input.id, input.imageId);
  }
})
.filter('imageMsgFilter',function(){
  return function(input){
      if (input.read==true) {
        return 'teImg/grrexzimg2.png';
      } else {
        return 'teImg/grrexzimg1.png';
      }
  }
})
.filter('managerNameFilter',function(Main){
  return function(input){
      var o = JSON.parse(input);
      var str = "";
      console.log(o);
      for (var i = 0; i<o.length;i++) {
        str = str + o[i].managerName + " ";
      }
      return str;
  }
})

.controller('customersCtrl', function($scope, $ionicSideMenuDelegate,$timeout) {
  
  //$scope.$on('$ionicView.enter', function() {
     // Code you want executed every time view is opened
     //console.log('Opened!')

    // $ionicSideMenuDelegate.toggleRight();
  //})
  //$timeout(function (){
   
  //});
})

.controller('promotionDetailCtrl', function($scope, $stateParams, $state,$ionicPopup, Main, $window){
  console.log($stateParams.productId);
  $scope.productId = $stateParams.productId;
  $scope.product = {};
  //$scope.data = {};

  $scope.openPdf = function(pdf) {
    console.log(pdf);
    $window.open(pdf, 'location=yes');
  }
  var addBooking= function() {
    // todo quantity
      Main.customer.addBooking($scope.productId, function(data){
        $ionicPopup.alert({
          title: '系统提示',
          template: '您的预约已成功提交!' +
                    '您的理财师将马上与您联系，请保持电话通畅!'
        }).then(function(res){
          Notify.notify('booking');
        });
        //console.log("tyson");
      }, function(error){
        $ionicPopup.alert({
          title: '系统提示',
          template: '您的预约未成功!'
        });
      }, function(){
      });
  }  

  Main.queryProductDetail($scope.productId, function(data){
    $scope.product = data;
    $scope.data.looking_product = $scope.product;
    $scope.data.optionOperation = Main.getOperation($scope.product, addBooking, $scope.orderDialog, function(){
      $ionicPopup.alert({
        title: '系统提示',
        template: '请先登入'
      });
    });
  }, function(status){}, function(){})


})

.controller('examCtrl', function($scope, $ionicHistory) {
  $scope.win = {
    result: false
  };

  $scope.data = {};

  $scope.goBack = function() {
    console.log('goback');
    $ionicHistory.goBack();
  }
})

.controller('examCustomerCtrl', function($scope, Main, $stateParams, $ionicPopup) {

  $scope.$on("$ionicView.enter", function(){
    $scope.win.result = false;
  });

  $scope.showResult = function() {
    $scope.win.result = true;
  }

  $scope.riskTest = {
    data: {},
    answer: {
      id:'',
      data:[]
    }
  };

  ///////////
  ///////////
  $scope.submit = function() {
    if ($scope.riskTest.answer.id=='') {
      $ionicPopup.alert({
            title: '提示信息',
            cssClass: 'alert-text',
            template:  '提交测试失败!'
      });
      return;
    }

    for(var i = 0;i<$scope.riskTest.data.questions.length; i++) {
      $scope.riskTest.answer.data[i]= {
        questionId: $scope.riskTest.data.questions[i].id, 
        optionId: $scope.riskTest.data.questions[i].answer
      }
    }

    Main.customer.submitRiskTest($scope.riskTest.answer.id, $scope.riskTest.answer.data, function(data){
      $scope.data.examResult = data;
      $scope.win.result = true;
    }, function(status){
      $ionicPopup.alert({
            title: '提示信息',
            cssClass: 'alert-text',
            template:  status
      });
    }, function(){});
  }

  $scope.reset =  function() {
    for (var i=0; i<$scope.riskTest.data.questions.length; i++) {
      $scope.riskTest.data.questions[i].answer = $scope.riskTest.data.questions[i].options[0].id;
    }
  }

  ///////////
  ///////////
  var suite = $stateParams.suite;
  console.log(suite);

  Main.customer.getRiskTest(suite, function(data){
    $scope.riskTest.data = data;
    $scope.riskTest.answer.id = data.id;

    for (var i=0; i<$scope.riskTest.data.questions.length; i++) {
      $scope.riskTest.data.questions[i].answer = $scope.riskTest.data.questions[i].options[0].id;
    }

  }, function(status){}, function(){});

})


.controller('commonCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicHistory, Factory, Main, Notify) {
  $scope.data = {
    warning: {
      status: '',
      words: ''
    },
    popup: '',
    looking_product_tab: 'main',
    looking_product: ''
  };

  $scope.goBack = function() {
    console.log('goback');
    $ionicHistory.goBack();
  }

  $scope.showProductTab = function(tab) {
    $scope.data.looking_product_tab = tab;
  }

  $scope.data.commissionCtrl = Main.getCommissionCtrl();



  $scope.showProduct = function(product) {
    $scope.data.looking_product_tab = 'main';

    if(product){
      ret = Main.productGoState(product);

      if (ret.go) {
        if (product.type=='PublicFund') {
          $state.go(ret.go, {productId: product.id, fundNo: product.partnerFundId});
        } else {
          $state.go(ret.go, {productId: product.id});
        }
      } else {
        Main.isLikedProduct(product.id, function(data){
          if(data.length>0) {
            $scope.data.currentLiked = true;
          } else {
            $scope.data.currentLiked = false;
          }
          
        }, function(status){
          $scope.data.currentLiked = false;
        }, function(){});

        $scope.data.popup = 'privateFund';
        $scope.data.looking_product = product;
      }
    }
  }


  $scope.closeProduct = function() {
    $scope.data.popup = '';
    $scope.data.looking_product = null;
    $scope.data.currentLiked = false;
  }

  $scope.closePopup = function(win) {
    if ($scope.data.popup == win) {
      $scope.data.popup = '';
    }
    $scope.data.looking_booking = null;
    $scope.data.order_option = null;
  }

  $scope.orderDialog = function() {
    if ($scope.data.looking_product) {
      //$scope.data.looking_product = null;
      $scope.data.order_option = Factory.newOption(10000, 20000000, 10000);
      $scope.data.popup = 'OrderDialog';
    }
  }

  $scope.bookingOrderDialog = function(booking) {
    $scope.data.looking_booking = booking;
    $scope.data.order_option = Factory.newOption(10000, 20000000, 10000);
    $scope.data.popup = 'BookingOrderDialog';
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
    console.log('addOrder');
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


  $scope.addConsultantOrder = function(product) {
    console.log('addConsultantOrder');
    var role = Main.getRole();
    if(role=='Guest') {
      $ionicPopup.alert({
        title: '系统提示',
        template: '请先登入'
      });
      return;
    } else if(role == 'Consultant') {  
    // only for consultant to order directly.
      if($scope.data.looking_product) {
        //console.log('booking add');
        Main.customer.submitOrder($scope.data.looking_product.id, $scope.data.order_option.quantity,  function(data){
          $scope.data.warning.status = 'success';
          $scope.data.warning.words = '您的订单已成功提交!';
          $scope.$broadcast("AddOrder", data);
          //console.log(data);
          //console.log("tyson");
        }, function(error){
          $scope.data.warning.status = 'fail';
          $scope.data.warning.words = error;
        }, function(){
        });
      } 
    }
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
          Notify.refreshMenu();
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

.controller('commonServiceCtrl', function($scope, $state, $ionicPopup, $stateParams, $ionicScrollDelegate, 
                    $ionicHistory, Main, Notify, SecurePopup){
  var cid = $stateParams.categoryId;
  var pid = $stateParams.productId;

  Main.isLikedProduct(pid, function(data){
          if(data.length>0) {
            $scope.currentLiked = true;
          } else {
            $scope.currentLiked = false;
          }
          
        }, function(status){
          $scope.currentLiked = false;
        }, function(){});

  Main.queryProductDetail(pid, function(data){
    $scope.product = data;
    $scope.data.looking_product = $scope.product;
    $scope.data.optionOperation = Main.getOperation($scope.product, addBooking, $scope.orderDialog, function(){
      $ionicPopup.alert({
        title: '系统提示',
        template: '请先登入'
      });
    });
  }, function(status){}, function(){})

  //$scope.product = Main.getProductDetail(cid, pid);

  $scope.likeIt = function(product) {
      if(Main.tryLock()) {
        return;
      } else {
        Main.getLock();
      }

      if (Main.getRole() == 'Guest') {
         $ionicPopup.alert({
                    title: '提示信息',
                    cssClass: 'alert-text',
                    template:  '请先登入!'
                }).then(function(data){Main.putLock();});
         return;
      }

      Main.likeIt(product, function(data){
          $scope.currentLiked = true;
          var myPopup1 = $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '收藏成功!'
              }).then(function(data){Main.putLock();});


          /*
          var alertPopup = SecurePopup.show('alert', {
             title: '提示信息',
             cssClass: 'alert-text',
             template:  '收藏成功!'
           });*/

      }, function(status){
        $scope.currentLiked = false;
          var myPopup2 = $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '收藏失败!'
              }).then(function(data){Main.putLock();});
      }, function(){});
  }
  

  var addBooking= function() {
    // todo quantity
      Main.customer.addBooking(pid, function(data){
        $ionicPopup.alert({
          title: '系统提示',
          template: '您的预约已成功提交!' +
                    '您的理财师将马上与您联系，请保持电话通畅!'
        }).then(function(res){
          Notify.notify('booking');
        });
        //console.log("tyson");
      }, function(error){
        $ionicPopup.alert({
          title: '系统提示',
          template: '您的预约未成功!'
        });
      }, function(){
      });
    }  

  $scope.data.commissionCtrl = Main.getCommissionCtrl();
})


.controller('commonBuyCtrl', function($scope, $state, $stateParams, $timeout, $ionicPopup, $ionicScrollDelegate, $ionicHistory, Main){
  $scope.data = {
    phase: 'verify',
    fullname: '',
    identity: '',
    pwd: '',
    pwd2: '',
    mobile: '',
    email: '11@baidu.com',

    pwd3: '',

    productId: '',
    fundNo: '',

    bindingBankCards: [],
    validBanks: [],

    bankName:'',
    bankId:'',
    bankCardNo: '',
    buyAmount: 0,

    applyNo: '',
    token: '',
    verifyCode: '',
    verifyCodeWarn: '收取验证码',
    verifyCodeConfirm: '',
    askingVerifyCode: false,
    initiated: false,

    product: {}
  }

  $scope.data.productId = $stateParams.productId;
  $scope.data.fundNo = $stateParams.fundNo;
  $scope.data.product.pid = $scope.data.fundNo;
  Main.getPublicFundDetail($scope.data.product, function(data){}, function(status){}, function(){});


  $scope.$on("$ionicView.enter", function(){
    $scope.data.phase = 'verify';
    $scope.data.initiated = false;
  });


  if (Main.getRole() == 'Customer') {
      Main.customer.queryCustomer(function(data){
        $scope.data.mobile = data.phone;
        $scope.data.email = data.email;
        //console.log(data);
      },function(status){}, function(){
      });
  } else if (Main.getRole() == 'Consultant') {
     Main.consultant.queryConsultant(function(data){
        $scope.data.mobile = data.phone;
        $scope.data.email = data.email;
        //console.log(data);
      },function(status){}, function(){
      });
  }
  

  $scope.verify = function() {
    if($scope.data.fullname == '' || $scope.data.identity == '') {
      $ionicPopup.alert({
          title: '提示信息',
            cssClass: 'alert-text',
            template:  '请输入有效身份信息!'
        });

      return;
    } 
    Main.buy.queryTransAccount($scope.data.fullname, $scope.data.identity, function(data){
      //console.log('tyson111111');
      console.log(data);
      if(data==null) {
        $scope.data.phase = 'register';

      } else {   // already registered

        if (data.authorized) {
          Main.buy.queryBankBinding(data.id, function(data1){
            if(data1) {
              // not bond bank yet
              Main.buy.queryValidBanks(data.id, function(data2){
                $scope.data.validBanks = data2;
              }, function(status2){}, function(){});

              $scope.data.phase = 'bank';
            } else {
              // have bond bank
              Main.buy.queryBindingBanks(data.id, function(data2){
                $scope.data.bindingBankCards =  data2;
              }, function(status2){}, function(){});
              $scope.data.phase = 'buy';
            }
          }, function(status1){}, function(){});

        } else {
          var confirmPopup = $ionicPopup.show({
            title: '提醒',
            scope: $scope,
            template: '<input type="password" ng-model="data.pwd3" placeholder="请输入长量交易密码进行授权"/>',
            buttons: [
             { text: '确认', 
               onTap: function(e) {
                 return 'ok';
               }
             },
             {
              text: '取消',
              onTap: function(e) {
                return 'cancel';
              }
             }]
          });
          confirmPopup.then(function(res) {
            if (res == 'ok') {

            } else if (res == 'cancel') {
              return;
            }

            console.log('authorize');
            console.log($scope.data.pwd3);

            if ($scope.data.pwd3 == '') {
              $ionicPopup.alert({
                    title: '提示信息',
                    cssClass: 'alert-text',
                    template:  '请正确输入密码'
              });
              return;
            }


            Main.buy.authorizeTransAccount($scope.data.pwd3, 
              function(data3){

                Main.buy.queryBindingBanks(data.id, function(data4){
                  $scope.data.bindingBankCards =  data4;
                }, function(status4){}, function(){});
                
                $scope.data.phase = 'buy';
                console.log('go to buy');
              }, function(status3){
                $ionicPopup.alert({
                    title: '提示信息',
                    cssClass: 'alert-text',
                    template:  status3
                });
              }, function(){});

          });

        }
      }

    }, function(status){
      $ionicPopup.alert({
          title: '提示信息',
          cssClass: 'alert-text',
          template:  status
      });
    }, function(){

    }); 
    console.log('verify');
  }

  $scope.register = function() {
    Main.buy.createTransAccount($scope.data.fullname, $scope.data.identity, 
                                    $scope.data.pwd, $scope.data.email, $scope.data.mobile, 
      function(data){
        Main.buy.queryValidBanks(data.id, function(data1){
          $scope.data.validBanks = data1;
        }, function(status1){}, function(){});
        $scope.data.phase = 'bank';
      }, function(status){
        $ionicPopup.alert({
            title: '提示信息',
            cssClass: 'alert-text',
            template:  status
        });
      }, function(){});
  }
 

  $scope.queryBindingBanks = function() {
    Main.buy.queryBindingBanks(function(data){
     $scope.data.bindingBankCards = data;
    }, function(status){}, function(){});
  }

  $scope.initiateBankBinding = function() {
    if ($scope.data.bankId == "" || $scope.data.bankCardNo == "") {
      $ionicPopup.alert({
          title: '提示信息',
          cssClass: 'alert-text',
          template:  '请选择银行和正确填写卡号!'
      });
      return;
    }

    for (var i = 0; i < $scope.data.validBanks.length; i++) {
      if ($scope.data.validBanks[i].bank_id == $scope.data.bankId) {
        $scope.data.bankName = $scope.data.validBanks[i].bank_name;
        break;
      }
    }

    $scope.data.askingVerifyCode = true;
    var loopVerifyWords = function(cnt) 
    {
      promise = $timeout(function () { loopVerifyWords(cnt); }, 1000); 
      //console.log("timeout "+cnt);
      $scope.data.verifyCodeWarn = cnt;
      if (cnt == 0) {
        $scope.data.askingVerifyCode = false;
        $scope.data.verifyCodeWarn = "收取验证码";
        $timeout.cancel(promise);
      }     
      cnt = cnt-1;
    }; 
    loopVerifyWords(30);
    
    Main.buy.initiateBankBinding($scope.data.bankId, $scope.data.bankName, $scope.data.bankCardNo, function(data){
      $scope.data.applyNo = data.apply_no;
      $scope.data.token   = data.token;
      $scope.data.initiated = true;
    }, function(status){
      $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  status
        });
    }, function(){});
  }

  $scope.confirmBankBinding = function() {
    Main.buy.confirmBankBinding($scope.data.token,  $scope.data.verifyCodeConfirm, $scope.data.applyNo,
                                $scope.data.bankId, $scope.data.bankName, $scope.data.bankCardNo, 
    function(data){
      Main.buy.queryBindingBanks('magic', function(data2){
        $scope.data.bindingBankCards =  data2;
      }, function(status2){}, function(){});
      $scope.data.phase = 'buy';
    }, function(status){
      $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  status
      });
    }, function(){

    });
  }

  var pay = function() {
    Main.customer.submitOrder($scope.data.productId, $scope.data.buyAmount, function(data1){
        Main.buy.purchasePublicFund($scope.data.fundNo, $scope.data.bankCardNo, $scope.data.buyAmount,
          function(data){
            $ionicPopup.alert({
                  title:    '提示信息',
                  cssClass: 'alert-text',
                  template:  '购买成功'
            }).then(function(){
              Main.putLock();
              $ionicHistory.goBack();
            });
          }, function(status){
            $ionicPopup.alert({
                  title:    '提示信息',
                  cssClass: 'alert-text',
                  template:  status
            }).then(function(data){Main.putLock()});
          }, function(){
            Main.putLock();
          });
      }, function(error1){
        $ionicPopup.alert({
            title:    '购买失败',
            cssClass: 'alert-text',
            template:  error1
        }).then(function(data){Main.putLock()});
      }, function(){
        Main.putLock();
    });   
  }

  $scope.purchase = function() {

    if(Main.tryLock()) {
      return;
    } else {
      Main.getLock();
    }

    if (isNaN(parseInt($scope.data.buyAmount,10))) {
      $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  '请输入正确金额'
      }).then(function(data){Main.putLock()});
      return;
    }

    if (Main.buy.getBuyRiskLevel()==null) {
      $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  '您必须先参加长量基金理财评测'
      }).then(function(){
        Main.putLock();
        $state.go('exam.customer', {suite: 'cljj'});
      });
      return;
    }

    // $scope.data.product
    // 低风险，较低风险，中等风险，较高风险，高风险
    // 1004            1005             1006
    riskLevel = parseInt($scope.data.product.data.riskLevel);
    //console.log($scope.data.product);
    //console.log(riskLevel);
    currRiskLevel = parseInt(Main.buy.getBuyRiskLevel());
    console.log(currRiskLevel);
    
    if (currRiskLevel == 1004 && riskLevel>1) {
      $ionicPopup.confirm({
       title: '提醒',
       template: '确认购买高风险产品?',
       okText: '确认',
       cancelText: '取消'
      }).then(function(res){
        if (res) {
          pay();
        } else {
          Main.putLock();
        }
      });
      return;
    } else if(currRiskLevel == 1005 && riskLevel>3) {
      $ionicPopup.confirm({
       title: '提醒',
       template: '确认购买高风险产品?',
       okText: '确认',
       cancelText: '取消'
      }).then(function(res){
        if (res){
          pay();
        } else {
          Main.putLock();
        }
      });
      return;
    } else {
      pay();
    }
    
  }

  $scope.goPhase = function(p) {
    $scope.data.phase = p;
  } 

})


.controller('commonRedeemCtrl', function($scope, $state, $stateParams, $timeout, $ionicPopup, $ionicScrollDelegate, $ionicHistory, Main){
  $scope.data = {
    phase: 'verify',
    fullname: '',
    identity: '',

   
    bindingBankCards: [],

    bankName:'',
    bankId:'',
    bankCardNo: '',
    redeemShare: 0,

    fundNo: '',
    order: {}
  }

  $scope.data.orderId = $stateParams.orderId;
  $scope.data.fundNo  = $stateParams.fundNo;
  //$scope.data.product.pid = $scope.data.fundNo;
  Main.customer.queryOrderDetail($scope.data.orderId, function(data){
    $scope.data.order = data;
  }, function(status){}, function(){});


  $scope.$on("$ionicView.enter", function(){
    $scope.data.phase = 'verify';
  });



  $scope.verify = function() {
    if($scope.data.fullname == '' || $scope.data.identity == '') {
      $ionicPopup.alert({
          title: '提示信息',
            cssClass: 'alert-text',
            template:  '请输入有效身份信息!'
        });

      return;
    } 
    Main.buy.queryTransAccount($scope.data.fullname, $scope.data.identity, function(data){
      console.log(data);
      if(data==null) {  // not registered, not happen here
        $ionicPopup.alert({
          title: '提示信息',
            cssClass: 'alert-text',
            template:  '请输入有效身份信息!'
        });
      } else {   // already registered
        if (data.authorized) {
          Main.buy.queryBankBinding(data.id, function(data1){
            if(data1) { // not happen here
              // not bond bank yet
              /*
              Main.buy.queryValidBanks(data.id, function(data2){
                $scope.data.validBanks = data2;
              }, function(status2){}, function(){});
              $scope.data.phase = 'bank';
              */
            } else {
              // have bond bank
              Main.buy.queryBindingBanks(data.id, function(data2){
                $scope.data.bindingBankCards =  data2;
              }, function(status2){}, function(){});
              $scope.data.phase = 'redeem';
            }
          }, function(status1){}, function(){});

        } else {  // not happen here
          $ionicPopup.alert({
            title: '提示信息',
            cssClass: 'alert-text',
            template:  '账号未授权'
          });
          
        }
      }

    }, function(status){
      $ionicPopup.alert({
          title: '提示信息',
          cssClass: 'alert-text',
          template:  status
      });
    }, function(){

    }); 
    console.log('verify');
  }


  $scope.queryBindingBanks = function() {
    Main.buy.queryBindingBanks(function(data){
     $scope.data.bindingBankCards = data;
    }, function(status){}, function(){});
  }

  $scope.redeem = function() {
    if(Main.tryLock()) {
      return;
    } else {
      Main.getLock();
    }

    if (isNaN(parseInt($scope.data.redeemShare,10))) {
      $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  '请输入正确金额'
      }).then(function(data){Main.putLock();});
      return;
    }

    share = parseInt($scope.data.redeemShare,10);
    maximum = parseInt($scope.data.order.extra.usableShare);
    console.log($scope.data.order.extra.usableShare);
    console.log($scope.data.order);

    if (share > maximum) {
      $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  '赎回金额必须 >0, <=' +$scope.data.order.extra.usableShare
      }).then(function(data){Main.putLock();});
      return;
    }
    Main.customer.submitOrder($scope.data.order.product.id, '-'+$scope.data.redeemShare, function(data1){
      Main.buy.redeemPublicFund($scope.data.fundNo, $scope.data.bankCardNo, $scope.data.redeemShare,
        function(data){
          $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  '赎回成功'
          }).then(function(){
            Main.putLock();
            $ionicHistory.goBack();
          });
        }, function(status){
          $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  status
          }).then(function(data){Main.putLock();});
        }, function(){
          Main.putLock();
        });
    }, function(status1){
        $ionicPopup.alert({
            title:    '提示信息',
            cssClass: 'alert-text',
            template:  status1
          }).then(function(data){Main.putLock();});
    }, function(){
      Main.putLock();
    });

  }

  $scope.goPhase = function(p) {
    $scope.data.phase = p;
  } 

})




.controller('publicfundCtrl', function($scope, $state, $stateParams, $ionicScrollDelegate, $ionicHistory, $ionicPopup, Main){
  $scope.data = {
    index:1,
    product: {
      pid:  null,
      data: {}
    }
  }
  $scope.isDetail = function(num) {
    return ($scope.data.index==num);
  }
  $scope.showDetail = function(num){
    $scope.data.index = num;
  }

  $scope.likeIt = function(product) {
      if(Main.tryLock()) {
        return;
      } else {
        Main.getLock();
      }

      if (Main.getRole() == 'Guest') {
         $ionicPopup.alert({
                    title: '提示信息',
                    cssClass: 'alert-text',
                    template:  '请先登入!'
                }).then(function(data){Main.putLock();});
         return;
      }
      product.id = $scope.productId;
      Main.likeIt(product, function(data){
          $scope.currentLiked = true;
          $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '收藏成功!'
              }).then(function(data){Main.putLock();});
      }, function(status){
        $scope.currentLiked = false;
          $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '收藏失败!'
              }).then(function(data){Main.putLock();});
      }, function(){});
  }


  $scope.data.product.pid = $stateParams.fundNo;
  $scope.productId = $stateParams.productId;

    Main.isLikedProduct($scope.productId, function(data){
          if(data.length>0) {
            $scope.currentLiked = true;
          } else {
            $scope.currentLiked = false;
          }
          
        }, function(status){
          $scope.currentLiked = false;
        }, function(){});

  Main.getPublicFundDetail($scope.data.product, function(data){}, function(status){}, function(){});


  $scope.buy = function(p, f) {
    if (Main.getRole() == 'Guest') {
      $ionicPopup.alert({
                  title: '提示',
                  cssClass: 'alert-text',
                  template:  '请先登入!'
      });
      return;
    } else {
      $state.go('common.buy', {productId:p, fundNo:f});
    }
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

.controller('publicfundsCtrl', function($scope, $state, $stateParams, $ionicScrollDelegate, $ionicHistory, $ionicPopup, Main) {
 
  //console.log($ionicScrollDelegate.$getByHandle('scroll-2').getScrollPosition());
  //$scope.products = {};
  //$scope.products.data = Main.getMockProducts();
  var param = {};
  $scope.data = {
    currentSubType: 'all',
    subTypes: [
      {key:'all', name:'全部'}, 
      {key:'stock',  name:'股票型'}, 
      {key:'mixed',  name:'混合型'}, 
      {key:'bond',  name:'债券型'}, 
      {key:'money',  name:'货币型'}, 
      /*
      {key:'xx4',  name:'指数型'}, 
      {key:'xx5',  name:'保本型'}, 
      {key:'xx6',  name:'ETF型'}, 
      {key:'xx7',  name:'LOF型'},
      */ 
      {key:'qd',  name:'QDII型'}
      /*{key:'xx9',  name:'分级型'}*/
    ],
    key: 0,
    category: Main.getCategory(1),
    more: true
  };

  $scope.showSubType = function(key) {
    $scope.data.currentSubType = key;

    if($scope.data.key == 1) {  //近1周
      param = {sortby: 'weekRate', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if ($scope.data.key == 2) { //近1月
      param = {sortby: 'monRate1', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if ($scope.data.key == 3) { //近3月
      param = {sortby: 'monRate3', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if ($scope.data.key == 4) { // 今年来
      param = {sortby: 'yearRate0', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if ($scope.data.key == 5) { // 近1年
      param = {sortby: 'yearRate1', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if ($scope.data.key == 6) { // 近3年
      param = {sortby: 'yearRate3', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if ($scope.data.key == 7) { // 整体收益
      param = {sortby: 'sumRate', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if ($scope.data.key == 8) { // 单位净值
      param = {sortby: 'Nav', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else {
      param = {subtype: key};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    }
  }

  $scope.sortKey = function(key) {
    $scope.data.key = key;

    if(key == 1) {  //近1周
      param = {sortby: 'weekRate', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if (key == 2) { //近1月
      param = {sortby: 'monRate1', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if (key == 3) { //近3月
      param = {sortby: 'monRate3', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if (key == 4) { // 今年来
      param = {sortby: 'yearRate0', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if (key == 5) { // 近1年
      param = {sortby: 'yearRate1', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if (key == 6) { // 近3年
      param = {sortby: 'yearRate3', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if (key == 7) { // 整体收益
      param = {sortby: 'sumRate', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } else if (key == 8) { // 单位净值
      param = {sortby: 'Nav', sort: 'desc', subtype: $scope.data.currentSubType};
      Main.sortProducts($scope.data.category, param,
        function(data){}, function(status){}, function(){});
    } 

  }
  $scope.goPublicFundDetail = function(p, f) {
    $state.go('common.publicfund1', {productId:p, fundNo:f});
  }
 
  $scope.buy = function(p, f) {
    if (Main.getRole() == 'Guest') {
      $ionicPopup.alert({
                  title: '提示',
                  cssClass: 'alert-text',
                  template:  '请先登入!'
      });
      return;
    } else {
      $state.go('common.buy', {productId:p, fundNo:f});
    }
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
      /*
      Main.getProducts($scope.data.category, function(data){
      }, function(status){}, function(){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.data.more=true;
      });
      */

      if($scope.data.key == 1) {  //近1周
        param = {sortby: 'weekRate', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 2) { //近1月
        param = {sortby: 'monRate1', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 3) { //近3月
        param = {sortby: 'monRate3', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 4) { // 今年来
        param = {sortby: 'yearRate0', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 5) { // 近1年
        param = {sortby: 'yearRate1', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 6) { // 近3年
        param = {sortby: 'yearRate3', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 7) { // 整体收益
        param = {sortby: 'sumRate', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 8) { // 单位净值
        param = {sortby: 'Nav', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else {
        param = {subtype: $scope.data.currentSubType};
        Main.sortProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      }

    }, 1000);
  };


  $scope.loadMore = function(){
    setTimeout(function(){
      var count = $scope.data.category.products.data.length;

      /*
      Main.getMoreProducts($scope.data.category, function(data){
         if (count+data.length == count){
            $scope.data.more=false;
          }
          console.log("infinite scroll stop");
          $scope.$broadcast('scroll.infiniteScrollComplete');

      }, function(status){}, function(){
      });*/


      if($scope.data.key == 1) {  //近1周
        param = {sortby: 'weekRate', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');

          }, function(status){}, function(){
            
          });
      } else if ($scope.data.key == 2) { //近1月
        param = {sortby: 'monRate1', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(status){}, function(){
    
          });
      } else if ($scope.data.key == 3) { //近3月
        param = {sortby: 'monRate3', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(status){}, function(){
           
          });
      } else if ($scope.data.key == 4) { // 今年来
        param = {sortby: 'yearRate0', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){}, function(status){}, function(){
            $scope.$broadcast('scroll.refreshComplete');
            $scope.data.more=true;
          });
      } else if ($scope.data.key == 5) { // 近1年
        param = {sortby: 'yearRate1', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(status){}, function(){
            
          });
      } else if ($scope.data.key == 6) { // 近3年
        param = {sortby: 'yearRate3', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(status){}, function(){
            
          });
      } else if ($scope.data.key == 7) { // 整体收益
        param = {sortby: 'sumRate', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(status){}, function(){
           
          });
      } else if ($scope.data.key == 8) { // 单位净值
        param = {sortby: 'Nav', sort: 'desc', subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(status){}, function(){
            
          });
      } else {
        param = {subtype: $scope.data.currentSubType};
        Main.sortMoreProducts($scope.data.category, param,
          function(data){
            if (count+data.length == count){
              $scope.data.more=false;
            }
            console.log("infinite scroll stop");
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, function(status){}, function(){
            
          });
      }

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



.controller('orderDetailCtrl', function($scope, $stateParams, $ionicActionSheet, $cordovaCamera, $ionicPopup, $state, Main) {
  //console.log('124455');
  var oid = $stateParams.orderId;
  $scope.data.order = null;
  $scope.data.cms = null;
  $scope.data.profile = Main.getProfile();

  console.log(oid);
  if (Main.getRole() == 'Customer') {
    $scope.data.order = Main.customer.getOrder(oid);
  } else if(Main.getRole() == 'Consultant') {
    $scope.data.order = Main.consultant.getOrder(oid);
    if ($scope.data.order == null) {
      $scope.data.order = Main.customer.getOrder(oid);
    }
  }


/*
  $scope.$on('$ionicView.enter',function(){
    if (Main.getRole() == 'Customer') {
      $scope.data.order = Main.customer.getOrder(oid);
    } else if(Main.getRole() == 'Consultant') {
      $scope.data.order = Main.consultant.getOrder(oid);
      if ($scope.data.order == null) {
        $scope.data.order = Main.customer.getOrder(oid);
      }
    }
  }); 
*/

  $scope.data.orderState = Main.getOrderState();
  $scope.data.productType = Main.getProductType();

  $scope.enableCommission =function() {
    if(Main.getRole() == 'Consultant') {
      return true;
    } else {
      return false;
    }
  }

  $scope.enableExtra = function() {
    if ($scope.data.order.customer.id != $scope.data.profile.data.id) {
      return false;
    } else {
      return true;
    }
  }

  $scope.redeemPublicFund = function() {
    $state.go('common.redeem', {orderId: $scope.data.order.id, fundNo: $scope.data.order.product.partnerFundId})
  }

  $scope.buyMorePublicFund = function() {
    $state.go('common.buy', {productId: $scope.data.order.product.id, fundNo: $scope.data.order.product.partnerFundId})
  }

  $scope.doRefresh = function() {
    setTimeout(function(){
      console.log('refresh');
      Main.customer.queryOrderDetail(oid, function(data){
        $scope.data.order = data;

        if (Main.customer.getOrder(oid)!=null) {
           Main.customer.getOrder(oid) = data;
           console.log(11);
        }

      }, function(status){}, function(){
        $scope.$broadcast('scroll.refreshComplete');
      });

    }, 1000);
  };

})


.controller('commonCustomerHistoryCtrl', function($scope, $stateParams, $ionicPopup, $state, Main) {
  
  var cid = $stateParams.customerId;
  $scope.data = {   
    currentIndex: 'orders',
    orders:  {
      data:[]
    }, 
    bookings: {
      data:[]
    },
    bookingState: Main.getBookingState(),
    orderState: Main.getOrderState(),
    productType: Main.getProductType()
  };

   $scope.selectHistory = function(index){
     $scope.data.currentIndex = index;
   }
   $scope.showHistory = function(index){
     return ($scope.data.currentIndex==index);
   }
   $scope.goOrderDetail = function(oid) {
    $state.go('common.order_detail', {orderId: oid});
   }
   $scope.goBookingDetail = function(bid) {
    $state.go('common.booking_detail', {bookingId: bid});
   };

   Main.consultant.queryCustomerOrders(cid, function(data){
        $scope.data.orders.data = data;
    }, function(status){}, function(){});
   Main.consultant.queryCustomerBookings(cid, function(data){
      $scope.data.bookings.data = data;
    }, function(status){}, function(){});



})

.controller('mainCtrl', function($scope, $state, $window, $cordovaNetwork, $cordovaCamera, $ionicActionSheet, $ionicPopup, $rootScope, $ionicHistory, $timeout, Main, Notify, Factory) {
  
   $scope.goMainPage = function() {
      //window.open('http://biaoweihui.idea-source.net/abstract/', '_system');
   }
   $scope.goRegisterConsultant = function() {
      window.open('http://115.29.207.154:8888/i_register', '_system');
   }



   $scope.complain = function() {
      $ionicPopup.alert({
                  title: '投诉',
                  cssClass: 'alert-text',
                  template:  '请拨打400XXXXXXX进行投诉!'
      });
   }

   $scope.modify = {
    password: "",
    password1: "",
    password2: "",
    verify: '获取验证码',
    code:"",
    enabled: false
   };

  $scope.getModifyVerifyCode = function(phone){
      var loopVerifyWords = function(cnt) 
      {
        promise = $timeout(function () { loopVerifyWords(cnt); }, 1000); 
        $scope.modify.verify = cnt;
        if (cnt == 0) {
          $scope.modify.verify = "获取验证码";
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
        $scope.modify.enabled = true;
      }, function(status){
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '验证码获取失败!'
          });
      }, function(){
      });
   }



   $scope.showProductTab = function(tab) {
     $scope.data.looking_product_tab = tab;
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
    looking_msg: '',
    looking_product_tab: 'main',
    looking_booking: null,
    optionOperation: null

  };

  $scope.imgProfile = {
    data: "teImg/ghnr1lef.png",
    id: ""
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
  $scope.data.commissionCtrl = Main.getCommissionCtrl();

  Main.login({}, function(){ 
      $scope.data.person.status = 1;
    }, function(){
    }, function(profile){
      $scope.data.person.profile = profile;
      //console.log($scope.data.person.role);
    });

   // login every 5 minutes to avoid session expired.
   setInterval(function(){
     Main.login({}, function(){ 
      $scope.data.person.status = 1;
    }, function(){
    }, function(profile){
      $scope.data.person.profile = profile;
      //console.log($scope.data.person.role);
    });
    }, 1000*60*5);


    $scope.upload = function() {

      var dt = new Date()
      //新建文件上传选项，并设置文件key，name，type
      var options = new FileUploadOptions();
      options.fileKey="ffile";
      options.fileName=$scope.imgProfile.data.substr($scope.imgProfile.data.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";
      //用params保存其他参数，例如昵称，年龄之类
      var params = {};
      params['name'] = 'tyson-'+dt.getTime();
      //params['name'] = 'tyson';
      //把params添加到options的params中
      options.params = params;
      //新建FileTransfer对象
      var ft = new FileTransfer();
      //上传文件
      
      ft.upload(
          $scope.imgProfile.data,
          encodeURI(Main.queryUploadAccountUrl()),//把图片及其他参数发送到这个URL，相当于一个请求，在后台接收图片及其他参数然后处理
          uploadSuccess,
          uploadError,
          options);
      //upload成功的话
      function uploadSuccess(r) {
          var resp = JSON.parse(r.response);
          console.log(resp);
          if(resp.successful){
      　　　　 //返回前一页面
              //$navHistory.back();
              //console.log('success');
              $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '上传头像成功!'
              }).then(function(res){
                $scope.imgProfile.id = resp.result.id;
                
                /*
                setTimeout(function(){
                  $scope.imgProfileId = resp.result.id;
                  $scope.imgProfile = 'aaa';
                  console.log('aaa');
                  $scope.$apply();
                }, 1000);*/
                
              }); //tyson1
              

          }else{
              $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '上传头像失败!'
              });
          }
      }
      //upload失败的话
      function uploadError(error) {
        console.log(error);
        $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '上传头像失败!'
              });
      }

    };


  $scope.choosePicMenu = function() {

    var type = 'gallery';
    var option = {  
      quality: 20,  
      destinationType: Camera.DestinationType.FILE_URI,  
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,  
      allowEdit: false,  
      encodingType: Camera.EncodingType.JPEG,  
      cameraDirection: 1,
      targetWidth: 114,  
      targetHeight: 114,  
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

                    $scope.imgProfile.data = imageURI;
                    //console.log(imageURI);
                    //$scope.$apply();
                    $scope.upload();
                },
                function (err) {
                });
            return true;
        }
    });
  }



  $scope.showProduct = function(product) {
    $scope.data.looking_product_tab = 'main';

    if(product){
      ret = Main.productGoState(product);

      if (ret.go) {
        if (product.type=='PublicFund') {
          $state.go(ret.go, {productId: product.id, fundNo: product.partnerFundId});
        } else {
          $state.go(ret.go, {productId: product.id});
        }
      } else {
        Main.isLikedProduct(product.id, function(data){
          if(data.length>0) {
            $scope.data.currentLiked = true;
          } else {
            $scope.data.currentLiked = false;
          }
          
        }, function(status){
          $scope.data.currentLiked = false;
        }, function(){});

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
    $scope.data.currentLiked = false;
  }
  $scope.likeIt = function() {
    if(Main.tryLock()) {
      return;
    } else {
      Main.getLock();
    }

    if (Main.getRole() == 'Guest') {
       $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '请先登入!'
              }).then(function(data){Main.putLock();});
       return;
    }

    if($scope.data.looking_product) {
      Main.likeIt($scope.data.looking_product, function(data){
          $scope.data.currentLiked = true;
          $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '收藏成功!'
              }).then(function(data){Main.putLock();});
      }, function(status){
        $scope.data.currentLiked = false;
          $ionicPopup.alert({
                  title: '提示信息',
                  cssClass: 'alert-text',
                  template:  '收藏失败!'
              }).then(function(data){Main.putLock();});
      }, function(){});
    }
  }
  $scope.hateIt = function(product) {
    Main.hateIt(product, function(data){
      }, function(status){
      }, function(){});
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
      $scope.data.order_option = Factory.newOption(10000, 20000000, 10000);
      $scope.data.popup = 'OrderDialog';
    }
  }

  $scope.messageDialog = function(msg) {
    $scope.data.popup = 'MessageDialog';
    $scope.data.looking_msg = msg;
    var role = Main.getRole();
    if(role=='Consultant') {
      Main.consultant.markUserMessageRead(msg.id, function(data){
        msg.read = data.read;
        Notify.refreshMenu();
      }, function(status){}, function(){});
    } else if(role == 'Customer') {
      Main.customer.markUserMessageRead(msg.id, function(data){
        msg.read = data.read;
        Notify.refreshMenu();
      }, function(status){}, function(){});
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

  $scope.addConsultantOrder = function(product) {
    console.log('addConsultantOrder');
    var role = Main.getRole();
    if(role=='Guest') {
      $ionicPopup.alert({
        title: '系统提示',
        template: '请先登入'
      });
      return;
    } else if(role == 'Consultant') {  
    // only for consultant to order directly.
      if($scope.data.looking_product) {
        //console.log('booking add');
        Main.customer.submitOrder($scope.data.looking_product.id, $scope.data.order_option.quantity,  function(data){
          $scope.data.warning.status = 'success';
          $scope.data.warning.words = '您的订单已成功提交!';
          $scope.$broadcast("AddOrder", data);
          //console.log(data);
          //console.log("tyson");
        }, function(error){
          $scope.data.warning.status = 'fail';
          $scope.data.warning.words = error;
        }, function(){
        });
      } 
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
        clearRegister();
        $ionicPopup.alert({
          title: '系统提示',
          template: '注册成功，确认后返回登入'
        }).then(function(){
           setTimeout(function(){
              $scope.data.popup = 'login';
            }, 200);
        });
      }, function(res){
        $scope.data.warning.status = 'fail';
        $scope.data.warning.words = res;
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


  $scope.getProductTitle = function(pr){
    return Main.getProductTitle(pr);
  }

})



.controller('mainIndexCtrl', function($scope, $ionicPopup, $state,$ionicScrollDelegate, $timeout, Main) {

  $scope.data.categories = Main.getCategories(0);
  $scope.data.externals = Main.getCategories(1);
  $scope.data.main = 'internal'
  $scope.data.barMsgs = [];
  $scope.data.currentBarMsg = {};


  $scope.goExam = function(param) {
    var role = Main.getRole();
    if(role=='Guest') {
      $ionicPopup.alert({
        title: '系统提示',
        template: '请先登入'
      });
    } else if(role=='Consultant') {
      $ionicPopup.alert({
        title: '系统提示',
        template: '只有客户可以进行理财评测'
      });
    } else if(role == 'Customer') {
      $state.go('exam.customer', {suite: param});
    } else {}
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

  $scope.barProducts = Main.getBarProducts();
  
  Main.getProducts($scope.barProducts, function(data){
  }, function(){}, function(){});


  $scope.goPromotion =  function(position){
    var pid = "";
    console.log("i'm here");
    for (var i = 0; i<$scope.barProducts.products.data.length; i++) {
      //console.log($scope.barProducts[i]);
      if ($scope.barProducts.products.data[i].position == position) {
        pid = $scope.barProducts.products.data[i].id;
        break;
      }
    }
    if (pid!="") {
      $state.go('common.promotion_detail', {productId: pid});
    }
  }

  $scope.messageDialog1 = function(msg) {
    $scope.data.popup = 'MessageDialog';
    $scope.data.looking_msg = msg;
  } 


  Main.queryBarMsgs(function(data){
    /*
    if ($scope.dta.barMsgs.length){
      return;
    }*/
    $scope.data.barMsgs = data;
    var loopBarMsgs = function(cnt) 
    {
      if (cnt-1>=0) {
        $scope.data.currentBarMsg = $scope.data.barMsgs[cnt-1];
      }
      if (cnt == 1) {
        promise = $timeout(function () { loopBarMsgs($scope.data.barMsgs.length); }, 5000); 
      } else {
        promise = $timeout(function () { loopBarMsgs(cnt); }, 5000); 
      }    
      cnt = cnt-1;
    }; 
    loopBarMsgs($scope.data.barMsgs.length);
  }, function(status){}, function(){});
  
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
         if (count+data.length == count){
            $scope.data.more=false;
          }
          console.log("infinite scroll stop");
          $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function(status){}, function(){
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




.controller('ConsultantMenuCtrl', function($scope, $rootScope, $state, Main, MultipleViewsManager){
  $scope.data = {
    mainMenu: "index",
    subMenu: "",
    productType: Main.getProductType(),
    commissionCtrl: Main.getCommissionCtrl(),
    bookingsTodoCount: 0,
    ordersTodoCount: 0,
    msgCount: 0
  }

  MultipleViewsManager.updatedLeft(function(params) {
    //console.log(params);
    $scope.data.mainMenu = params.main;
    $scope.data.subMenu  = params.sub;
  });


  $rootScope.$on('RefreshMenu', function(event, args){
    Main.consultant.queryTodoBookingsCount(function(data){
      $scope.data.bookingsTodoCount = data;
    }, function(status){}, function(){})
    Main.consultant.queryTodoOrdersCount(function(data){
      $scope.data.ordersTodoCount = data;
    }, function(status){}, function(){})
    Main.consultant.queryCountOfUserMessages(function(data){
      $scope.data.msgCount = data;
    }, function(status){}, function(){})
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
    Main.consultant.queryTodoBookingsCount(function(data){
      $scope.data.bookingsTodoCount = data;
    }, function(status){}, function(){})
    Main.consultant.queryTodoOrdersCount(function(data){
      $scope.data.ordersTodoCount = data;
    }, function(status){}, function(){})
    Main.consultant.queryCountOfUserMessages(function(data){
      $scope.data.msgCount = data;
    }, function(status){}, function(){})
})




.controller('CustomerMenuCtrl', function($scope, $rootScope, $state, Main, MultipleViewsManager){
  $scope.data = {
    mainMenu: "index",
    subMenu: "",
    productType: Main.getProductType(),
    bookingsTodoCount: 0,
    ordersTodoCount: 0,
    msgCount: 0
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

  $rootScope.$on('RefreshMenu', function(event, args){
    Main.customer.queryTodoBookingsCount(function(data){
      $scope.data.bookingsTodoCount = data;
    }, function(status){}, function(){})
    Main.customer.queryTodoOrdersCount(function(data){
      $scope.data.ordersTodoCount = data;
    }, function(status){}, function(){})
    Main.customer.queryCountOfUserMessages(function(data){
      $scope.data.msgCount = data;
    }, function(status){}, function(){})
  });

    Main.customer.queryTodoBookingsCount(function(data){
      $scope.data.bookingsTodoCount = data;
    }, function(status){}, function(){})
    Main.customer.queryTodoOrdersCount(function(data){
      $scope.data.ordersTodoCount = data;
    }, function(status){}, function(){})
    Main.customer.queryCountOfUserMessages(function(data){
      $scope.data.msgCount = data;
    }, function(status){}, function(){})
})



.controller('mainConsultantCtrl', function($scope, $rootScope, $ionicPopup, $state, $timeout, $ionicScrollDelegate, $cordovaCamera, 
  MultipleViewsManager, Main, Notify) {

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
    message:{},
    messages: []

  };

  $scope.data = {
    productType: Main.getProductType(),
    orderState: Main.getOrderState(),
    bookingState: Main.getBookingState(),
    bookings: Main.consultant.getBookings(),
    orders: Main.consultant.getOrders(),
    customers: Main.consultant.getCustomers(),
    profile: Main.getProfile(),
    groups: [],
    investments:{},

    currentOrderState: 'all',
    currentOrder: null,
    currentBookingState: 'all',
    currentBooking: null,
    liked: Main.getLiked(),
    commissions: [],

    selectedGroupName: '',
    selectedGroup: 'all',

    update: {
      certs: [],
      newCerts: [],

      province: '',
      email: '',
      address: '',
      imageId: $scope.imgProfile.id,
      fullname: '',
      background: '',
      gender: '',
      certificates: 0 
    },

    commissionCtrl: Main.getCommissionCtrl()
  };

  //**
  //** initialize
  $scope.data.currentOrder = $scope.data.orders['all'];
  $scope.data.currentBooking = $scope.data.bookings['all'];
  $scope.data.investments = Main.customer.getOrders()['all'],
  

  $scope.tmpCerts = {
    'cpb': false, 
    'afp': false,
    'cfp': false,
    'efp': false
  }


  $scope.modifyPassword = function(phone, code, name, pwd1, pwd2){
      if (pwd1=='') {
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '请输入新密码'
          });
        return;
      }
      if (pwd1!=pwd2){
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '请确认两次密码输入一致'
          });
        return;
      }
      if (code==''){
         $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '请输入验证码'
          });
        return;
      }
 
      Main.modifyPassword(phone, code, name, pwd1, function(data){
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '密码修改成功'
          }).then(function(){
            $scope.consultant.updatedProfile = 0;
          });

      }, function(status){
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  status
          });
      },function(){});
   }

  $scope.enableNewCert = function(c){
    if($scope.data.profile.data.certs!=null){
      for (var i = 0; i < $scope.data.profile.data.certs.length; i++){
        if($scope.data.profile.data.certs[i] == c) {
          return false;
        }
      }
    }
    return true;
  }
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

  $scope.$on('$ionicView.enter', function() {
    Main.customer.queryOrders($scope.data.investments, function(data){
    }, function(status){}, function(){});
  });

  //**
  //** common function
  $scope.changeGroup = function(grp) {
    if (grp=='all') {
      Main.consultant.queryCustomers($scope.data.customers, function(data){
      }, function(status){}, function(){});
    } else {
      Main.consultant.queryGroupMembers($scope.data.customers, grp, function(data){

      }, function(status){}, function(){});
    }
  }

  $scope.group = function(person) {
     var success = false;
     var step1 = '';
     
     var myPopup = $ionicPopup.show({
       //template: '<input type="text" ng-model="data.wifi">',
       template: '<select style="width:100%" ng-model="data.selectedGroupName"><option ng-repeat="group in data.groups" value="{{group}}">{{group}}</option></select>',
       title: '加入分组',
       subTitle: '选择客户分组',
       scope: $scope,
       buttons: [
         { text: '新建分组', 
           onTap: function(e) {
             step1 = 'new';
             return step1;
           }
         },
         {
           text: '<b>确认加入</b>',
           type: 'button-positive',
           onTap: function(e) {
             step1 = 'existed';
             return step1;  
           }
         },
         {
          text: '取消',
          onTap: function(e) {
            step1 = 'close';
            return step1;
          }
         }
       ]
     });
     myPopup.then(function(res) {
        console.log(res);
        if (res=='close') {
          return;
        }
        if (res=='existed') {
          if ($scope.data.selectedGroupName!='') {
            Main.consultant.addGroupMember($scope.data.selectedGroupName, person.id, function(data){
              $ionicPopup.alert({
                title: '系统提示',
                template: '添加分组成功'
              });
              
            }, function(status){
              $ionicPopup.alert({
                title: '系统提示',
                template: '添加分组失败'
              });
            }, function(){})
          } else {
            $ionicPopup.alert({
              title: '系统提示',
              template: '请选择分组，添加失败'
            });
          }
        } else {
          var newGroupPopup = $ionicPopup.prompt({
            title: '新建分组',
            inputType: 'text',
            okText: '确认',
            cancelText: '取消',
            inputPlaceholder: '请输入新建客户分组名'
          }).then(function(res1) {
            console.log('客户分组名', res1);
            if (res1 && res1!='') {
              Main.consultant.addGroupMember(res1, person.id , function(data){
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '添加分组成功'
                });
                Main.consultant.queryGroups(function(data1){
                  $scope.data.groups = data1;
                }, function(status1){}, function(){});
              }, function(status){
                $ionicPopup.alert({
                  title: '系统提示',
                  template: '添加分组失败'
                });
              }, function(){});
            } else {
              $ionicPopup.alert({
                title: '系统提示',
                template: '请选择分组，添加失败'
              });
            }
          });
        }
     });
      /*
     $timeout(function() {
        myPopup.close(); //由于某种原因3秒后关闭弹出
     }, 3000);*/
  }

  
  $scope.withdrawCommission = function(cms) {
    Main.consultant.withdrawCommission(cms.id, function(data){
      //console.log(data);
      cms.state = data.state;
      $ionicPopup.alert({
        title: '提示信息',
        cssClass: 'alert-text',
        template:  '申请成功!'
      });
    }, function(status){
      $ionicPopup.alert({
        title: '提示信息',
        cssClass: 'alert-text',
        template:  '申请提现失败!'
      });
    }, function(){});
  }

  $scope.goCustomerHistory = function(cus) {
    $state.go('common.customer_history', {customerId: cus.id});
  }

  $scope.updateProfileInformation = function(param) {

    if ($scope.imgProfile.id != '') {
      $scope.data.update.imageId = $scope.imgProfile.id;
      param.imageId = $scope.imgProfile.id;
    }

    // new certs
    found = false;
    param.newCerts  = [];
    for(var key in $scope.tmpCerts){
      if ($scope.tmpCerts[key] == true) {
        if ($scope.data.profile.data.certs) {
          for (var i = 0; i < $scope.data.profile.data.certs.length; i++) {
            if (key == $scope.data.profile.data.certs[i]) {
              found = true;
              break;
            }
          }
        }

        if (!found) {
          param.newCerts.push(key);
        }
      }
    }
    //

    Main.consultant.updateConsultant(param, function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }

      if (data.imageId && data.imageId != '') {
        $scope.imgProfile.data = Main.queryUploadAccountUrl() + '/' + data.imageId;
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

    console.log($scope.tmpCerts);

     // update profile
    Main.consultant.queryConsultant(function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }
      if (data.imageId && data.imageId != '') {
        $scope.imgProfile.data = Main.queryUploadAccountUrl() + '/' + data.imageId;
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

    Main.queryLiked(function(data){
    }, function(status){}, function(){});

    Main.consultant.queryGroups(function(data){
      $scope.data.groups = data;
    }, function(status){}, function(){});

    Main.consultant.queryUserMessages(function(data){
      $scope.data.messages = data;
    }, function(status){}, function(){});

    Main.consultant.queryCommissions(function(data){
      $scope.data.commissions = data;
    }, function(status){}, function(){});

    Main.customer.queryOrders($scope.data.investments, function(data){
    }, function(status){}, function(){});

    Notify.refreshMenu();
  };

  $scope.deleteMsg = function(mid) {
    Main.consultant.deleteUserMessage(mid, function(data){
       Main.consultant.queryUserMessages(function(data1){
        $scope.data.messages = data1;
       }, function(status1){}, function(){});
       Notify.refreshMenu();
    }, function(status){}, function(){});
  }
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

})

.controller('mainCustomerCtrl', function($scope, $state, $ionicPopup, $ionicModal, $ionicScrollDelegate, $timeout, $rootScope,
                                        $cordovaCamera, MultipleViewsManager, Main, Notify) {
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

    liked: Main.getLiked(),
    refreshing: {bookings:false, orders:false},
    messages: [],

    update: {
      province: '',
      email: '',
      address: '',
      imageId: $scope.imgProfile.id,
      fullname: '',
      gender: ''
    }
  };

  //**
  //** initialize
  $scope.data.currentOrder = $scope.data.orders['all'];
  $scope.data.currentBooking = $scope.data.bookings['all'];


  $scope.modifyPassword = function(phone, code, name, pwd1, pwd2){
      if (pwd1=='') {
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '请输入新密码'
          });
        return;
      }
      if (pwd1!=pwd2){
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '请确认两次密码输入一致'
          });
        return;
      }
      if (code==''){
         $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '请输入验证码'
          });
        return;
      }
 
      Main.modifyPassword(phone, code, name, pwd1, function(data){
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  '密码修改成功'
          }).then(function(){
            $scope.customer.updatedProfile = 0;
          });

      }, function(status){
        $ionicPopup.alert({
           title: '提示信息',
           cssClass: 'alert-text',
           template:  status
          });
      },function(){});
   }
   
  //**
  //** common function
  $scope.updateProfileInformation = function(param) {
    
    if ($scope.imgProfile.id != '') {
      $scope.data.update.imageId = $scope.imgProfile.id;
      param.imageId = $scope.imgProfile.id;
    }

    Main.customer.updateCustomer(param, function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }
      
      if (data.imageId && data.imageId != '') {
        $scope.imgProfile.data = Main.queryUploadAccountUrl() + '/' + data.imageId;
      } 

      $ionicPopup.alert({
          title: '提示信息',
          cssClass: 'alert-text',
          template:  '更新资料成功!'
        }).then(function(res){
            $scope.customer.updatedProfile = 0;
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
  
  $scope.$on('$ionicView.enter', function() {
     Main.customer.queryOrders($scope.data.currentOrder, function(data){
    }, function(status){}, function(){
    });
  });

  var refreshData = function() {

     // update profile
    Main.customer.queryCustomer(function(data){
      for (key in $scope.data.update) {
        $scope.data.update[key] = data[key];
      }
      
      if (data.imageId && data.imageId != '') {
        $scope.imgProfile.data = Main.queryUploadAccountUrl() + '/' + data.imageId;
      } 
      //console.log(data);
    },function(status){}, function(){
    });

    Main.customer.queryOrders($scope.data.currentOrder, function(data){
    }, function(status){}, function(){
    });
    Main.customer.queryBookings($scope.data.currentBooking, function(data){
    }, function(status){}, function(){
      $scope.$broadcast('scroll.refreshComplete');    //因为booking比较多
    });

    Main.queryLiked(function(data){
    }, function(status){}, function(){});

    Main.customer.queryUserMessages(function(data){
      $scope.data.messages = data;
    }, function(status){}, function(){});

    Notify.refreshMenu();
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
  $scope.deleteMsg = function(mid) {
    Main.customer.deleteUserMessage(mid, function(data){
       Main.customer.queryUserMessages(function(data1){
        $scope.data.messages = data1;
       }, function(status1){}, function(){});
       Notify.refreshMenu();
    }, function(status){}, function(){});
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

});











