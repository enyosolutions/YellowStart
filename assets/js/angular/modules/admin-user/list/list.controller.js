'use strict';

angular.module('start.controllers').controller("AdminUserListCtrl", function($scope, $location, $filter, Auth, AdminUser, UserService, $ngBootbox) {
   $scope.users = AdminUser.query();
    $scope.currentUser = {};
    $scope.activateUser = function(index){
        $scope.users[index].isActive = true;
        $scope.users[index].$update();
    };
    $scope.deleteUser = function(index){
        console.log(index);
        $scope.users[index].$delete();
        $scope.users.splice(index, 1);
    };

    $scope.editUser = function(index){
        $scope.currentUser = $scope.users[index];
    };

    $scope.updateUser = function(index){
        $scope.currentUser.$update();
    };


});