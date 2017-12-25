/*global angular,CardIO,FileDownloader,cordova */
angular.module('utils.module', [])
    .factory('Application', function () {

    var applicationInitParams = {
      deviceOS: null,
      appConfigurations: null,
      deviceRootStatus: null,
      basicAuthToken: null,
      sslPiningStatus: null,
      userBiometrics: {
        isUserHaveBiometrics: null,
        responseData: null
      },
      pushRegData: null,
      unreadAllNotificationCount: null,
      unreadPromoNotificationCount: null,
      appUpdateStatus: null,
      errors: {}
    };

    return {
      //check initial
      setInitialRun: function (initial) {
        localStorage["initialRun"] = initial;
      },
      isInitialRun: function () {
        var value = localStorage["initialRun"];
        return value;
      },
      //check is login
      setIsLogin: function (logged) {
        localStorage["isLogin"] = logged;
      },
      isLogin: function () {
        var value1 = localStorage["isLogin"];
        return value1;
      },
      // check os version
      setOSVersion: function (version) {
        localStorage.osVersion = version;
      },
      getOSVersion: function () {
        var value2 = localStorage.osVersion;
        return value2;
      },
      //check user availability
      setUserAvailable: function (logged) {
        localStorage.isUserAvailable = logged;
      },
      isUserAvailable: function () {
        var value1 = localStorage.isUserAvailable;
        return value1;
      },
      //check fingerprint
      setIsFingerprintAvailable: function (logged) {
        localStorage.isFingerprintAvailable = logged;
      },
      isFingerprintAvailable: function () {
        var value2 = localStorage.isFingerprintAvailable;
        return value2;
      },

      setApplicationInitParams: function(initParamKey, initParamValue) {
        applicationInitParams[initParamKey] = initParamValue;
      },
      setApplicationInitParamsErrors: function(errorParamKey, error) {
        applicationInitParams.errors[errorParamKey] = error;
      },
      getApplicationInitParams: function() {
        return applicationInitParams;
      },
      clearApplicationInitParams: function() {
        applicationInitParams = null;
      }
    };
  })

    .factory('ConfigRead', function ($http) {
    return {
      readConfigJson: function (filePath, successCallback, errorCallback) {
        return $http.get(filePath).then(function (response) {
          successCallback(response.data);
        }).catch(function () {
          errorCallback('File content read error');
        });
      }
    };
  })

    //ConfigurationBuilder
    .factory('ConfigurationBuilder', function ($http, ReadExternalJson, $q) {

    var configurationJson = null;
  /*
    function onError(response) {

      var confJson = $q.defer();
      confJson.resolve(response);
      return confJson.promise;
    }
  */
    return {
      getConfig: function () {
        return configurationJson;
      },
      buildConfig: function (isNeedToRefresh, onSuccess, onError) {
        if (configurationJson != null && !isNeedToRefresh) {

          var confJson = $q.defer();
          confJson.resolve(configurationJson);
          onSuccess(confJson.promise);
          return confJson.promise;
        } else {
          var resultConfig = $q.defer();

          $http.get("app/services/config.json").then(function (response) {

            var mainJson = $q.defer();
            mainJson.resolve(response);

            return mainJson.promise;

          }).then(function (mainJson) {

            resultConfig.resolve(mainJson);

            onSuccess(resultConfig.promise);

          }).catch(function (error) {
            error.statusText = "indicator read error";
            onError(error);
          });

          return resultConfig.promise;
        }
      }
    };
  })

    .factory('ReadExternalJson', function ($http) {
    return {
      readConfigJson: function (filePath, successCallback, errorCallback) {
        return $http.get(filePath).then(function (response) {
          successCallback(response.data);
        }).catch(function () {
          errorCallback('File content read error');
        });
      }
    };
  })

    .factory('Base64EncodeFactory', function () {
    return {
      encodeToBase64: function (param, onEncoded) {
        var Base64 = {
          _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
              n = e.charCodeAt(f++);
              r = e.charCodeAt(f++);
              i = e.charCodeAt(f++);
              s = n >> 2;
              o = (n & 3) << 4 | r >> 4;
              u = (r & 15) << 2 | i >> 6;
              a = i & 63;
              if (isNaN(r)) {
                u = a = 64;
              } else if (isNaN(i)) {
                a = 64;
              }
              t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
            }
            return t;
          }, decode: function (e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
              s = this._keyStr.indexOf(e.charAt(f++));
              o = this._keyStr.indexOf(e.charAt(f++));
              u = this._keyStr.indexOf(e.charAt(f++));
              a = this._keyStr.indexOf(e.charAt(f++));
              n = s << 2 | o >> 4;
              r = (o & 15) << 4 | u >> 2;
              i = (u & 3) << 6 | a;
              t = t + String.fromCharCode(n);
              if (u !== 64) {
                t = t + String.fromCharCode(r);
              }
              if (a !== 64) {
                t = t + String.fromCharCode(i);
              }
            }
            t = Base64._utf8_decode(t);
            return t;
          }, _utf8_encode: function (e) {
            e = e.replace(/rn/g, "n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
              var r = e.charCodeAt(n);
              if (r < 128) {
                t += String.fromCharCode(r);
              } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
              } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
              }
            }
            return t;
          }, _utf8_decode: function (e) {
            var t = "";
            var n = 0;
            var r = 0;
            //var c1 = 0;
            var c2 = 0;
            while (n < e.length) {
              r = e.charCodeAt(n);
              if (r < 128) {
                t += String.fromCharCode(r);
                n++;
              } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2;
              } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3;
              }
            }
            return t;
          }
        };

        onEncoded(Base64.encode(param));
      },

      isBase64Encoded: function (param, onResult) {
        var regexPattern = new RegExp('^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$');
        onResult(regexPattern.test(param));
      }
    };
  })

    .factory('getEnvironmentFactory', function (ReadExternalJson) {
    return {
      getEnvironment: function (onEnv) {
        ReadExternalJson.readConfigJson('app/config/env.json', function (data) {
          onEnv(data.environmentIndicator);
        }, function () {
          onEnv('dev');
        });
      }
    };
  })

    .factory('SetNavigateFactory',function () {

      var navigation = {};

      return{
        getNavigateForm : function () {
          return navigation;
        },
        setNavigateFrom : function (navValue) {
          navigation = navValue;
        }
      };
    })

    .service('commonService', function ($http, Navigation, KeyChain, $ionicHistory) {
    return {
      getConsumerConfig: function (params, onSuccess, onFail) {

        window.plugins.sslCertificateChecker.check(
          function (message) {

            $http({
              method: params.method,
              url: params.url,
              headers: params.headers
            }).then(function (response) {

              onSuccess(response);
            }, function (error) {

              onFail(error);
              //return error;
            });
          },
          function (error) {

            if (error === "CONNECTION_NOT_SECURE") {
              Navigation.goNative('insecure-connection-error');
            }
          },
          params.sever,
          params.fingerprint);
      },

      wipeAddData: function () {

        // Data clear on KeyChain
        KeyChain.clearValueFromKeyChain('userId', 'com.ntb.userId', onSuccessKeyChainClear, onErrorKeyChainClear);
        KeyChain.clearValueFromKeyChain('deviceId', 'com.ntb.deviceId', onSuccessKeyChainClear, onErrorKeyChainClear);
        KeyChain.clearValueFromKeyChain('apiAuthToken', 'com.ntb.apiAuthToken', onSuccessKeyChainClear, onErrorKeyChainClear);
        KeyChain.clearValueFromKeyChain('basicAuthToken', 'com.ntb.basicAuthToken', onSuccessKeyChainClear, onErrorKeyChainClear);

        // Clear local storage
        localStorage.clear();

        // Clear local cache
        $ionicHistory.clearCache();

        // Clear local history
        $ionicHistory.clearHistory();
      }
    };

    // Keychain store success callback
    function onSuccessKeyChainClear(result) {
      return 0;
    }

    // Keychain store error callback
    function onErrorKeyChainClear(error) {
      return 0;
    }
  });



