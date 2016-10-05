'use strict';

angular.module('start.controllers').controller("AdminTagListCtrl", function($scope, $location, Tag) {

    $scope.query = {'sort[name]':1};
    $scope.currentPage = 0;
    $scope.tags = Tag.query(angular.extend({page: $scope.currentPage}, $scope.query));

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $scope.query = angular.extend({page: $scope.currentPage}, $scope.query);
        $scope.tags = Tag.query($scope.query);
    };

    $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.query = angular.extend({page: $scope.currentPage}, $scope.query);
        $scope.tags = Tag.query($scope.query);
    };

    $scope.deleteTag = function(index){
        console.log(index);
        $scope.tags[index].$delete();
        $scope.tags.splice(index, 1);
    };

    $scope.search = function () {
        $scope.query = angular.extend({page: 0}, {search: $scope.searchInput}, $scope.query);
        $scope.tags = Tag.query($scope.query);
        return;
    };

});
