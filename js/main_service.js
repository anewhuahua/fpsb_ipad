angular.module('main.service',[])
.factory('Main', function(Rest, Storage) {

// Dictionary

  var sorts = {
    publicfunds: [
      {key:'lastMonth',      name:'近一月'},
      {key:'lastThreeMonth', name:'近三月'},
      {key:'lastHalfYear',   name:'近半年'}
    ],

    privatefunds: [
    ],

    trusts: [
    ],

    insurances: [
    ]
  };
  var filter = {
    publicfunds: [

    ]    
  };


  var categories = [
    {id: 1, child: true,  name: "公募基金",  key:'publicfunds',   image:'teImg/lbaitemimg2.png', products:{data:[]}},
    {id: 2, child: false, name: "私募基金",  key:'privatefunds',  image:'teImg/lbaitemimg3.png', products:{data:[]}},
    {id: 3, child: false, name: "信托产品",  key:'trusts',        image:'teImg/lbaitemimg4.png', products:{data:[]}},
    {id: 4, child: false, name: "资管产品",  key:'portfolios',    image:'teImg/lbaitemimg5.png', products:{data:[]}},
    {id: 5, child: false, name: "保险产品",  key:'insurances',    image:'teImg/lbaitemimg6.png', products:{data:[]}},
    {id: 6, child: false, name: "家族信托",  key:'familytrusts',  image:'teImg/lbaitemimg7.png', products:{data:[]}},
  ];

  var externals = [
    {id: 7,  child: false, name: "海外保险",  key:'external1',    image:'teImg/lbaitemimg2.png', products:{data:[]}},
    {id: 8,  child: false, name: "海外信托",  key:'external2',    image:'teImg/lbaitemimg3.png', products:{data:[]}},
    {id: 9,  child: false, name: "海外投资",  key:'external3',    image:'teImg/lbaitemimg4.png', products:{data:[]}},
    {id: 10, child: false, name: "身份安排",  key:'external4',    image:'teImg/lbaitemimg5.png', products:{data:[]}},
    {id: 11, child: false, name: "海外置业",  key:'external5',    image:'teImg/lbaitemimg6.png', products:{data:[]}},
    {id: 12, child: false, name: "其他服务",  key:'external5',    image:'teImg/lbaitemimg7.png', products:{data:[]}}
  ]



  var optionBookingState = {
    //all:             {state: 'all',            name: '全部' ,         image: ''},
    initiated:       {state:' initiated',      name: '待分配理财师',   image: 'teImg/unserved.png'},
    assigned:        {state: 'assigned',       name: '已分配理财师',   image: 'teImg/unserved.png'},
    accepted:        {state: 'accepted',       name: '理财师已接受',   image: 'teImg/unserved.png'},
    completed:       {state: 'completed',      name: '服务完成',      image: 'teImg/served.png'},
    cancelled:       {state: 'cancelled',      name: '预约取消',      image: 'teImg/unserved.png'}
  };
  var optionOrderState = {
    //all:             {state: 'all',            name: '全部' ,         image: 'teImg/gnr2rabm11.png'},
    initiated:       {state: 'initiated',      name: '已提交' ,       image: 'teImg/gnr2rabm1.png'},
    paid:            {state: 'paid',           name: '已付款' ,       image: 'teImg/gnr2rabm3.png'},
    documented:      {state: 'documented',     name: '资料已上传',     image: 'teImg/gnr2rabm4.png'},
    completed:       {state: 'completed',      name: '已完成',        image: 'teImg/gnr2rabm2.png'},
    cancelled:       {state: 'cancelled',      name: '已取消',        image: 'teImg/gnr2rabm4.png'},
    rejected:        {state: 'rejected',       name: '已拒绝',        image: 'teImg/gnr2rabm4.png'},
  };
  var optionProductType = {
    all:             {type:  'all',            name: '全部',         image: 'teImg/gnr2rabm11.png'},
    privatefund:     {type:  'privatefund',    name: '私募',         image: 'teImg/lbaitemimg3.png'},
    publicfund:      {type:  'publicfund',     name: '公募',         image: 'teImg/lbaitemimg2.png'},
    trust:           {type:  'trust',          name: '信托',         image: 'teImg/lbaitemimg4.png'},
    portfolio:       {type:  'portfolio',      name: '资管',         image: 'teImg/lbaitemimg6.png'},
    insurance:       {type:  'insurance',      name: '保险',         image: 'teImg/lbaitemimg5.png'}
  };


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
    register: function(username, password, code, successHandler, errorHandler, finallyHandler) {
      Rest.register(username, password, code, function(res) {
        if (res.data.successful) {
          console.log('main.service register success:'+ res.data.successful);
          successHandler(res);
        } else {
          console.log('main.service register error:'+res.data.successful);
          errorHandler(res);
        }
      }, function(res){
        console.log('main.service register error:'+res.statusText);
        errorHandler(res);
      }, finallyHandler);
    },
/*
    getProducts: function(param, successHandler, errorHandler, finallyHandler){
      var key = "";
      var tmp = null;
      var step = 10;
      cid = param.cid;    // category id
      page = param.page || 1;
      if(cid) {
        for (idx in categories) {
          if(categories[idx].id == cid) {
            key = categories[idx].key;
            tmp = categories[idx];
            console.log(key);
            break;
          }
        }

        Rest.getProducts({type:key, 
                          state:param.state, 
                          offset:(page-1) * step, 
                          limit:step},
                          function(data){
                            if(page == tmp.page+1) {    //底部分页刷新
                              if(data.result.length==0) {
                                successHandler(null);
                                return;
                              }
                              tmp.products  = tmp.products.concat(data.result);
                              tmp.page = page;
                              //console.log('main.service getProducts success for page:'+page);
                              Storage.setObject(key, tmp);
                              successHandler(tmp);
                            } 
                            else if(page == 1){         //顶部下拉刷新
                              tmp.products = data.result;
                              tmp.page = 1;
                              console.log('main.service getProducts success for page:'+page);
                              Storage.setObject(key, tmp);
                              successHandler(tmp);
                            } else {
                                // todo !important: 就是那种length 不等于step的时候如何存储
                            }
                          }, 
                          function(status){
                            console.error('main.service getProducts error:', 
                                           status);
                            //console.log(res);
                            //console.log(status);
                            errorHandler(status);
                          }, 
                          finallyHandler());
      } else {
        console.error('main.service getProducts error: no cid '+cid);
      }
    },

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

*/

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
              }
            }, function(status){}, function(){});
          }
        }
      }, function(status){
        parseRestError('getMoreProducts', status, errorHandler);
      }, finallyHandler());

    },

    //tyson
    getMockProducts: function(){
      var data = [];
      for(var i=0;i<20;i++) {
        data[i] = [i,i,i,i,i,i,i,i,i,i,i,i,i];
      }
      return data;
    },
    getMoreMockProducts: function(){
      var data = [];
      for(var i=0;i<40;i++) {
        data[i] = [i,i,i,i,i,i,i,i,i,i,i,i,i];
      }
      return data;
    },

    getProfile: function() {
      return profile;
    },

    customer: {

  
      queryCustomer: function(successHandler, errorHandler, finallyHandler) {
        Rest.customer.v1.queryCustomer(id, function(data){
            if (parseRestSuccess('queryCustomer', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
              profile.data = data.result;
              if(profile.data.score==0) {
                profile.data.score="还未进行财商测试";
              }
            }
          }, function(status){
            parseRestError('queryCustomer',  status, errorHandler);
          }, 
          finallyHandler());
      },

      updataCustomer: function(pro, successHandler, errorHandler, finallyHandler) {

      },

      addBooking: function(pid, successHandler, errorHandler, finallyHandler) {
        if(id) {
          Rest.customer.v1.addBooking(id, pid, function(data){
            if (parseRestSuccess('addBooking', data, successHandler, errorHandler)) { 
              //customer.bookings.unserved.unshift(data.result);
            }
          }, function(status){
            parseRestError('addBooking',  status, errorHandler);
          }, 
          finallyHandler());
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

      getUploadUrl: function(oid) {
        return Rest.consultant.v1.queryUploadUrl(id, oid);
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
    }


    

  }

});