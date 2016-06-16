'use strict';

angular.module('start.controllers').controller("AdminStartupListCtrl", function($scope, $location, Startup) {

    $scope.startups = Startup.query();

});