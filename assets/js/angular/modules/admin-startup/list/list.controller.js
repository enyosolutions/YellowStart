'use strict';

angular.module('start.controllers').controller("AdminStartupListCtrl", function($scope, $location, Auth, AdminUser, Startup) {
   $scope.users = Startup.query();

});