angular.module('rest.service', [])

.factory('Rest', function($http) {

  var verifyCode = "tyson";
  var domain="http://115.29.194.11:8080/";

  return {
    getProductImageUrl: function(){
      return domain + 'ChiefFinancierService/api/common/v1/productimages/';
    }, 

    queryUploadAccountUrl: function(id) {
      return domain+'ChiefFinancierService/api/common/v1/accounts/'+ id + '/images';
    },

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
        url: domain + 'ChiefFinancierService/api/common/v1/verificationcodes?phone='
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
    register: function(name, password, code, referral, fullname, successHandler, errorHandler, finallyHandler) {
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

      if(referral!='') {
        req.data["referral"] = referral;
      }
      if(fullname!='') {
        req.data["fullname"] = fullname;
      }
      
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
      limit  = param.limit || '10'

      if (type.toLowerCase()=='publicfunds' && limit=='10') {
        limit = '25';
      }

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

    getProductsCount: function(param, successHandler, errorHandler, finallyHandler) {
      type = param.type
      state  = param.state || 'open';
      var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/common/v1/' +
                type + '/count?' +
                'state=' + state,
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





    customer: {
      v1: {
        queryCustomer: function(cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid,
              headers: {
                'Content-Type': 'application/json'
              }
            };

            //console.log(pid);
          $http(req).success(function(data){
            //console.log(data);
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        },

        updateCustomer: function(param, cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'PUT',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid,
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
              }
            };
          
          for (key in param) {
            if (param[key]!='') {
              req.data[key] = param[key];
            }
          }


          //console.log(pid);
          $http(req).success(function(data){
            //console.log(data);
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        },

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
        queryBookingsCount: function(param, cid, successHandler, errorHandler, finallyHandler) {
          type  = param.type   || 'all';
          state = param.state  || 'all';
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + 
              '/bookings/count?' + '&productType=' + type + '&state=' + state,
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


        queryBookings: function (param, cid, successHandler, errorHandler, finallyHandler) {
          state  = param.state || 'all';
          offset = param.offset || '0';
          limit  = param.limit || '10000';  // 默认全读
          type   = param.type || 'all';

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + 
              '/bookings?state=' + state + '&productType=' + type + '&offset=' + offset + '&limit=' + limit +'&sort=desc',
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
          limit  = param.limit || '10000';
          type   = param.type || 'all';

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + 
              '/orders?state=' + state + '&productType=' + type + '&offset=' + offset + '&limit=' + limit +'&sort=desc',
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

        updateConsultant: function(param, id, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'PUT',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id,
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
              }
            };
          
          for (key in param) {
            if (param[key]!='') {
              req.data[key] = param[key];
            }
          }

          if (req.data['certificates']) {
            var cert = 0;
            if (req.data['certificates'].cpb) {
              cert = 1;
            }
            if (req.data['certificates'].afp) {
              cert = cert + 2;
            }
            if (req.data['certificates'].cfp) {
              cert = cert + 4;
            }
            if (req.data['certificates'].efp) {
              cert = cert + 8;
            }
            req.data['certificates'] = -cert;
          }

            //console.log(pid);
          $http(req).success(function(data){
            //console.log(data);
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        },

        queryConsultant: function(id, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id,
              headers: {
                'Content-Type': 'application/json'
              }
            };

            //console.log(pid);
          $http(req).success(function(data){
            //console.log(data);
            successHandler(data);
          }).error(function(res, status){
            errorHandler(status);
          }).finally(function(){
            finallyHandler();
          });
        },

        queryCustomers: function (param, id, successHandler, errorHandler, finallyHandler) {
          offset = param.offset || '0';
          limit  = param.limit || '25';

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
              '/customers?&offset=' + offset + '&limit=' + limit,
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

        queryBookings: function (param, id, successHandler, errorHandler, finallyHandler) {
          state  = param.state || 'all';
          offset = param.offset || '0';
          limit  = param.limit || '10000';
          type   = param.type || 'all';

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
              '/bookings?state=' + state + '&productType=' + type + '&offset=' + offset + '&limit=' + limit +'&sort=desc',
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
        updateBooking: function(param, id, successHandler, errorHandler, finallyHandler) {
          state   = param.state;
          booking = param.booking;

          var req = {
              method: 'PUT',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
              '/bookings/' + booking + '?state=' + state,
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

        queryOrders: function (param, id, successHandler, errorHandler, finallyHandler) {
          state  = param.state || 'all';
          offset = param.offset || '0';
          limit  = param.limit || '10000';
          type   = param.type || 'all';

          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
              '/orders?state=' + state + '&productType=' + type + '&offset=' + offset + '&limit=' + limit +'&sort=desc',
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

        submitOrder: function(param, id, successHandler, errorHandler, finallyHandler) {
          pid   = param.product;
          quota = param.quota;
          cid   = param.customer;

          var req = {
              method: 'POST',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
              '/orders?productId=' + pid + '&quota=' + quota +'&customerId=' + cid,
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
