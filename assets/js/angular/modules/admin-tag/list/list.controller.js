'use strict';

angular.module('start.controllers').controller("AdminTagListCtrl", function($scope, $location, Tag) {

    $scope.currentPage = 0;
    $scope.tags = Tag.query({page:$scope.currentPage});
    var query = {'sort[name]':1};

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
        $scope.tags = Tag.query(angular.extend({page: $scope.currentPage}, query));
    };

    $scope.nextPage = function () {
        $scope.currentPage++;
        $scope.tags = Tag.query(angular.extend({page: $scope.currentPage}, query));
    };

    $scope.deleteTag = function(index){
        console.log(index);
        $scope.tags[index].$delete();
        $scope.tags.splice(index, 1);
    };

});