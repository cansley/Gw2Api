app.service('gwApiUrlHelper', ['gw2ApiUrls', 'config', '$http', '$q',
    function(gw2ApiUrls, config, $http, $q){
    return {
      GetUrl: function(area){
          return gw2ApiUrls.Root + area + gw2ApiUrls.QueryString + config.gw2AccessToken;
      },
      GetUrlWithVal: function(area, value){
          return gw2ApiUrls.Root + area + "/" + value + gw2ApiUrls.QueryString + config.gw2AccessToken;
      },
      GetContent: function(url){
          var deferred = $q.defer();
          $http({
              method: "Get",
              url: url,
          }).then(function successCallback(response){
                  deferred.resolve(response);
              },
              function errorCallback(response){
                //TODO: need more robust error handling here...
                  console.log(response);
                  deferred.reject(response);
              });
          return deferred.promise;
      },
        GetContentFromArea: function (area) {
            var url = this.GetUrl(area);
            var response = this.GetContent(url);
            response.then(function(val){
               return val;
            },
            function (val) {
                return val;
            });
             return response;
        },
        GetContentFromAreaWithVal: function (area, value){
            var url = this.GetUrlWithVal(area, value);
            var response = this.GetContent(url);
            response.then(function(val){
                    return val;
                },
                function (val) {
                    return val;
                });
            return response;
        }
    };
}]);