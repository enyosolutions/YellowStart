'use strict';

angular.module('start.controllers').controller("AdminStartupListCtrl", function($scope, $location, Startup) {

    $scope.currentPage = 0;
    $scope.query = {'sort[startupName]':1, page: $scope.currentPage};
    $scope.startups = Startup.query($scope.query);

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $scope.query = angular.extend({}, $scope.query, {page: $scope.currentPage});
        $scope.startups = Startup.query($scope.query);
    };


    $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.query = angular.extend({}, $scope.query, {page: $scope.currentPage});
        $scope.startups = Startup.query($scope.query);
    };

    $scope.deleteStartup = function(index){
        console.log(index);
        $scope.startups[index].$delete();
        $scope.startups.splice(index, 1);
    };

    $scope.search = function () {
        $scope.query = angular.extend({}, $scope.query, {page: $scope.currentPage}, {search: $scope.searchInput});
        $scope.startups = Startup.query($scope.query);
        return;
    };

});
