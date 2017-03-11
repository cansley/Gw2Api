app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/characters', {
        templateUrl: 'partials/characters.html',
        controller: 'characters'
    });
}])

app.controller("characters", ['$scope', 'config', 'gwApiUrlHelper', 'gw2ApiUrls', '$http',
    function characters($scope, config, gwApiUrlHelper, gw2ApiUrls, $http){
    $scope.config = config;
    $scope.GetCharacters = function(){
        if ($scope.characters !== undefined && $scope.characters.length > 0) return;
        var response = gwApiUrlHelper.GetContentFromArea(gw2ApiUrls.Characters);
        response.then(function(value){
            var charData = value.data;
            var characters = [];
            charData.forEach(function(item, idx){
                characters.push({id:idx, Name:item});
            });
            $scope.characters = characters;
        },function(error){
            console.log(error);
        });
    };

    $scope.GetCharacterInfo = function(name){
        var response = gwApiUrlHelper.GetContentFromAreaWithVal(gw2ApiUrls.Characters, name);
        response.then(function(value){
                $scope.selectedCharacter = value.data;
                console.log($scope.selectedCharacter);
            },
            function(error){console.log(error);});
    };

    $scope.prettyPrint = function (obj) {
        var str = JSON.stringify(obj, undefined, 4);
        return str;
    }
}]);