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
                gwApiUrlHelper.GetContentFromAreaWithVal(gw2ApiUrls.Files, "icon_" + value.data.profession.toLowerCase() + "_big").then(function (value){
                    $scope.selectedCharacter.Icon = value.data;
                    $scope.GetSpecializations();
                    $scope.GetInventory();
                });

                console.log($scope.selectedCharacter);
            },
            function(error){console.log(error);});
    };
    $scope.GetSpecializations = function(){
        $scope.selectedCharacter.specializations.pve.forEach(function (spec, idx) {
            gwApiUrlHelper.GetContentFromAreaWithVal(gw2ApiUrls.Specializations, spec.id).then(function(value){
                $scope.selectedCharacter.specializations.pve[idx] = value.data;
                var specDetails = value.data;
                if(specDetails.elite){
                    $scope.selectedCharacter.profession = specDetails.name;
                    $scope.selectedCharacter.Icon.icon = specDetails.profession_icon_big;
                }
            });
        });
    };
    $scope.GetInventory = function(){
            var char = $scope.selectedCharacter;
            var bags = char.bags;
            $scope.InventoryItems = [];
            bags.forEach(function(bag, bagIdx){
                if(bag != null) {
                    var inventory = bag.inventory;
                    inventory.forEach(function (item, itmIdx) {
                        if (item !== null) {
                            var itemId = item.id;
                            var itemInfo = gwApiUrlHelper.GetContentFromAreaWithVal(gw2ApiUrls.Items, itemId);
                            itemInfo.then(function (value) {
                                $scope.selectedCharacter.bags[bagIdx].inventory[itmIdx] = value.data;
                                var thisItem = value.data;
                                thisItem.Quantity = item.count;
                                if (thisItem.details != undefined) {
                                    if (thisItem.details.charges != undefined) {
                                        thisItem.Quantity = thisItem.details.charges;
                                    }
                                    if (thisItem.details.description != undefined && thisItem.description == undefined) {
                                        thisItem.description = thisItem.details.description;
                                    }
                                }
                                $scope.InventoryItems.push(thisItem);
                            });
                        }
                    });
                }
            });
        }
    $scope.prettyPrint = function (obj) {
        var str = JSON.stringify(obj, undefined, 4);
        return str;
    }

}]);