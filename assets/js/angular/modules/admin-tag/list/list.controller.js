'use strict';

angular.module('start.controllers').controller("AdminTagListCtrl", function($scope, $location, Tag) {

    $scope.currentPage = 0;
    $scope.query = {'sort[label]':1, page: $scope.currentPage};
    $scope.tags = Tag.query($scope.query);

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $scope.query = angular.extend({}, $scope.query, {page: $scope.currentPage});
        $scope.tags = Tag.query($scope.query);
    };

    $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.query = angular.extend({}, $scope.query, {page: $scope.currentPage});
        $scope.tags = Tag.query($scope.query);
    };

    $scope.deleteTag = function(index){
        console.log(index);
        $scope.tags[index].$delete();
        $scope.tags.splice(index, 1);
    };

    $scope.search = function () {
        var query = {label: {$regex: $scope.searchInput, $options: 'i'}};
        $scope.currentPage = 0;
        $scope.query = angular.extend({}, $scope.query, {page: $scope.currentPage}, {query: query});
        $scope.tags = Tag.query($scope.query);
        return;
    };

});
