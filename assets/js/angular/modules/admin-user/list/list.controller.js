'use strict';

angular.module('start.controllers').controller("AdminUserListCtrl", function($scope, $location, Auth, AdminUser, UserService) {
   $scope.users = AdminUser.query();

    $scope.activateUser = function(index){
        $scope.users[index].isActive = true;
        $scope.users[index].$update();
    };


});