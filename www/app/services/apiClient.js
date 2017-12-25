angular.module('api-client.module', ['utils.module'])

  .factory('apiClient', function ($rootScope, $http, $state, $q, $timeout, $ionicHistory, ConfigRead,
    ConfigurationBuilder) {

    var invoke = function (endpoint, isRetry, serviceConfig, onSuccessResponse, onErrorResponse) {

      var retryCountStep = 0;

      //get configurations
      ConfigurationBuilder.buildConfig(false, onSuccessGetAppConfig, onErrorGetAppConfig);

      function onSuccessGetAppConfig(config) {

        var apiService = config.$$state.value.data.apiService;

        var serviceCall = apiService.endpoints[endpoint];

        // merge path parameters from config & request
        var commonPathParams = mergeUrlParameters(serviceCall.pathParams, serviceConfig.pathParams);
        // merge query parameters from config & request
        var commonQueryParams = mergeUrlParameters(serviceCall.queryParams, serviceConfig.queryParams);
        // generate url
        var url = generateUrl(apiService.baseUrl, serviceCall.urlPath, commonPathParams, commonQueryParams);

        // headers
        var globalHeaders = apiService.headers || [];
        var localHeaders = serviceCall.headers || [];
        var paramHeaders = serviceConfig.headers || [];

        var params = serviceConfig.params || "";

        // request body
        var body = serviceConfig.body || "";

        //combine global,local and parameter headers and create header object
        var headers = angular.extend({}, paramHeaders, globalHeaders, localHeaders);

        sendHttpRequest();

        function sendHttpRequest() {

          // increase retry count
          retryCountStep++;

          var timeoutPromiseAtSuccess = $timeout(function () {
            deferred.resolve(); //aborts the request when timed out

            if (isRetry) {
              if (serviceCall.retryCount > retryCountStep) {
                sendHttpRequest();
              } else {
                console.log("Error");
              }
            } else {
              console.log("Error");
            }
          }, serviceCall.serviceTimeout);

          var deferred = $q.defer();

          executeServiceCall(deferred, timeoutPromiseAtSuccess);
        }

        function executeServiceCall(deferred, timeoutPromiseAtSuccess) {
          $http({
            method: serviceCall.method,
            url: url,
            headers: headers,
            timeout: deferred.promise,
            params: params,
            data: body
          }).then(function (response) {
            if (response.status !== 200) {

              onErrorResponse(response);
            } else {

              onSuccessResponse(response);
              $timeout.cancel(timeoutPromiseAtSuccess);
            }

          }, function (error) {

            $timeout.cancel(timeoutPromiseAtSuccess);

            onErrorResponse(error);
            //return error;
          });
        }
      }

      function onErrorGetAppConfig(error) {
        return 0;
      }

    };

    /**
     * Generate url from given parameters
     * @param baseUrl
     * @param urlPath
     * @param pathParams
     * @param queryParams
     * @returns {*}
     */
    var generateUrl = function (baseUrl, urlPath, pathParams, queryParams) {

      var endPointUrl = baseUrl;
      var encodeUrl;

      // path params to url
      var pathKeys = [];
      for (var pathKey in pathParams) {
        pathKeys.push(pathKey)
      }

      var url = urlPath;
      for (var i = 0; i < pathKeys.length; i++) {
        var getPathKey = pathKeys[i];
        url = url.replace(":" + getPathKey, encodeURIComponent(pathParams[getPathKey]));
      }

      // set path params to url
      endPointUrl = endPointUrl + url;

      // query params to url
      var queryKeys = [];
      for (var queryKey in queryParams) {
        queryKeys.push(queryKey);
      }

      if (queryKeys.length > 0) {
        var query = "?";
        for (var j = 0; j < queryKeys.length; j++) {
          var getQueryKey = queryKeys[j];
          if (query === "?") {
            query = query + getQueryKey + "=" + encodeURIComponent(queryParams[getQueryKey]);
          } else {
            query = query + "&" + getQueryKey + "=" + encodeURIComponent(queryParams[getQueryKey]);
          }
        }

        // set query params to url
        endPointUrl = endPointUrl + query;
      }

      return endPointUrl;
    };

    var mergeUrlParameters = function (configParams, requestParams) {
      var commonObj = {};

      for (var configKey in configParams) {
        commonObj[configKey] = configParams[configKey];
      }

      for (var requestKey in requestParams) {
        commonObj[requestKey] = requestParams[requestKey];
      }

      return commonObj;
    };

    return {
      invoke: invoke
    }

  });
