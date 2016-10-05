'use strict';

angular.module('start.controllers').controller("AdminStartupListCtrl", function($scope, $location, Startup) {

    $scope.query = {'sort[startupName]':1};
    $scope.currentPage = 0;
    $scope.startups = Startup.query(angular.extend({page: $scope.currentPage}, $scope.query));

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $scope.query = angular.extend({page: $scope.currentPage}, $scope.query);
        $scope.startups = Startup.query($scope.query);
    };


    $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.query = angular.extend({page: $scope.currentPage}, $scope.query);
        $scope.startups = Startup.query($scope.query);
    };

    $scope.deleteStartup = function(index){
        console.log(index);
        $scope.startups[index].$delete();
        $scope.startups.splice(index, 1);
    };

    $scope.search = function () {
        $scope.query = angular.extend({page: 0}, {search: $scope.searchInput}, $scope.query));
        $scope.startups = Startup.query($scope.query);
        return;
    };

});
