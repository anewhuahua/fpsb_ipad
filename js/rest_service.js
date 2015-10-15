angular.module('rest.service', [])

.factory('Rest', function($http) {

  var verifyCode = "tyson";
  var domain="http://115.29.194.11:8080/";

  return {

    login: function(name, password, successHandler, errorHandler,finallyHandler) {
      var id = "";
      var req = {
        method: 'POST',
        url: domain+'ChiefFinancierService/login?username='+
              name + '&password=' + password,
        headers: {
         'Content-Type': 'application/json'
        }
      };
      $http(req).then(function(res){  
          successHandler(res);
      }, function(res){
          errorHandler(res);
      }).finally(function(){
        
        finallyHandler();
      });
    },
    askVerifyCode: function(phone, successHandler, errorHandler, finallyHandler) {
      var req = {
        method: 'POST',
        url: domain +'ChiefFinancierService/api/common/v1/verificationcodes?phone='
               + phone,
        headers: {
         'Content-Type': 'application/json',
         'Pragma': 'pragma,sms'
        }
      };
      $http(req).then(function(res){  
          //console.log(res.headers('Pragma'));
          successHandler(res.headers('Pragma'));
      }, function(res){
          errorHandler(res);
      }).finally(function(){
        finallyHandler();
      });
    },
    register: function(name, password, code, successHandler, errorHandler, finallyHandler) {
      var req = {
        method: 'POST',
        url: domain+'ChiefFinancierService/api/common/v1/customers?verifyCode='
               + code,
        headers: {
         'Content-Type': 'application/json',
        },
        data: {
          //"class": "com.fpsb.chief.financier.persistence.entity.staff.Customer",
          "username": name,
          "password": password,
          "phone": name
        }
      };
      $http(req).then(function(res){  
          successHandler(res);
      }, function(res){
          errorHandler(res);
      }).finally(function(){
        finallyHandler();
      });
    },

    getProducts: function(param, successHandler, errorHandler, finallyHandler) {
      type = param.type
      state  = param.state || 'open';
      offset = param.offset || '0';
      limit  = param.limit || '25'

      var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/common/v1/' +
                type + '?' +
                'state=' + state + '&' +
                'offset=' + offset + '&' +
                'limit=' + limit,
          headers: {
            'Content-Type': 'application/json'
          }
        };

      $http(req).success(function(data){
        //console.log(data);
        //products = data.result;
        successHandler(data);

      }).error(function(res, status){
        //console.error('error', status, res);
        errorHandler(status);
      }).finally(function(){
        finallyHandler();
      });
    },
    customer: {
      v1: {
        addBooking: function(cid, pid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'POST',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + '/bookings?productId=' + pid,
              headers: {
                'Content-Type': 'application/json'
              }
            };

            //console.log(pid);
          $http(req).success(function(data){
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        },
        queryBookings: function (param, cid, successHandler, errorHandler, finallyHandler) {
          state  = param.state || 'all';
          offset = param.offset || '0';
          limit  = param.limit || '25'

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + 
              '/bookings?state=' + state + '&offset=' + offset + '&limit=' + limit,
              headers: {
                'Content-Type': 'application/json'
              }
            };
          $http(req).success(function(data){
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        },
        submitOrder: function(cid, pid, money, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'POST',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + 
              '/orders?productId=' + pid + '&quota=' + money,
              headers: {
                'Content-Type': 'application/json'
              }
            };
          $http(req).success(function(data){
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        },
        queryOrders: function (param, cid, successHandler, errorHandler, finallyHandler) {
          state  = param.state || 'all';
          offset = param.offset || '0';
          limit  = param.limit || '25'

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + 
              '/orders?state=' + state + '&offset=' + offset + '&limit=' + limit +'&sort=desc',
              headers: {
                'Content-Type': 'application/json'
              }
            };
          $http(req).success(function(data){
            console.log(data);
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        }

      } // v1

    }, // customer

    consultant: {
      v1: {
        queryBookings: function (param, id, successHandler, errorHandler, finallyHandler) {
          state  = param.state || 'initiated';
          offset = param.offset || '0';
          limit  = param.limit || '25'

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
              '/bookings?state=' + state + '&offset=' + offset + '&limit=' + limit +'&sort=desc',
              headers: {
                'Content-Type': 'application/json'
              }
            };
          $http(req).success(function(data){
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        }

      } // v1
    } // consultant


  } // return


});
