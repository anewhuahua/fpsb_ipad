angular.module('main.service',[])
.factory('Main', function(Rest, Storage) {
  var id = null;
  var role = 'Guest';
  var categories = [
    {id: 1, name: "公募基金",  key:'publicfunds', image:'teImg/lbanr1img1.png', page:0, products:[]},
    {id: 2, name: "私募基金",  key:'privatefunds',image:'teImg/lbanr1img2.png', page:0, products:[]},
    {id: 3, name: "信托产品",  key:'trusts',      image:'teImg/lbanr1img3.png', page:0, products:[]},
    {id: 4, name: "保险产品",  key:'insurances',  image:'teImg/lbanr1img4.png', page:0, products:[]}
  ];
  var bookings = [];
  var bookings 

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
        password = param.password
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

    addBooking: function(pid, successHandler, errorHandler, finallyHandler) {
      if(id) {
        Rest.addBooking(id, pid, function(data){
          if (parseRestSuccess('addBooking', data, successHandler, errorHandler)) { 
            bookings.unshift(data.result);
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
      return bookings;
    },
    queryBookings: function(param, successHandler, errorHandler, finallyHandler) {
      Rest.queryBookings(param, id, function(data){
        if(parseRestSuccess('queryBooking', data, successHandler, errorHandler)) {
          bookings.length = 0;
          for (var i=0;i<data.result.length;i++) {
            bookings.unshift(data.result[i]);
          }
        }
      }, function(status){
        parseRestError('queryBooking',  status, errorHandler);
      }, 
      finallyHandler());
    },
    
    getCategories: function(){
      return categories;
    },
    getCategory: function(cid) {
      for (idx in categories) {
        if(categories[idx].id == cid) {
          return categories[idx]
        }
      }
    }


    /*
    setBookings: function(pr) {
      bookings.unshift(pr);
      console.log('tyson');
      console.log(bookings);
    }*/

  }

});