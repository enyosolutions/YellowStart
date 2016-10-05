'use strict';

angular.module('start.controllers').controller("AdminStartupListCtrl", function($scope, $location, Startup) {

    var query = {'sort[startupName]':1};
    $scope.currentPage = 0;
    $scope.startups = Startup.query(angular.extend({page: $scope.currentPage}, query));

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $scope.startups = Startup.query(angular.extend({page: $scope.currentPage}, query));
    };


    $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.startups = Startup.query(angular.extend({page: $scope.currentPage}, query));
    };

    $scope.deleteStartup = function(index){
        console.log(index);
        $scope.startups[index].$delete();
        $scope.startups.splice(index, 1);
    };


    $scope.search = function () {
        $scope.startups = Startup.query(angular.extend({page: 0}, {search: $scope.searchInput}, query));
        return;
    };

});
