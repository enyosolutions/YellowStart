'use strict';

angular.module('start.controllers').controller("AdminLunaStartupListCtrl", function($scope, $location, $http, LunaStartup, $ngBootbox) {

    $scope.currentPage = 0;
    $scope.queryIsLoading = true;
    $scope.selection = [];
    $scope.startupsLuna = LunaStartup.query({page:$scope.currentPage});
    $scope.startupsLuna.$promise.then(function(res){
        $scope.queryIsLoading  = false;
    })
    var query = {};
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $scope.startupsLuna = LunaStartup.query(angular.extend({page: $scope.currentPage}, query));
    };


    $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.startupsLuna = LunaStartup.query(angular.extend({page: $scope.currentPage}, query));
    };
    $scope.importStartup = function(_id){
        $scope.queryIsLoading = true;
        return $http.get('/api/luna/actions?import='+ _id).then(function(resp){
            $scope.queryIsLoading = false;
            $ngBootbox.alert("<h3> L'import a bien été effectué</h3>");
        },
            function(resp){
                $scope.queryIsLoading = false;
                $ngBootbox.alert("<h3> L'import a échoué. Merci de reessayer</h3>");
            }
        );
    };

    $scope.importStartups = function(){

        for(var i in $scope.selection){
            $scope.importStartup(list[i]);
        }
    };

    $scope.downloadStartups = function(){
        $scope.queryIsLoading = true;
        return $http.get('/api/luna/actions?dlStartups=1').then(function(resp){
            $scope.queryIsLoading = false;
            $ngBootbox.alert("<h3> Le téléchargement a bien été effectué</h3>");
            $scope.currentPage = 0;
            $scope.startupsLuna = LunaStartup.query({page:$scope.currentPage});
        });
    };

    $scope.toggle = function(_id){
var idx = $scope.selection.indexOf(_id);
        if(idx === -1){
            $scope.selection.push(_id);
        }
        else{
            $scope.selection.splice(idx,1);
        }
    };

    function GetAll() {
        console.log("list all");

    }


});