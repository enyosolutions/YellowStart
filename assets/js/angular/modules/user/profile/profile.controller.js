'use strict';

angular.module('start.controllers').controller("ProfileCtrl", function($scope, Startup) {
    $scope.pageClass = 'user-profile';

    $scope.starredStartups = Startup.query({search: 'd'});
});