'use strict';

angular.module('start.controllers').controller("AdminUserListCtrl", function($scope, $location, Auth, AdminUser) {
   $scope.users = AdminUser.query();
});