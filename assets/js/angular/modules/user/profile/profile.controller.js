'use strict';

angular.module('start.controllers').controller("ProfileCtrl", function($scope, $rootScope, Startup) {
    $scope.pageClass = 'user-profile';

    $scope.starredStartups = Startup.query({search: 'd'});
    $scope.starredStartups = Startup.query({ids: $rootScope.globals.user.bookmarks});
});