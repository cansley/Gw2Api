app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/characters', {
        templateUrl: 'partials/characters.html',
        controller: 'characters'
    });
}])

app.controller("characters", ['$scope', 'config', 'gwApiUrlHelper', 'gw2ApiUrls',
    function characters($scope, config, gwApiUrlHelper, gw2ApiUrls){
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
                $scope.GetInventory();
            },
            function(error){console.log(error);});
    };

    $scope.prettyPrint = function (obj) {
        var str = JSON.stringify(obj, undefined, 4);
        return str;
    }

    $scope.GetInventory = function(){
        var char = $scope.selectedCharacter;
        var bags = char.bags;
        $scope.InventoryItems = [];
        bags.forEach(function(bag){
            var inventory = bag.inventory;
            inventory.forEach(function(item){
                if(item !== null) {
                    var itemId = item.id;
                    var itemInfo = gwApiUrlHelper.GetContentFromAreaWithVal(gw2ApiUrls.Items, itemId);
                    itemInfo.then(function (value) {
                        var thisItem = value.data;
                        thisItem.Quantity = item.count;
                        if(thisItem.details != undefined && thisItem.details.charges != undefined){
                            thisItem.Quantity = thisItem.details.charges;
                        }
                        $scope.InventoryItems.push(thisItem);
                        console.log(value.data);
                    });
                }
            });
        });
    }
}]);