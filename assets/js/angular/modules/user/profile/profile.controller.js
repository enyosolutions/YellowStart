'use strict';

angular.module('start.controllers').controller("ProfileCtrl", function($scope, $rootScope, Startup) {
    $scope.pageClass = 'user-profile';
    console.log($rootScope.globals.user);
    $scope.starredStartups = Startup.query({ids: $rootScope.globals.user.bookmarks});
});