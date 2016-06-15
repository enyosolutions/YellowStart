'use strict';

angular.module('start.controllers').controller("ProfileCtrl", function ($scope, $rootScope, Startup) {

    $scope.sortByName = function () {
        $scope.starredStartups = Startup.query(angular.extend({ 'sort[startupName]': 1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.sortByViews = function () {
        $scope.starredStartups = Startup.query(angular.extend({'sort[meta.views]': -1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.sortByCreatedDate = function () {
        $scope.searchedStartupsstarredStartups = Startup.query(angular.extend({'sort[createdAt]': -1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.sortByBookmarks = function () {
        $scope.starredStartups = Startup.query(angular.extend({ 'sort[meta.bookmarks]': -1}, query));
    };

    $scope.pageClass = 'user-profile';
    console.log($rootScope.globals.user);
    $scope.starredStartups = Startup.query({ids: $rootScope.globals.user.bookmarks});
});