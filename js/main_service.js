angular.module('main.service',[])
.factory('Main', function(Rest, Storage) {

// Dictionary
  var transAccount = {
    username: '',
    identityId: '',
    mobile: '',
    email: '',
    password: '',
    partnerId: '', // user id in partner system
    partner: '',
    ownerId: '',   // user id in fpsb systeƒ√m
    authorized: false,
    riskLevel: ''
  };

  var commissionCtrl = {
    enabled: false
  };

  var checkNotice = [false,false,false,false,false];

  var categories = [
    {id: 1, childOf: true,   state: "common.publicfund1",  name: "公募基金",  key:'publicfunds',   image:'teImg/gongmu.png', products:{data:[]}},
    {id: 2, childOf: false,  state: null,                 name: "私募基金",  key:'privatefunds',  image:'teImg/simu.png',  products:{data:[]}},
    {id: 3, childOf: false,  state: null,                 name: "信托产品",  key:'trusts',        image:'teImg/xintuo.png', products:{data:[]}},
    {id: 4, childOf: false,  state: null,                 name: "资管产品",  key:'portfolios',    image:'teImg/ziguan.png', products:{data:[]}},
    {id: 5, childOf: false,  state: null,                 name: "保险产品",  key:'insurances',    image:'teImg/baoxian.png', products:{data:[]}},
    {id: 6, childOf: false,  state: "common.service",     name: "家族信托",  key:'familytrusts',  image:'teImg/jiazuxintuo.png', products:{data:[]}},
  ];

  var externals = [
    {id: 7,  childOf: false, state: 'common.service',     name: "海外保险",  key:'overseainsurances',     image:'teImg/haiwaibaoxian.png', products:{data:[]}},
    {id: 8,  childOf: false, state: 'common.service',     name: "海外信托",  key:'overseatrusts',         image:'teImg/haiwaixintuo.png', products:{data:[]}},
    {id: 9,  childOf: false, state: 'common.service',     name: "海外投资",  key:'overseainvestments',    image:'teImg/haiwaitouzi.png', products:{data:[]}},
    {id: 10, childOf: false, state: 'common.service',     name: "身份安排",  key:'overseamigrations',     image:'teImg/shenfenanpai.png', products:{data:[]}},
    {id: 11, childOf: false, state: 'common.service',     name: "海外置业",  key:'overseapropertys',      image:'teImg/haiwaizhiye.png', products:{data:[]}}
    //{id: 12, childOf: false, state: 'common.service',     name: "其他服务",  key:'external5',    image:'teImg/qita.png', products:{data:[]}}
  ];

  var barProducts={id: 12,  childOf: false, state:'promotion.service', name: "热门推荐",  key:'bars',  image:'teImg/barproduct.png', products:{data:[]}};


  var optionBookingState = {
    //initiated:       {state:' initiated',      name: '待分配理财师',   image: 'teImg/unserved.png'},
    //assigned:        {state: 'assigned',       name: '已分配理财师',   image: 'teImg/unserved.png'},
    //accepted:        {state: 'accepted',       name: '理财师已接受',   image: 'teImg/unserved.png'},
    completed:       {state: 'completed',      name: '已处理',      image: 'teImg/served.png'},
    todo:            {state: 'todo',           name: '未处理',      image: 'teImg/unserved.png'}
    //cancelled:       {state: 'cancelled',      name: '预约取消',      image: 'teImg/unserved.png'}
  };
  var optionOrderState = {
    //all:             {state: 'all',            name: '全部' ,         image: 'teImg/gnr2rabm11.png'},
    //initiated:       {state: 'initiated',      name: '已提交' ,       image: 'teImg/gnr2rabm1.png'},
    //paid:            {state: 'paid',           name: '已付款' ,       image: 'teImg/gnr2rabm3.png'},
    //documented:      {state: 'documented',     name: '资料已上传',     image: 'teImg/gnr2rabm4.png'},
    holding:         {state: 'holding',        name: '持有中',        image: 'teImg/gnr2rabm4a.png'},
    unconfirm:       {state: 'unconfirm',      name: '待确认',        image: 'teImg/gnr2rabm4a.png'},
    completed:       {state: 'completed',      name: '已完成',        image: 'teImg/gnr2rabm3a.png'},
    todo:            {state: 'todo',           name: '未完成',        image: 'teImg/gnr2rabm4a.png'}
    //cancelled:       {state: 'cancelled',      name: '已取消',        image: 'teImg/gnr2rabm4.png'},
    //rejected:        {state: 'rejected',       name: '已拒绝',        image: 'teImg/gnr2rabm4.png'},
  };
  var optionProductType = {
    all:             {type:  'all',            name: '全部',         image: 'teImg/gnr2rabm11.png'},
    bar:             {type:  'bar',            name: '推荐',         image: 'teImg/barproduct.png'},
    privatefund:     {type:  'privatefund',    name: '私募',         image: 'teImg/simu.png'},
    publicfund:      {type:  'publicfund',     name: '公募',         image: 'teImg/gongmu.png'},
    trust:           {type:  'trust',          name: '信托',         image: 'teImg/xintuo.png'},
    portfolio:       {type:  'portfolio',      name: '资管',         image: 'teImg/ziguan.png'},
    insurance:       {type:  'insurance',      name: '保险',         image: 'teImg/baoxian.png'},
    familytrust:     {type:  'familytrust',    name: '家族信托',      image: 'teImg/jiazuxintuo.png'},
    overseainsurance:     {type:  'overseainsurance',    name: '海外保险',      image: 'teImg/haiwaibaoxian.png'},
    overseatrust:         {type:  'overseatrust',        name: '海外信托',      image: 'teImg/haiwaixintuo.png'},
    overseainvestment:    {type:  'overseainvestment',   name: '海外投资',      image: 'teImg/haiwaitouzi.png'},
    overseamigration:     {type:  'overseamigration',    name: '身份安排',      image: 'teImg/shenfenanpai.png'},
    overseaproperty:      {type:  'overseaproperty',     name: '海外置业',      image: 'teImg/haiwaizhiye.png'},
  };

  var enablePopup = true;
  var lockPopup = false;

// bookings
  var Bookings = function(){
    this.data = [];
    this.count = 0;
    this.cursor = 0;
  }
  Bookings.prototype = {
    getData: function(){
      return this.data;
    },
    getCount: function(){
      return this.count;
    },
    getCursor: function(){
      return this.cursor;
    }
  }

  var StateBookings = function(param) {
    this.state = param.state;
    this.getState = function(){
      return this.state;
    }
  }
  StateBookings.prototype = new Bookings();   

  var TypeBookings = function(param) {
    this.type = param.type;
    this.getType = function() {
      if (this.type=='alltype'){
        return 'all';
      } else {
        return this.type;
      }
    }
  };
  TypeBookings.prototype = new Bookings();

// orders
  var Orders = function(){
    this.data = [];
    this.count = 0;
    this.cursor = 0;
  }
  var StateOrders = function(param) {
    this.state = param.state;
    this.getState = function(){
      return this.state;
    }
  };
  StateOrders.prototype = new Orders();   

  var TypeOrders = function(param) {
    this.type = param.type;
    this.getType = function() {
      if (this.type=='alltype'){
        return 'all';
      } else {
        return this.type;
      }
    }
  };
  TypeOrders.prototype = new Orders();

// Global member
  var roleCustomer = {
    bookings: {},
    orders:   {}
  };
  var roleConsultant = {
    bookings: {},
    orders:   {},
    customers: {
      data: []
    }     //后续有分组
  };

  var id = null;
  var role = 'Guest';
  var profile = {
    data: {}
  };
  var liked = {
    data: []
  };

// Initialize
  var Init = function(){
    for (var key in optionBookingState){
      roleCustomer.bookings[key]   = new StateBookings(optionBookingState[key]);
      roleConsultant.bookings[key] = new StateBookings(optionBookingState[key]);
    }
    for (var key in optionOrderState){
      roleCustomer.orders[key]     = new StateOrders(optionOrderState[key]);
      roleConsultant.orders[key]   = new StateOrders(optionOrderState[key]);
    }
    for (var type in optionProductType){
      roleCustomer.bookings[type]   = new TypeBookings(optionProductType[type]);
      roleConsultant.bookings[type] = new TypeBookings(optionProductType[type]);
      roleCustomer.orders[type]     = new TypeOrders(optionProductType[type]);
      roleConsultant.orders[type]   = new TypeOrders(optionProductType[type]);
    }

    
  }();
  //console.log(roleCustomer);

  // todo  then.error.finally 后续做一下
  var parseRestSuccess = function(fname, data, successHandler, errorHandler) {
    enablePopup = true;
    if (data.successful) {
      console.log('main.service '+ fname + ' success');
      successHandler(data.result);
      return true;
    } else {
      console.log('main.service '+ fname + ' error:'+ data.message);
      errorHandler(data.message);
      return false;
    }
  };

  var parseRestError = function(fname, status, errorHandler) {
    enablePopup = true;
    console.log('main.service '+ fname + ' error status:'+ status);
    if (status == 401) {
      errorHandler('权限错误');
    } else if (status == 400) {
      errorHandler('请求无效');
    } else if (status == 404 ) {
      errorHandler('url不可达');
    } else if (status == 500) {
      errorHandler('服务器错误');
    } else if (status == 0) {
      errorHandler('无网络');
    } else {
      errorHandler('未知错误');
    }
  };

  return {

    getNotice: function(id) {
      return checkNotice[id];
    }, 
    changeNotice: function(id) {
      checkNotice[id] = !checkNotice[id];
    },

    putLock: function() {
      lockPopup = false;
    },

    tryLock: function() {
      return lockPopup;
    },
    getLock: function(){
      lockPopup = true;
    },

    queryProductDetail: function(pid, successHandler, errorHandler,finallyHandler) {
      Rest.queryProductDetail(pid, function(data){
          if(parseRestSuccess('queryProductDetail', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
          }
        }, function(status){
          parseRestError('queryProductDetail', status, errorHandler);
        }, finallyHandler());
    },

    modifyPassword: function(phone, code, name, pwd, successHandler, errorHandler,finallyHandler) {
      Rest.modifyPassword(phone, code, name, pwd, function(data){
          if(parseRestSuccess('modifyPassword', data, successHandler, errorHandler)) {
          }
        }, function(status){
          parseRestError('modifyPassword', status, errorHandler);
        }, finallyHandler());
    },

    getCommissionCtrl: function() {
      return commissionCtrl;
    },

    queryUploadAccountUrl: function() {
      return Rest.queryUploadAccountUrl(id);
    },

    getProductImageUrl: function(pid, iid) {
      return Rest.getProductImageUrl(pid, iid);
    },
    getProductTitle: function(product) {
      var type = product.type.toLowerCase();
      for(var i=0; i<categories.length; i++){
        var str = categories[i].key.toLowerCase();
        if(str.indexOf(type)>=0){
          if (categories[i].state) {
            return product.title;
          } else {
            console.log(product);
            return product.issuer;
          }
        }
      }
      return product.title;
    },

    productGoState: function(product) {
      if(product.type == 'Bar') {
        return {go: 'common.promotion_detail'};
      }

      var type = product.type.toLowerCase();
      for(var i=0; i<categories.length; i++){
        var str = categories[i].key.toLowerCase();
        if(str.indexOf(type)>=0){
          return {go: categories[i].state};
        }
      }

      return {go:'common.service'};
    },

    getProductType: function(){
      return optionProductType;
    },
    getOrderState: function(){
      return optionOrderState;
    },
    getBookingState: function(){
      return optionBookingState;
    },
    getRole: function() {
      return role;
    },  



    buy: {
      queryTransAccount: function(name, identity, successHandler, errorHandler, finallyHandler) {
        Rest.buy.queryTransAccount(id, name, identity, function(data){
          if(parseRestSuccess('queryTransAccount', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
            transAccount = data.result;
          }
        }, function(status){
          parseRestError('queryTransAccount', status, errorHandler);
        }, function(){enablePopup = true;});
      },
      queryTransAccount1: function(successHandler, errorHandler, finallyHandler) {
        Rest.buy.queryTransAccount1(id, function(data){
          if(parseRestSuccess('queryTransAccount1', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
            //transAccount = data.result;
          }
        }, function(status){
          parseRestError('queryTransAccount1', status, errorHandler);
        }, function(){enablePopup = true;});
      },
      createTransAccount: function(name, identity, pwd, mail, mobile, successHandler, errorHandler, finallyHandler) {
        Rest.buy.createTransAccount(id, name, identity, pwd, mail, mobile, function(data){
          if(parseRestSuccess('createTransAccount', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
            transAccount = data.result;
          }
        }, function(status){
          parseRestError('createTransAccount', status, errorHandler);
        }, function(){enablePopup = true;});
      },

      authorizeTransAccount: function(pwd, successHandler, errorHandler, finallyHandler) {
        Rest.buy.authorizeTransAccount(id, transAccount.id, pwd, function(data){
          if(parseRestSuccess('authorizeTransAccount', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
            transAccount = data.result;
          }
        }, function(status){
          parseRestError('authorizeTransAccount', status, errorHandler);
        }, function(){enablePopup = true;});
      },

      queryBankBinding: function(tid, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;
        Rest.buy.queryBankBinding(id, tid, function(data){
          if(parseRestSuccess('queryBankBinding', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
          }
        }, function(status){
          parseRestError('queryBankBinding', status, errorHandler);
        }, function(){enablePopup = true;});
      },

      queryValidBanks: function(tid, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;
        Rest.buy.queryValidBanks(id, tid, function(data){
          if(parseRestSuccess('queryValidBanks', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
            //transValidBanks = data.result;
          }
        }, function(status){
          parseRestError('queryValidBanks', status, errorHandler);
        }, function(){enablePopup = true;});
      },

      queryBindingBanks: function(tid, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;

        if (tid=='magic') {
          tid = transAccount.id;
        }

        Rest.buy.queryBindingBanks(id, tid, function(data){

          if(parseRestSuccess('queryBindingBanks', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
          }
        }, function(status){
          parseRestError('queryBindingBanks', status, errorHandler);
        }, function(){enablePopup = true;});
      },

      initiateBankBinding: function(bankId, bankName, bankCardNo, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;

        Rest.buy.initiateBankBinding(id, transAccount.id, bankId, bankName, bankCardNo, function(data){
          if(parseRestSuccess('initiateBankBinding', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
          }
        }, function(status){
          parseRestError('initiateBankBinding', status, errorHandler);
        }, function(){enablePopup = true;});
      },

      confirmBankBinding: function(token, code, apply, bankId, bankName, bankCardNo, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;
        Rest.buy.confirmBankBinding(id, transAccount.id, token, code, apply,
                                    bankId, bankName, bankCardNo, function(data){
          if(parseRestSuccess('confirmBankBinding', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
          }
        }, function(status){
          parseRestError('confirmBankBinding', status, errorHandler);
        }, function(){enablePopup = true;});
      },
      purchasePublicFund: function(pid, bcard,  amount, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;
        Rest.buy.purchasePublicFund(id, transAccount.id, pid, bcard,  amount, function(data){
          if(parseRestSuccess('purchasePublicFund', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
          }
        }, function(status){
          parseRestError('purchasePublicFund', status, errorHandler);
        }, function(){enablePopup = true;});
      },
      redeemPublicFund: function(pid, bcard,  share, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;
        Rest.buy.redeemPublicFund(id, transAccount.id, pid, bcard,  share, function(data){
          if(parseRestSuccess('redeemPublicFund', data, successHandler, errorHandler)) {
            console.log('tyson11111111');
            console.log(data);
          }
        }, function(status){
          parseRestError('redeemPublicFund', status, errorHandler);
        }, function(){enablePopup = true;});
      },
      getBuyRiskLevel: function() {
        return transAccount.riskLevel;
      }
    },

    login: function(param, successHandler, errorHandler, finallyHandler) {
      var username = null;
      var password = null;
      if(!param.username  && !param.password){
        var login = Storage.getObject('login');
         if(login) {
          username = login.username;
          password = login.password; 
        }
      } else if (param.username && param.password) {
        username = param.username;
        password = param.password;
      } else {

      }

      console.log('username:'+username+';password:'+password); 
      if (username  && password) {  // if both two appear
        Rest.login(username, password, function(res){
          pragma = res.headers('Pragma');
          if (pragma.indexOf('Consultant')>=0){
            role = "Consultant";
          } else if(pragma.indexOf('Customer')>=0) {
            role = "Customer";
          }  else {
            // todo
          }
          // to be modify
          console.log(pragma);
          arr = pragma.split('},');
          arr = arr[0].split(',');
          pragma = arr[0].replace('{"id":"', "");
          pragma = pragma.replace('"', "");
          //
  
          id = pragma;
          console.log(id);

          Storage.setObject('login', {'username': username, 'password': password});
          

          console.log('main.service login success:' + id);
          successHandler();
        }, function(res){
          console.log('main.service login error:'+res.statusText);
          errorHandler();
        }, function(){
          finallyHandler({'id':id, 'role':role});
        });
      } else {
        errorHandler();
        finallyHandler({'id':id, 'role':role});
      }
    },

    logout: function(cb){
      console.log('main.service login out');
      id = null;
      role = 'Guest';
      Storage.setObject('login', {'username': null, 'password': null});
      cb({'id':id, 'role':role});
    },

    askVerifyCode: function(phone, successHandler, errorHandler, finallyHandler) {
      Rest.askVerifyCode(phone, function(code){
        console.log('main.service ask verify code success code:'+code);
        successHandler(code);
      }, function(res){
        console.log('main.service ask verify code error:'+res.statusText);
        errorHandler(res);
      }, finallyHandler);
    },
    register: function(username, password, code, referral, fullname, successHandler, errorHandler, finallyHandler) {
      Rest.register(username, password, code, referral, fullname, function(data) {
        console.log(data);
        if(parseRestSuccess('register', data, successHandler, errorHandler)) {  
          console.log(data.result);
        }
      }, function(status){
        parseRestError('register', status, errorHandler);
        //parseRestError('register', status, errorHandler);
      }, finallyHandler());

    },

    getPublicFundDetail: function(product, successHandler, errorHandler, finallyHandler){
      Rest.getPublicFundDetail(product.pid, function(data){
        if(parseRestSuccess('getPublicFundDetail', data, successHandler, errorHandler)) {  
          console.log(data.result);
          product.data = data.result;
        }
      }, function(status){
        parseRestError('getPublicFundDetail', status, errorHandler);
      }, finallyHandler());
    },

    sortProducts: function(category, param, successHandler, errorHandler, finallyHandler){
      param.offset = 0;
      param.limit = 10;
      param.type  = category.key;

      Rest.getProducts(param, function(data){
        if(parseRestSuccess('sortProducts', data, successHandler, errorHandler)) {  
          category.products.data = data.result;
        }
      }, function(status){
        parseRestError('sortProducts', status, errorHandler);
      }, finallyHandler());
    },

    getProducts: function(category, successHandler, errorHandler, finallyHandler){
      var param = {};
      param.type = category.key;
      param.offset = 0;
      param.limit = 10;
 
      Rest.getProducts(param, function(data){
        if(parseRestSuccess('getProducts', data, successHandler, errorHandler)) {  
          category.products.data = data.result;
        }
      }, function(status){
        parseRestError('getProducts', status, errorHandler);
      }, finallyHandler());
    },

    sortMoreProducts: function(category, param, successHandler, errorHandler, finallyHandler){
      param.type = category.key;
  
      Rest.getProductsCount(param, function(data){
        if(parseRestSuccess('sortMoreProducts', data, successHandler, errorHandler)) {
          var count = data.result;

          if (count > category.products.data.length) {
            param.offset = category.products.data.length;
            param.limit = 10;       
          
            Rest.getProducts(param, function(res){
              if(parseRestSuccess('sortMoreProducts', res, successHandler, errorHandler)) {  
                category.products.data = category.products.data.concat(res.result);
                console.log('tyson:' + category.products.data.length);
              }
            }, function(status){}, finallyHandler());
          } else {
            successHandler({length:0});
          }
        }
      }, function(status){
        parseRestError('sortMoreProducts', status, errorHandler);
      }, function(){});

    },


    getMoreProducts: function(category, successHandler, errorHandler, finallyHandler){
      var param = {};
      param.type = category.key;
  
      Rest.getProductsCount(param, function(data){
        if(parseRestSuccess('getMoreProducts', data, successHandler, errorHandler)) {
          var count = data.result;

          if (count > category.products.data.length) {
            param.offset = category.products.data.length;
            param.limit = 10;       
          
            Rest.getProducts(param, function(res){
              if(parseRestSuccess('getProducts', res, successHandler, errorHandler)) {  
                category.products.data = category.products.data.concat(res.result);
                console.log('tyson:' + category.products.data.length);
              }
            }, function(status){}, finallyHandler());
          } else {
            successHandler({length:0});
          }
        }
      }, function(status){
        parseRestError('getMoreProducts', status, errorHandler);
      }, function(){});

    },


    // 身份相关
    getProfile: function() {
      return profile;
    },

    // 收藏相关

    getLiked: function(){
      return liked;
    },

    isLikedProduct: function(pid, successHandler, errorHandler, finallyHandler) {
      Rest.isLikedProduct(id, pid, function(data){
        if (parseRestSuccess('isLikedProduct', data, successHandler, errorHandler)) {
          console.log(data);
        }
      }, function(status){
        parseRestError('isLikedProduct',  status, errorHandler);
      }, finallyHandler());
    },

    queryLiked: function(successHandler, errorHandler, finallyHandler) {
      Rest.getFavorites(id, function(data){
        if (parseRestSuccess('getFavorites', data, successHandler, errorHandler)) {
          liked.data=data.result;
        }
      }, function(status){
        parseRestError('getFavorites',  status, errorHandler);
      }, finallyHandler());
    },

    likeIt: function(product, successHandler, errorHandler, finallyHandler) {
      if (!enablePopup){return;}
      enablePopup = false;

      console.log(liked.data.length);
      if (liked.data.length <= 60) {
        Rest.addToFavorites(id, product.id, function(data){
          if (parseRestSuccess('addToFavorites', data, successHandler, errorHandler)) {
            liked.data=data.result;
            return {ret: 1, msg: '已收藏'};
          }
        }, function(status){
          parseRestError('addToFavorites',  status, errorHandler);
          return {ret: 0, msg: '网络错误'};
        }, function(){enablePopup = true;});
        
      } else {
        return {ret: 0, msg: '超出最大收藏数量60'}
      }
    },

    hateIt: function(product, successHandler, errorHandler, finallyHandler) {
      console.log(liked.data.length);
      if (liked.data.length > 0) {
        Rest.deleteFromFavorite(id, product.id, function(data){
          if (parseRestSuccess('deleteFromFavorite', data, successHandler, errorHandler)) {
            liked.data=data.result;
            return {ret: 1, msg: '已删除'};
          }
        }, function(status){
          parseRestError('deleteFromFavorite',  status, errorHandler);
          return {ret: 0, msg: '网络错误'};
        }, finallyHandler());
        
      } else {
        return {ret: 0, msg: '收藏夹是空得'}
      }
    },

    // operation相关
    getOperation: function(product, bookingHandler, orderHandler, errorHandler) {
      if (role=='Customer') {
        if (product.type.toLowerCase()=='publicfund') {
          return {enabled: true, name: '认购/申购', action: orderHandler};
        } else {
          return {enabled: true, name: '预约/咨询', action: bookingHandler};
        }
      } else if (role=='Consultant') {
        return {enabled: true, name: '认购/申购', action: orderHandler};
      } else {      // include 'Guest' and other
        return {enabled: false, name: '预约/咨询', action: errorHandler};
      }
    },


    getProductDetail: function(cid, pid) {
      for (var i = 0; i < categories.length; i++) {
        if (categories[i].id == cid) {
         
          for (var j = 0; j < categories[i].products.data.length; j++) {
            if (categories[i].products.data[j].id == pid) {
              return categories[i].products.data[j];
            }
          }
        }
      }
      for (var i = 0; i < externals.length; i++) {
        if (externals[i].id == cid) {
          for (var j = 0; j < externals[i].products.data.length; j++) {
            if (externals[i].products.data[j].id == pid) {
              return externals[i].products.data[j];
            }
          }
        }
      }
    },

    queryBarMsgs: function(successHandler, errorHandler, finallyHandler) {
      Rest.queryBarMsgs(function(data){
        if (parseRestSuccess('queryBarMsgs', data, successHandler, errorHandler)) { 

        }
      }, function(status){
        parseRestError('queryBarMsgs',  status, errorHandler);
      }, 
      finallyHandler());
    },

    customer: {
      queryOrderDetail: function(oid, successHandler, errorHandler, finallyHandler) {
         Rest.customer.v1.queryOrderDetail(id, oid, function(data){
            if (parseRestSuccess('queryOrderDetail', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('queryOrderDetail',  status, errorHandler);
          }, 
          finallyHandler());
      },

      isProductBooked: function(pid, successHandler, errorHandler, finallyHandler) {
         Rest.customer.v1.isProductBooked(id, pid, function(data){
            if (parseRestSuccess('isProdcutBooked', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('isProductBooked',  status, errorHandler);
          }, 
          finallyHandler());
      },

      getRiskTest: function(suite, successHandler, errorHandler, finallyHandler) {
         Rest.customer.v1.getRiskTest(id, suite, function(data){
            if (parseRestSuccess('getRiskTest', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('getRiskTest',  status, errorHandler);
          }, 
          finallyHandler());
      },
      submitRiskTest: function(tid, answer, successHandler, errorHandler, finallyHandler) {
         Rest.customer.v1.submitRiskTest(id, tid, answer, function(data){
            if (parseRestSuccess('submitRiskTest', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('submitRiskTest',  status, errorHandler);
          }, 
          finallyHandler());
      },

      queryUserMessages: function(successHandler, errorHandler, finallyHandler) {
        Rest.customer.v1.queryUserMessages(id, function(data){
            if (parseRestSuccess('queryUserMessages', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('queryUserMessages',  status, errorHandler);
          }, 
          finallyHandler());
      },
      markUserMessageRead: function(mid, successHandler, errorHandler, finallyHandler) {
        Rest.customer.v1.markUserMessageRead(id, mid, function(data){
            if (parseRestSuccess('markUserMessageRead', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('markUserMessageRead',  status, errorHandler);
          }, 
          finallyHandler());
      },
      queryCountOfUserMessages: function(successHandler, errorHandler, finallyHandler) {
        Rest.customer.v1.queryCountOfUserMessages(id, function(data){
            if (parseRestSuccess('queryCountOfUserMessages', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('queryCountOfUserMessages',  status, errorHandler);
          }, 
          finallyHandler());
      },
      deleteUserMessage: function(mid, successHandler, errorHandler, finallyHandler) {
        Rest.customer.v1.deleteUserMessage(id, mid, function(data){
            if (parseRestSuccess('deleteUserMessage', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('deleteUserMessage',  status, errorHandler);
          }, 
          finallyHandler());
      },



      queryConsultantProfileUrl: function(cid, iid){
        return Rest.customer.v1.queryConsultantProfileUrl(cid, iid);
      },

      queryCustomer: function(successHandler, errorHandler, finallyHandler) {
        Rest.customer.v1.queryCustomer(id, function(data){
            if (parseRestSuccess('queryCustomer', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              profile.data = data.result;
              
            }
          }, function(status){
            parseRestError('queryCustomer',  status, errorHandler);
          }, 
          finallyHandler());
      },

      updateCustomer: function(param, successHandler, errorHandler, finallyHandler) {
        Rest.customer.v1.updateCustomer(param, id, function(data){
          if(parseRestSuccess('updateCustomer', data, successHandler, errorHandler)) {
            profile.data = data.result;
            
          }
        }, function(status){
          parseRestError('updateCustomer', status, errorHandler);
        }, 
        finallyHandler());
      },

      addBooking: function(pid, successHandler, errorHandler, finallyHandler) {

        if (!enablePopup){return;}
        enablePopup = false;

        if(id) {
          Rest.customer.v1.addBooking(id, pid, function(data){
            if (parseRestSuccess('addBooking', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
            }
          }, function(status){
            parseRestError('addBooking',  status, errorHandler);
          }, 
          function(){enablePopup = true;});
        } else {
          console.log('main.service addBooking failed for no customer id');
          errorHandler('请先登入');
          finallyHandler();
        }
      }, 

      getBookings: function() {
        return roleCustomer.bookings;
      },
      getOrders: function() {
        return roleCustomer.orders;
      },
      getOrder: function(oid) {
        for (var key in optionOrderState){
          for (var i=0; i<roleCustomer.orders[key].data.length;i++){
            if (roleCustomer.orders[key].data[i].id == oid) {     
              return roleCustomer.orders[key].data[i];
            }
          } 
        }
        for (var key in optionProductType){
          for (var i=0; i<roleCustomer.orders[key].data.length;i++){
            if (roleCustomer.orders[key].data[i].id == oid) {
              return roleCustomer.orders[key].data[i];
            }
          } 
        }
      },
      
      queryBookings: function(bookings, successHandler, errorHandler, finallyHandler) {
        var param = {};
        if (bookings instanceof TypeBookings) {
          param = {type:  bookings.getType()};
        } else if (bookings instanceof StateBookings) {
          param = {state: bookings.getState()};
        } else {
        }

        Rest.customer.v1.queryBookings(param, id, function(data){
          if(parseRestSuccess('queryBookings', data, successHandler, errorHandler)) {
            /*
            bookings.data.length = 0;
            for (var i=0;i<data.result.length;i++){
              bookings.data.push(data.result[i]);
            }*/
            bookings.data = data.result;
          }
        }, function(status){
          parseRestError('queryBookings', status, errorHandler);
        }, 
        finallyHandler());
      },

      queryTodoBookingsCount: function(successHandler, errorHandler, finallyHandler){ 
         param = {state:'todo'};
         Rest.customer.v1.queryBookingsCount(param, id, function(data){
            if(parseRestSuccess('queryTodoBookingsCount', data, successHandler, errorHandler)) {
              //var count = data.result;
              console.log(data.result);
            }
          }, function(status){
             parseRestError('queryTodoBookingsCount', status, errorHandler);
          },  finallyHandler());
      },
      queryTodoOrdersCount: function(successHandler, errorHandler, finallyHandler){ 
         param = {state:'todo'};
         Rest.customer.v1.queryOrderssCount(param, id, function(data){
            if(parseRestSuccess('queryTodoOrdersCount', data, successHandler, errorHandler)) {
              //var count = data.result;
              console.log(data.result);
            }
          }, function(status){
             parseRestError('queryTodoOrdersCount', status, errorHandler);
          },  finallyHandler());
      },

      queryMoreBookings: function(bookings, successHandler, errorHandler, finallyHandler){  //currentBooking
        var param = {};
        if (bookings instanceof TypeBookings) {
          param = {type:  bookings.getType()};
        } else if (bookings instanceof StateBookings) {
          param = {state: bookings.getState()};
        } else {
        }

        Rest.customer.v1.queryBookingsCount(param, id, function(data){
          if(parseRestSuccess('queryBookingsCount', data, successHandler, errorHandler)) {
            var count = data.result;
            if (count > bookings.data.length) {
              //param.offset = parseInt(bookings.data.length/25) * 25 
              param.offset = bookings.data.length;
              param.limit = 25;                                    //tyson need to update

              Rest.customer.v1.queryBookings(param, id, function(data){
                if(parseRestSuccess('queryMoreBookings', data, successHandler, errorHandler)) {
                  for(var i=0;i<data.result.length;i++) {
                    bookings.data.push(data.result[i]);
                  }
                }
              }, function(status){
                parseRestError('queryMoreBookings', status, errorHandler);
              }, 
              finallyHandler());
            }
          }
        }, function(status){
          parseRestError('queryBookingsCount', status, errorHandler);
        }, function(){});
      },

      submitOrder: function(pid, money, successHandler, errorHandler, finallyHandler) {
        if (!enablePopup){return;}
        enablePopup = false;

        if(id) {
          Rest.customer.v1.submitOrder(id, pid, money, function(data){
            if (parseRestSuccess('submitOrder', data, successHandler, errorHandler)) { 
              //customer.orders.all.unshift(data.result);
              //customer.orders.initiated.unshift(data.result);
            }
          }, function(status){
            parseRestError('submitOrder', status, errorHandler);
          }, 
          finallyHandler());
        } else {
          console.log('main.service submitOrder failed for no customer id');
          errorHandler('请先登入');
          finallyHandler();
        }
      },

      queryOrders: function(orders, successHandler, errorHandler, finallyHandler) {
        var param = {};
        if (orders instanceof TypeOrders) {
          param = {type:  orders.getType()};
          //param = {type:  'PrivateFund'};
          //console.log('tyson: '+param);
        } else if (orders instanceof StateOrders) {
          param = {state: orders.getState()};
        } else {
        }

        Rest.customer.v1.queryOrders(param, id, function(data){
          if(parseRestSuccess('queryOrders', data, successHandler, errorHandler)) {
             orders.data = data.result;  
          }
        }, function(status){
          parseRestError('queryOrders',  status, errorHandler);
        }, 
        finallyHandler());
      }
    }, // customer

////////////////////////////////////////////////

    consultant: {
      isProductOrdered: function(pid, successHandler, errorHandler, finallyHandler) {
         Rest.consultant.v1.isProductOrdered(id, pid, function(data){
          if (parseRestSuccess('isProductOrdered', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
          }
        }, function(status){
          parseRestError('isProductOrdered',  status, errorHandler);
        }, 
        finallyHandler());
      },
      queryCommissions: function(successHandler, errorHandler, finallyHandler){
        Rest.consultant.v1.queryCommissions(id, function(data){
          if (parseRestSuccess('queryCommissions', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
          }
        }, function(status){
          parseRestError('queryCommissions',  status, errorHandler);
        }, 
        finallyHandler());
      },
      withdrawCommission: function(cmsId, successHandler, errorHandler, finallyHandler){
        Rest.consultant.v1.withdrawCommission(id, cmsId, function(data){
          if (parseRestSuccess('withdrawCommission', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
          }
        }, function(status){
          parseRestError('withdrawCommission',  status, errorHandler);
        }, 
        finallyHandler());
      },
      queryOrderCommission: function(oid, successHandler, errorHandler, finallyHandler){
        Rest.consultant.v1.queryOrderCommission(id, oid, function(data){
          if (parseRestSuccess('queryOrderCommission', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
          }
        }, function(status){
          parseRestError('queryOrderCommission',  status, errorHandler);
        }, 
        finallyHandler());
      },

      queryUserMessages: function(successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.queryUserMessages(id, function(data){
            if (parseRestSuccess('queryUserMessages', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('queryUserMessages',  status, errorHandler);
          }, 
          finallyHandler());
      },
      markUserMessageRead: function(mid, successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.markUserMessageRead(id, mid, function(data){
            if (parseRestSuccess('markUserMessageRead', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('markUserMessageRead',  status, errorHandler);
          }, 
          finallyHandler());
      },
      queryCountOfUserMessages: function(successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.queryCountOfUserMessages(id, function(data){
            if (parseRestSuccess('queryCountOfUserMessages', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('queryCountOfUserMessages',  status, errorHandler);
          }, 
          finallyHandler());
      },
      deleteUserMessage: function(mid, successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.deleteUserMessage(id, mid, function(data){
            if (parseRestSuccess('deleteUserMessage', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              //data.result;
            }
          }, function(status){
            parseRestError('deleteUserMessage',  status, errorHandler);
          }, 
          finallyHandler());
      },

      queryTodoBookingsCount: function(successHandler, errorHandler, finallyHandler){ 
         param = {state:'todo'};
         Rest.consultant.v1.queryBookingsCount(param, id, function(data){
            if(parseRestSuccess('queryTodoBookingsCount', data, successHandler, errorHandler)) {
              //var count = data.result;
              console.log(data.result);
            }
          }, function(status){
             parseRestError('queryTodoBookingsCount', status, errorHandler);
          },  finallyHandler());
      },
      queryTodoOrdersCount: function(successHandler, errorHandler, finallyHandler){ 
         param = {state:'todo'};
         Rest.consultant.v1.queryOrderssCount(param, id, function(data){
            if(parseRestSuccess('queryTodoOrdersCount', data, successHandler, errorHandler)) {
              //var count = data.result;
              console.log(data.result);
            }
          }, function(status){
             parseRestError('queryTodoOrdersCount', status, errorHandler);
          },  finallyHandler());
      },

      // CRM
      queryGroups: function(successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.queryGroups(id, function(data){
          if(parseRestSuccess('queryGroups', data, successHandler, errorHandler)) {
            //bookings.data = data.result
          }
        }, function(status){
          parseRestError('queryGroups', status, errorHandler);
        }, 
        finallyHandler());
      },
      queryGroupMembers: function(customers, gname, successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.queryGroupMembers(id, gname, function(data){
          if(parseRestSuccess('queryGroupMembers', data, successHandler, errorHandler)) {
            //bookings.data = data.result;
            customers.data = data.result;
          }
        }, function(status){
          parseRestError('queryGroupMembers', status, errorHandler);
        }, 
        finallyHandler());
      },
      addGroupMember: function(gname, cid, successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.addGroupMember(id, gname, cid, function(data){
          if(parseRestSuccess('addGroupMember', data, successHandler, errorHandler)) {
            //bookings.data = data.result;
            
          }
        }, function(status){
          parseRestError('addGroupMember', status, errorHandler);
        }, 
        finallyHandler());
      },
      delGroupMember: function(gname, cid, successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.delGroupMember(id, gname, cid, function(data){
          if(parseRestSuccess('delGroupMember', data, successHandler, errorHandler)) {
            //bookings.data = data.result;
            
          }
        }, function(status){
          parseRestError('delGroupMember', status, errorHandler);
        }, 
        finallyHandler());
      },

      queryCustomerProfileUrl: function(cid, iid){
        return Rest.consultant.v1.queryCustomerProfileUrl(cid, iid);
      },
    
      getBookings: function() {
        return roleConsultant.bookings;
      },

      getBooking: function(bid) {
        for (var key in optionBookingState){
          for (var i=0; i<roleConsultant.bookings[key].data.length;i++){
            if (roleConsultant.bookings[key].data[i].id == bid) {     
              return roleConsultant.bookings[key].data[i];
            }
          } 
        }
        for (var key in optionProductType){
          for (var i=0; i<roleConsultant.bookings[key].data.length;i++){
            if (roleConsultant.bookings[key].data[i].id == bid) {
              return roleConsultant.bookings[key].data[i];
            }
          } 
        }
      },

      getOrder: function(oid) {
        for (var key in optionOrderState){
          for (var i=0; i<roleConsultant.orders[key].data.length;i++){
            if (roleConsultant.orders[key].data[i].id == oid) {     
              return roleConsultant.orders[key].data[i];
            }
          } 
        }
        for (var key in optionProductType){
          for (var i=0; i<roleConsultant.orders[key].data.length;i++){
            if (roleConsultant.orders[key].data[i].id == oid) {
              return roleConsultant.orders[key].data[i];
            }
          } 
        }
      },

      getOrders: function() {
        return roleConsultant.orders;
      },
      getCustomers: function() {
        return roleConsultant.customers;
      },

      

      queryBookings: function(bookings, successHandler, errorHandler, finallyHandler) {
        var param = {};
        if (bookings instanceof TypeBookings) {
          param = {type:  bookings.getType()};
        } else if (bookings instanceof StateBookings) {
          param = {state: bookings.getState()};
        } else {
        }

        Rest.consultant.v1.queryBookings(param, id, function(data){
          if(parseRestSuccess('queryBookings', data, successHandler, errorHandler)) {
            bookings.data = data.result;

            
          }
        }, function(status){
          parseRestError('queryBookings', status, errorHandler);
        }, 
        finallyHandler());
      },

      queryOrders: function(orders, successHandler, errorHandler, finallyHandler) {
        var param = {};
        if (orders instanceof TypeOrders) {
          param = {type:  orders.getType()};
          //param = {type:  'PrivateFund'};
          //console.log('tyson: '+param);
        } else if (orders instanceof StateOrders) {
          param = {state: orders.getState()};
        } else {
        }

        Rest.consultant.v1.queryOrders(param, id, function(data){
          if(parseRestSuccess('queryOrders', data, successHandler, errorHandler)) {
             orders.data = data.result; 
            /*  通过queryCustomer走
             for (var i = 0; i < orders.data.length; i++) {
              orders.data[i].customer.image = Rest.queryUploadAccountUrl(orders.data[i].customer.id) + '/' + orders.data[i].customer.imageId;
            }
            */
          }
        }, function(status){
          parseRestError('queryOrders',  status, errorHandler);
        }, 
        finallyHandler());
      },

      queryCustomers: function(customers, successHandler, errorHandler, finallyHandler) {
        var param = {};
        Rest.consultant.v1.queryCustomers(param, id, function(data){
          if(parseRestSuccess('queryCustomers', data, successHandler, errorHandler)) {
             console.log(data.result);
             customers.data = data.result; 
          }
        }, function(status){
          parseRestError('queryCustomers',  status, errorHandler);
        }, 
        finallyHandler());
      },

      queryConsultant: function(successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.queryConsultant(id, function(data){
            if (parseRestSuccess('queryConsultant', data, successHandler, errorHandler)) { 
              profile.data = data.result;
            }
          }, function(status){
            parseRestError('queryConsultant',  status, errorHandler);
          }, 
          finallyHandler());
      },

      updateConsultant: function(param, successHandler, errorHandler, finallyHandler) {
        Rest.consultant.v1.updateConsultant(param, id, function(data){
          if(parseRestSuccess('updateConsultant', data, successHandler, errorHandler)) {
            profile.data = data.result;
          }
        }, function(status){
          parseRestError('updateConsultant', status, errorHandler);
        }, 
        finallyHandler());
      },

      submitOrder: function(booking, money, successHandler, errorHandler, finallyHandler) {
        var param = {
          customer: booking.customer.id,
          quota:    money,
          product:  booking.product.id
        };
        
        Rest.consultant.v1.submitOrder(param, id, function(data){
          if (parseRestSuccess('submitOrder', data, successHandler, errorHandler)) { 
            console.log('submitorder success');
          }
        }, function(status){
        }, 
        finallyHandler()); 
      },

      acceptBooking: function(booking, successHandler, errorHandler, finallyHandler) {
        var param = {
          booking: booking.id,
          state:   'accepted'
        };
        
        Rest.consultant.v1.updateBooking(param, id, function(data){
          if (parseRestSuccess('acceptBooking', data, successHandler, errorHandler)) { 
          }
        }, function(status){
          parseRestError('acceptBooking', status, errorHandler);
        }, 
        finallyHandler()); 
      },

      completeBooking: function(booking, successHandler, errorHandler, finallyHandler) {
        var param = {
          booking: booking.id,
          state:   'completed'
        };
        
        Rest.consultant.v1.updateBooking(param, id, function(data){
          if (parseRestSuccess('completeBooking', data, successHandler, errorHandler)) { 
          }
        }, function(status){
          parseRestError('completeBooking', status, errorHandler);
        }, 
        finallyHandler()); 
      },

      queryCustomerOrders: function(customerId, successHandler, errorHandler, finallyHandler){
        Rest.consultant.v1.queryCustomerOrders(id, customerId, function(data){
          if (parseRestSuccess('queryCustomerOrders', data, successHandler, errorHandler)) { 
          }
        }, function(status){
          parseRestError('queryCustomerOrders', status, errorHandler);
        }, 
        finallyHandler()); 
      },

      queryCustomerBookings: function(customerId, successHandler, errorHandler, finallyHandler){
        Rest.consultant.v1.queryCustomerBookings(id, customerId, function(data){
          if (parseRestSuccess('queryCustomerBookings', data, successHandler, errorHandler)) { 
          }
        }, function(status){
          parseRestError('queryCustomerBookings', status, errorHandler);
        }, 
        finallyHandler()); 
      }

    }, // consultant


    getCategories: function(parent){
      if (parent == 0) {
        console.log('internal');
        return categories;
      } else if (parent == 1) {
        console.log('external');
        return externals;
      } else {
        return null;
      }
    },

    getCategory: function(cid) {
      for (idx in categories) {
        if(categories[idx].id == cid) {
          return categories[idx]
        }
      }
    },

    getBarProducts: function() {
      return barProducts;
    }
    
  }

});