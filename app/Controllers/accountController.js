app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/account', {
        templateUrl: 'partials/account.html',
        controller: 'account'
    });
}])

app.controller("account", ['$scope', 'config', 'gwApiUrlHelper', 'gw2ApiUrls',
    function account($scope, config, gwApiUrlHelper, gw2ApiUrls){
        $scope.config = config;



        $scope.prettyPrint = function (obj) {
            var str = JSON.stringify(obj, undefined, 4);
            return str;
        }
    }]);