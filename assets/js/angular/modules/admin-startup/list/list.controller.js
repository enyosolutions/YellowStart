'use strict';

angular.module('start.controllers').controller("AdminStartupListCtrl", function($scope, $location, Startup) {

    $scope.currentPage = 0;
    $scope.startups = Startup.query({page:$scope.currentPage});
    var query = {};
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
        $scope.startups = Startup.query({search: $scope.searchInput});
        return;
    };

});