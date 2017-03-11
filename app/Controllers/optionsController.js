app.controller("options", ['$scope', '$http', 'gwApiUrlHelper', 'gw2ApiUrls',
function optionsCtrl($scope, $http, gwApiUrlHelper, gw2ApiUrls){
    var response = gwApiUrlHelper.GetContentFromArea(gw2ApiUrls.TokenInfo);
    response.then(function(value){
            $scope.menuItems = value.data.permissions;
        },
        function(value){
            console.log("errors...");
            console.log(value);
        });
}]);