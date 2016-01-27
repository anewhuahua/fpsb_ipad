angular.module('rest.service', [])

.factory('Rest', function($http) {

  var verifyCode = "tyson";
  var domain="http://115.29.194.11:8080/";
  //var domain="http://app.global-ifa.com/";

  return {
    queryProductDetail: function(pid, successHandler, errorHandler,finallyHandler) {
      var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/common/v1/products/' + pid,
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

    modifyPassword: function(phone, code, name, pwd, successHandler, errorHandler,finallyHandler) {
      var req = {
          method: 'POST',
          url: domain+'ChiefFinancierService/api/common/v1/passwords?action=reset&phone='+phone+'&verifyCode='+code,
          headers: {
            'Content-Type': 'application/json',
            'username': name,
            'password': pwd
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

    getProductImageUrl: function(pid,iid){
      return domain + 'ChiefFinancierService/api/common/v1/products/' + pid + '/images/' + iid;
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
      /*
      $http(req).then(function(res){  
          successHandler(res);
      }, function(res){
          errorHandler(res);
      }).finally(function(){
        finallyHandler();
      });*/

      $http(req).success(function(data){
        successHandler(data);
      }).error(function(res, status){
        errorHandler(status);
      }).finally(function(){
        finallyHandler();
      });
      
    },

    getPublicFundDetail: function(pid, successHandler, errorHandler, finallyHandler) {
      var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/partner/v1/partners/cljj/publicfunds/' + pid, 
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

    getProducts: function(param, successHandler, errorHandler, finallyHandler) {
      type = param.type
      state  = param.state || 'open';
      offset = param.offset || '0';
      limit  = param.limit || '10'

      if (type.toLowerCase()=='publicfunds' && limit=='10') {
        limit = '25';
      }
      if (param.search) {
        limit = '100000';
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

      if (param.sortby) {
        req.url = req.url+'&sortby='+param.sortby;
      }
      if (param.sort) {
        req.url = req.url+'&sort='+param.sort;
      }
      if (param.subtype) {
        req.url = req.url+'&subtype='+param.subtype;
      }

      if (param.search) {
        req.url = req.url+'&search='+param.search;
      }

      $http(req).success(function(data){
        successHandler(data);
      }).error(function(res, status){
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

    isLikedProduct: function(id, pid, successHandler, errorHandler, finallyHandler) {
      var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/common/v1/accounts/' + id + '/favorites?' +
              'productId=' + pid,
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

    getFavorites: function(id, successHandler, errorHandler, finallyHandler) {
      var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/common/v1/accounts/' + id + '/favorites?' +
                'offset=0&limit=1000',
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
    addToFavorites: function(id, pid, successHandler, errorHandler, finallyHandler) {
      var req = {
          method: 'POST',
          url: domain+'ChiefFinancierService/api/common/v1/accounts/' + id + '/favorites?' +
               'productId=' + pid, 
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
    deleteFromFavorite: function(id, pid, successHandler, errorHandler, finallyHandler) {
      var req = {
          method: 'DELETE',
          url: domain+'ChiefFinancierService/api/common/v1/accounts/' + id + '/favorites?' + 
               'productId=' + pid,
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



    buy: {

      queryTransAccount: function(id, name, identity, successHandler, errorHandler, finallyHandler) {
        var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj?username='+
                name + '&identityId=' + identity + '&transaccount=any',
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

      queryTransAccount1: function(id, successHandler, errorHandler, finallyHandler) {
        var req = {
          method: 'GET',
          url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj?transaccount=any',
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

      createTransAccount: function(id, name, identity, pwd, mail, mobile, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'POST',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              username: name,
              identityId: identity,
              email: mail,
              mobile: mobile,
              ownerId: id,
              partner: 'cljj',
              password: pwd
              // riskLevel: '1005'
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

      authorizeTransAccount: function(id, tid, pwd, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'POST',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid,
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              trade_pwd: pwd
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

      queryBankBinding: function(id, tid, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'GET',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid +
                        '?action=querybankbinding',
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

      queryValidBanks: function(id, tid, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'GET',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid +
                        '?action=queryvalidbanks',
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
      queryBindingBanks: function(id, tid, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'GET',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid +
                        '?action=querybindingbanks',
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
      initiateBankBinding: function(id, tid, bid, bname, bcard, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'POST',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid +
                        '/banks?action=initiate',
            data: {
              bank_id: bid,
              bank_name: bname,
              bank_card_no: bcard
            },
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

      confirmBankBinding: function(id, tid, token, code, apply, bid, bname, bcard, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'PUT',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid +
                        '/banks?action=confirm&token='+token+'&verifyCode='+code+'&applyNo='+apply,
            data: {
              bank_id: bid,
              bank_name: bname,
              bank_card_no: bcard
            },
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

      purchasePublicFund: function(id, tid, pid, bcard,  amount, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'POST',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid +
                        '?action=purchase&fund_code='+pid+'&bank_card_no='+bcard+'&amount='+amount+'&discount=1',
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

      redeemPublicFund: function(id, tid, pid, bcard, share, successHandler, errorHandler, finallyHandler) {
        var req = {
            method: 'POST',
            url: domain+'ChiefFinancierService/api/partner/v1/customers/' + id + '/partners/cljj/transaccounts/' + tid +
                        '?action=redeem&fund_code='+pid+'&bank_card_no='+bcard+'&share='+share,
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

      /*
      Return： Redeem{
        apply_no
        apply_date
        apply_time
        trade_date
        captail_arrival_date
        } 就像：
        ｛"apply_no":"99972015080600000289","apply_date":"20150817","apply_time":"175614","trade_date":"20150807","cap
        tail_arrival_date":"20150810"}
      */

    },

    queryBarMsgs: function(successHandler, errorHandler, finallyHandler) {
      var req = {
        method: 'GET',
        url: domain+'ChiefFinancierService/api/common/v1/barmsgs' ,
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
        queryOrderDetail: function(id, oid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + id + '/orders/' + oid ,
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

        isProductBooked: function(id, pid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + id + '/bookings/count?productId=' + pid ,
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

        getRiskTest: function(id, suite, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + id + '/risktests/' + suite,
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
        submitRiskTest: function(id, tid, answer, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'POST',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + id + '/risktestTry',
              headers: {
                'Content-Type': 'application/json'
              },
              data: {
                testId: tid,
                answerTries: answer
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

        queryUserMessages: function(cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + '/usermessages?state=all&offset=0&limit=100000',
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

        markUserMessageRead: function(cid, mid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'PUT',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + '/usermessages/' + mid,
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

        queryCountOfUserMessages: function(cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + '/usermessages?query=count&read=false',
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

        deleteUserMessage: function(cid, mid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'DELETE',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + '/usermessages/' + mid,
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

        queryConsultantProfileUrl: function(cid, iid){
          return domain+'ChiefFinancierService/api/common/v1/accounts/'+ cid + '/images/' + iid;
        },

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
        queryOrderssCount: function(param, cid, successHandler, errorHandler, finallyHandler) {
          type  = param.type   || 'all';
          state = param.state  || 'all';
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/customer/v1/customers/' + cid + 
              '/orders/count?' + '&productType=' + type + '&state=' + state,
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
        isProductOrdered: function(cid, pid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/orders/count?productId=' +pid ,
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
        queryCommissions: function(cid, successHandler, errorHandler, finallyHandler){
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/commissions?offset=0&limit=100000',
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
        withdrawCommission: function(cid, cmsId, successHandler, errorHandler, finallyHandler){
          var req = {
              method: 'PUT',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/commissions/' + cmsId + '?action=withdraw',
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
        queryOrderCommission: function(cid, oid, successHandler, errorHandler, finallyHandler){
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/orders/' 
              + oid + '/commissions',
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
        
        queryUserMessages: function(cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/usermessages?state=all&offset=0&limit=100000',
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

        markUserMessageRead: function(cid, mid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'PUT',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/usermessages/' + mid,
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

        queryCountOfUserMessages: function(cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/usermessages?query=count&read=false',
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

        deleteUserMessage: function(cid, mid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'DELETE',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + cid + '/usermessages/' + mid,
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


        // CRM
        queryGroups: function(id, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + '/customergroups/groupnames',
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

        

        queryGroupMembers: function(id, gname, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + '/customergroups/' +
                   gname + '/customers',
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

        addGroupMember: function(id, gname, cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'POST',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + '/customergroups' +
                    '?groupName='+ gname + '&customerId='+cid,
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

        delGroupMember: function(id, gname, cid, successHandler, errorHandler, finallyHandler) {
          var req = {
              method: 'DELETE',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + '/customergroups' +
                    '?groupName='+ gname + '&customerId='+cid,
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

        // CRM
        queryCustomerOrders: function(myid, cid, successHandler, errorHandler, finallyHandler){
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + myid + '/orders?customerId=' + cid +
              '&offset=0&limit=10000',
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

        queryCustomerBookings: function(myid, cid, successHandler, errorHandler, finallyHandler){
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + myid + '/bookings?customerId=' + cid +
              '&offset=0&limit=10000',
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


        queryBookingsCount: function(param, id, successHandler, errorHandler, finallyHandler) {
          type  = param.type   || 'all';
          state = param.state  || 'all';
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
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
        queryOrderssCount: function(param, id, successHandler, errorHandler, finallyHandler) {
          type  = param.type   || 'all';
          state = param.state  || 'all';
          var req = {
              method: 'GET',
              url: domain+'ChiefFinancierService/api/consultant/v1/consultants/' + id + 
              '/orders/count?' + '&productType=' + type + '&state=' + state,
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


        queryCustomerProfileUrl: function(cid, iid){
          return domain+'ChiefFinancierService/api/common/v1/accounts/'+ cid + '/images/' + iid;
        },

        // profile
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
          limit  = param.limit || '10000';

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
